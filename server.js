// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

"use strict";

// Depends
var express = require("express");
var bodyParser = require("body-parser");
var mongo = require("mongodb");

// Ports
var httpPort = 3000;
var mongoPort = 27017;

// Intialize
var app = express();
var jsonParser = bodyParser.json();
var mongoClient = mongo.MongoClient;

// Data
var hostname = "localhost";
var db = "test";
var url = "mongodb://" + hostname + ":" + mongoPort + "/" + db;

// Listen on httpPort 3000
app.listen(httpPort, function() {
    console.log("Running node server on port", httpPort);
});

// MongoDB
var db = mongoClient.connect(url, function(err, databaseConnection) {
    console.log("Running MongoDB server on port", mongoPort);
    if (err) {
        throw err;
    }
    else {
        db = databaseConnection;
    }
});


// Handle POST request
app.post("/links", jsonParser, function (req, res) {
    var title = req.body.title;
    console.log("TITLE", title);
    var url = req.body.link;
    console.log("URL", url);
    //var clicks = parseInt(req.body.clicks);

    if (title !== undefined && url !== undefined) {
        db.collection("links", function(err, collection) {
            collection.update({ "title": title, "link": url }, { $inc:{ "clicks": 1 } }, { upsert: true }, function(err) {
                if (err) {
                    res.send(JSON.stringify("ERROR"));
                } else {
                    res.send(JSON.stringify("OK"));
                }
            });
        });
    } else {
        res.send(JSON.stringify("ERROR"));
    }
});


// Handle GET request
app.get("/links", jsonParser, function (req, res) {
    db.collection("links", function(err, collection) {
        collection.find({},{ _id: 0 }).toArray(function(err, result) {
            if (!err) {
                res.send(JSON.stringify(result));
            }
        });
    });
});


// Handle GET request
app.get("/click/:title", jsonParser, function (req, res) {
    var title = req.params.title;
    db.collection("links", function(er, collection) {
        collection.find({
            "title": title
        }, {
            _id: 0
        }).toArray(function(err, result) {
            if (!err) {
                res.send(JSON.stringify(result));
            }
        });
    });
});
