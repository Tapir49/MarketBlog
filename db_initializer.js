const mongoose = require("mongoose");
const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs');
const rawdata = fs.readFileSync(__dirname+"/blog-posts.csv");

const parse = require('csv-parse/lib/sync')

let records = parse(rawdata, {
    columns: true,
});

// console.log(records)
mongoose.connect('mongodb://localhost:27017/postsDB',
    {useNewUrlParser: true}, function () {
    console.log("db connection successful");
})

const blogPostSchema = {
    state: String,
    municipality: String,
    address: String,
    banner: String,
    posted: Date,
    type: String,
    region: String,
    group: String,
    link: String,
    content: String
};

const blogPost = mongoose.model('BlogPost', blogPostSchema);

parseData(records)
    .then((res) => {
        blogPost.insertMany(res, {}, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("all data saved");
                mongoose.connection.close();
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })


async function parseData(records) {
    for (let i = records.length - 1; i >= 0; i--) {
        if (i % 10 === 0) {
            console.log("THIS IS PROGRESS " + i)
        }
        if (records[i]["link"].length === 0) {
            records.splice(i, 1);
        } else {
            const blog_text = await getBlogText(records[i]["link"])
            if (blog_text === null) {
                console.log(i);
                records[i]["content"] = "";
            } else {
                records[i]["content"] = blog_text;
            }
        }
    }
    return records
}
async function getBlogText(link) {
    let result = null;
    await Promise.resolve(axios.get(link)
        .then( (res) => {
            const $ = cheerio.load(res.data);
            // regex code to remove line breaks courtesy of
            // https://www.geeksforgeeks.org/how-to-remove-all-line-breaks-from-a-string-using-javascript/
            result = $('.post-body').text().replace( /[\r\n]+/gm, " " );
            // console.log(result)
        })
        .catch((error) => {
            console.log(error);
        }))
    // print(result)
    return result
}