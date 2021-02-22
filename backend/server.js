// interface WOD {
//     title: string;
//     activities: string[];
//     id: string;
//     author: string;
//     date_created: string; // I don't know how to get the "Date" object as Date() returns a string
// }

const express = require("express");

const app = express();

const bodyparser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const sha256 = require("crypto-js/sha256");

const stuff = require("./db.data");

var mongoDBuri = "mongodb+srv://wod-tracker_db_reader:" + stuff.password + "@wodtrackerdata.soyzf.mongodb.net/" + stuff.dbname + "?retryWrites=true&w=majority";
mongoose.connect(mongoDBuri, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", function() {
    console.log("Opening database");
})

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    _id: mongoose.Schema.Types.ObjectId,
    wods: []
});
var UserModel = mongoose.model('UserModel', UserSchema, 'wod-collection');

// Set up a whitelist and check against it:
var whitelist = ['http://localhost:4200', 'http://localhost:4200/add', 'http://localhost:4200/wods', 'http://localhost:4200/update'];
var corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyparser.json());

app.listen(8000, () => {
    console.log("Server started on port 8000");
});


// Retrieve all wods from the database
app.route("/api/wods/:user").get((req, res) => {
    console.log("Getting all wods");
    UserModel.findOne({ "username": req.params["user"] }, (err, result) => {
        if (err || result == []) {
            res.send([])
        }
        res.send(result.wods);
    });
    console.log("Retrieved all wods");
});

// Add a new wod
app.route("/api/wods/:user").post((req, res) => {
    // let wod = new UserModel(req.body);
    // wod.save(err => {
    //     if (err)
    //         console.error(err);
    // });
    // res.sendStatus(201).send(req.body);
    // OLD ^^^^^^
    UserModel.findOne({ "username": req.params["user"] }, function(err, user) {
        let mutable = user;
        mutable['wods'].push(req.body);
        UserModel.findByIdAndUpdate(mutable['_id'], mutable, { useFindAndModify: false })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating wod with id=" + mutable['_id']
                });
            });
    });
    res.sendStatus(201).send(req.body);
});

// Update
app.route("/api/wods/:user/:id").post((req, res) => {
    UserModel.findOne({ "username": req.params["user"] }, function(err, user) {
        let mutable = user;
        mutable['wods'].forEach((wod, ind, arr) => {
            if (wod.id == req.params.id) {
                mutable['wods'][ind] = req.body;
            }
        });
        UserModel.findByIdAndUpdate(mutable['_id'], mutable, { useFindAndModify: false })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating wod with id=" + mutable['_id']
                });
            });
    });
    res.sendStatus(200);
});

// Delete a wod from the database
app.route("/api/wods/:user/:id").delete((req, res) => {
    UserModel.findOne({ "username": req.params["user"] }, function(err, user) {
        let mutable = user;
        mutable['wods'].forEach((wod, ind, arr) => {
            if (wod.id == req.params.id) {
                if (mutable['wods'].length == 1) {
                    mutable['wods'] = [];
                } else
                    mutable['wods'] = mutable['wods'].splice(ind, 1);
            }
        });
        UserModel.findByIdAndUpdate(mutable['_id'], mutable, { useFindAndModify: false })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating wod with id=" + mutable['_id']
                });
            });
    });
    res.sendStatus(204);
});

// Locate a certain user (for registry)
app.route("/api/register/").post((req, res) => {
    console.log("Creating a new user");
    let mutable = {...req.body };
    mutable['_id'] = new mongoose.Types.ObjectId();
    mutable['password'] = sha256(mutable['password']);
    console.log(mutable);
    let new_user = UserModel(mutable);
    console.log(new_user);


    UserModel.find({ username: mutable.username }, (err, result) => {
        console.log(result);
        if (err) {
            console.error(err);
        }
        if (result.length > 0) {
            res.sendStatus(500);
            return;
        } else {
            console.log("Saving user");
            new_user.save((err) => {
                if (err)
                    console.error(err);
            });
            console.log("Saved user");
            res.sendStatus(201);
            return;
        }
    });
    console.log("New user created");
});

// Locate a certain user (for login)
app.route("/api/login/:user/:password").get((req, res) => {
    console.log("Logging in");
    UserModel.find({ "username": req.params.user }, function(err, users) {
        if (err) {
            console.log("(login) server.js:164");
            console.log(err);
        }
        if (users.length > 1) {
            console.log("Somehow there are too many users with that username");
        }
        let user = users[0];
        let password = sha256(req.params.password);
        // let password = req.params.password;
        if (user.password == password) {
            res.send(true);
            return;
        } else {
            console.log(password);
            res.send(false);
        }
    });
    console.log("Logged in");
});
