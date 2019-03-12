'use strict'

var async = require('async');
var aguid = require('aguid');
var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
var MongoClient = require('mongodb').MongoClient;

var hashPassword = function(plain){
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    return bcrypt.hashSync(plain, salt);
};

MongoClient.connect(url, function(err, db) {

    if( err ){
        console.log( err );
    } else {
        async.series([
            function(callback){
                db.createCollection("version", function(err, results) {
                    callback(results);
                 });
            },
            function(callback){
                db.collection("version").insert({"appversion":"1.1.6","cacheSize":"3","iphoneurl":"http://apple.com","androidurl":"http://google.com","optional":false,"message":"There is a new version available. Please visit the appstore to update"})
            },
            function(callback){
                db.createCollection("homepage", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                db.collection("homepage").insert({"type":"default","content":"ready for content"})
            },
            function(callback){
                db.createCollection("AdminAccessToken", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                db.createCollection("CustomerWebAccessToken", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                db.createCollection("CustomerWebSessions", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                db.createCollection("CustomerMobileAccessToken", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                db.createCollection("CustomerMobileSessions", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                db.createCollection("AdminSessions", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                db.createCollection("admin", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                db.collection("admin").insert({"fullname":"Demo User","username":"demo@demo.com","email":"demo@demo.com","password":hashPassword('demo123'),"permissions":"member,data,billing,import,reports"})
            },
            function(callback){
                db.createCollection("customer", function(err, results) { 
                    callback(results);
                });
            },
        ], function(err, results){
                console.log(results);
                console.log("mongo db schema created done");

        });
    }
});