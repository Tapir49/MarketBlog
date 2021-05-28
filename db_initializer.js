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

// get data ready for the db
parseData(records)
    .then((res) => {
        // once data is ready, insert it into the database
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

// go through data from csv file and prepare it
// - remove items that do not have a link (these posts are not up yet)
// - scrape text from blog post and add to each post object
async function parseData(records) {
    for (let i = records.length - 1; i >= 0; i--) {
        // print how many records remain every 10 records
        if (i % 10 === 0) {
            console.log("THIS IS PROGRESS " + i)
        }
        // if there is no link, remove the post
        if (records[i]["link"].length === 0) {
            records.splice(i, 1);
        } else {
            // if there is a link, get text from post
            const blog_text = await getBlogText(records[i]["link"])
            if (blog_text === null) {
                // if the scraper returns no text print the item link and set content to an empty string
                console.log(i);
                records[i]["content"] = "";
            } else {
                // add blog text to the relevant post object
                records[i]["content"] = blog_text;
            }
        }
    }
    return records
}

// scrape text from blog at given link
async function getBlogText(link) {
    let result = null;
    await Promise.resolve(axios.get(link)
        .then( (res) => {
            const $ = cheerio.load(res.data);
            // get all the text from the post in the "post-body" class div
            // replace new lines with a space
            // regex code to remove line breaks courtesy of
            // https://www.geeksforgeeks.org/how-to-remove-all-line-breaks-from-a-string-using-javascript/
            result = $('.post-body').text().replace( /[\r\n]+/gm, " " );
        })
        .catch((error) => {
            console.log(error);
        }))
    return result
}