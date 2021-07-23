//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true,useUnifiedTopology:  true,useFindAndModify: true,useCreateIndex: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ["password"]});
const User = new mongoose.model("User",userSchema);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public/"));


app.get("/",function (req,res) {
    res.render("home");
});

app.get("/register",function (req,res) {
    res.render("register");
});

app.get("/login",function (req,res) {
    res.render("login");
});



app.post("/register",function (req,res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function (err) {
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});


app.post("/login",function (req,res) {
    const userName = (req.body.username).trim();
    const password = (req.body.password).trim();
    User.findOne({email: userName},function (err,foundUser) {
        if (err) {
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
        
    });
});





app.listen(3000,function (req,res) {
    console.log("Server has Started on port 3000");
});


