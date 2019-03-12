'use strict'

var async = require('async');
var aguid = require('aguid');
var bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
var MongoClient = require('mongodb').MongoClient;
const DBNAME = "lbmesh";
var url = "mongodb://localhost:27017/" + DBNAME;


var hashPassword = function(plain){
    var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    return bcrypt.hashSync(plain, salt);
};

MongoClient.connect(url, {"useNewUrlParser": true}, function(err, db) {

    if( err ){
        console.log( err );
    } else {
        var dbase = db.db(DBNAME);
        async.parallel([
            function(callback){
                dbase.createCollection("version", function(err, results) {
                    callback(results);
                 });
            },
            function(callback){
                dbase.collection("version").insertOne({"appversion":"1.1.6","cacheSize":"3","iphoneurl":"http://apple.com","androidurl":"http://google.com","optional":false,"message":"There is a new version available. Please visit the appstore to update"})
            },
            function(callback){
                dbase.createCollection("homepage", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                dbase.collection("homepage").insertOne({"type":"default","content":"ready for content"})
            },
            function(callback){
                dbase.createCollection("AdminAccessToken", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                dbase.createCollection("CustomerWebAccessToken", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                dbase.createCollection("CustomerWebSessions", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                dbase.createCollection("CustomerMobileAccessToken", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                dbase.createCollection("CustomerMobileSessions", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                dbase.createCollection("AdminSessions", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                dbase.createCollection("admin", function(err, results) { 
                    callback(results);
                });
            },
            function(callback){
                dbase.collection("admin").insertOne({"fullname":"Demo User","username":"demo@demo.com","email":"demo@demo.com","password":hashPassword('demo123'),"permissions":"member,data,billing,import,reports"})
            },
            function(callback){
                dbase.createCollection("customer", function(err, results) { 
                    callback(results);
                });
            },
        ], function(err, results){
                //console.log(results);
                db.close();
                console.log("mongo db schema created done");

        });
    }
});