const mongoose = require("mongoose");

const fs = require('fs');
const rawdata = fs.readFileSync(__dirname+"/blog-posts.csv");

const parse = require('csv-parse/lib/sync')

const records = parse(rawdata, {
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
    link: String
};

const blogPost = mongoose.model('BlogPost', blogPostSchema);

blogPost.insertMany(records, {}, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("all data saved");
        mongoose.connection.close();
    }
})