const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost:27017/postsDB',
    {useNewUrlParser: true}, function () {
        console.log("db connection successful");
    });

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
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

app.listen(3000, function () {
    console.log("server started at 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/homepage.html")
})

app.get('/archive', function (req, res) {
    res.sendFile(__dirname + "/public/archive.html")
})

app.get('/regions', function (req, res) {
    res.sendFile(__dirname + "/public/regions.html")
})

app.get("/get_all_blog_posts", function (req, res) {
    BlogPost.find( function (err, data) {
        if (err) {
            res.send({
                "message": "internal server error",
                "data": []
            });
        } else {
            res.send({
                "message": "success",
                "data": data
            })
        }
    })
});

app.get("/get_blog_post_by_id", function (req, res) {
    BlogPost.find({"_id": req.query.blog_id},  function (err, data) {
        if (err) {
            res.send({
                "message": "internal server error",
                "data": []
            });
        } else {
            res.send({
                "message": "success",
                "data": data
            })
        }
    })
});