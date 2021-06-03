require('dotenv').config()

const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");

const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


//Initialize passport
app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/postsDB',
    {useNewUrlParser: true, useUnifiedTopology: true}, function () {
        console.log("db connection successful");
    });
mongoose.set("useCreateIndex", true);

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

// suggestion to use {typeKey: '$type'} comes from
// https://stackoverflow.com/questions/33846939/mongoose-schema-error-cast-to-string-failed-for-value-when-pushing-object-to
// Used because mongoose was rejecting liked blogposts due to a CastError
const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            require: true,
            minLength: 3
        },
        password: {
            type: String,
            require: true
        },
        firstname: {
            type: String,
            required: true
        },
        admin: {
            type: Boolean,
            required: true,
        },
        likes: [
            {
                post_id: String,
                state: String,
                municipality: String,
                address: String,
                banner:String,
                posted: String,
                postType: String,
                region: String,
                group: String
            }
        ]
    }
);

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

//Configure passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get('/contact', function (req, res) {
    res.sendFile(__dirname + "/public/contact.html")
})

app.get('/contact', function (req, res) {
    res.sendFile(__dirname + "/public/contact.html")
})

app.get('/map', function (req, res) {
    res.sendFile(__dirname + "/public/map.html")
})

app.get('/get_current_user', function (req, res) {
    if (req.isAuthenticated()) {
        res.send({
            message: "success",
            data: req.user
        });
    } else {
        res.send({
            message: "no login",
            data: {}
        })
    }
});

app.get('/register', (req, res) => {
    if (req.query.errors) {
        res.redirect("/register.html?errors=" + req.query.errors);
    } else {
        res.redirect("/register.html");
    }
});

app.post('/register', (req, res) => {
    console.log("Registering user")
    const newUser = {
        username: req.body.username,
        firstname: req.body.firstname,
        admin: false
    }

    console.log(newUser.firstname)
    User.register(
        newUser,
        req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/register?errors=" + err);
            } else {
                req.login(
                    user,
                    function (err) {
                        if (err) {
                            console.log(err);
                            res.redirect('login?error=Invalid username or password');
                        } else {
                            const authenticate = passport.authenticate("local",
                                {
                                    successRedirect: "/",
                                    failureRedirect: "/login?error=Username and password don't match"
                                })
                            authenticate(req, res);
                        }
                    }
                )
                // res.redirect("/account");
            }
        }
    )
});

app.get('/login', (req, res) => {
    console.log("I am here")
    if (req.query.error) {
        res.redirect("/login.html?error=" + req.query.error);
    } else {
        res.redirect("/login.html");
    }
});

app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
    });
    req.login(
        user,
        function (err) {
            if (err) {
                console.log(err);
                res.redirect('login?error=Invalid username or password');
            } else {
                const authenticate = passport.authenticate("local",
                    {
                        successRedirect: "/",
                        failureRedirect: "/login?error=Username and password don't match"
                    })
                authenticate(req, res);
            }
        }
    )
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/')
});

app.get("/account", (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + "/src/myaccount.html");
    } else {
        res.redirect("/login.html?error=You must login to view your account");
    }
})

app.get("/get_all_blog_posts", function (req, res) {
    BlogPost.find(function (err, data) {
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
    BlogPost.find({"_id": req.query.blog_id}, function (err, data) {
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

app.get('/get_current_user', function (req, res) {
    if (req.isAuthenticated()) {
        res.send({
            message: "success",
            data: req.user
        });
    } else {
        res.send({
            message: "no login",
            data: {}
        })
    }
})

app.post('/save_post', function (req, res) {
    if (req.isAuthenticated()) {
        const blog_post = {
            post_id: req.body.post_id,
            state: req.body.state,
            municipality: req.body.municipality,
            address: req.body.address,
            banner: req.body.banner,
            posted: req.body.posted,
            postType: req.body.type,
            region: req.body.region,
            group: req.body.group
        }
        User.updateOne({_id: req.user._id, 'likes.post_id': {$ne: blog_post.post_id}},
            {
                $push: {likes: blog_post}
            },
            {},
            (err) => {
                if (err) {
                    res.send({
                        message: "database errorr"
                    });
                } else {
                    res.send({
                        message: "success"
                    })
                }
            })
    } else {
        res.send({
            message: "You must login to save posts",
            data: "/login"
        })
    }
});

app.post('/unsave_post', function (req, res) {
    if (req.isAuthenticated()) {
        User.updateOne({_id: req.user._id},
            {
                $pull: {likes: {post_id: req.body.post_id}}
            },
            {},
            (err, info) => {
                if (err) {
                    console.log(err);
                    res.send({
                        message: "database errorr"
                    });
                } else {
                    console.log(info);
                    res.send({
                        message: "success"
                    })
                }
            })
    } else {
        res.send({
            message: "You must login first",
            data: "/login"
        })
    }
});