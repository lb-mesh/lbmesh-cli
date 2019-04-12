#!/usr/bin/env node
/*
 Copyright (c) Innovative Thinkrs LLC 2019. All Rights Reserved.
 This project is licensed under the MIT License, full text below.

Author: Jamil Spain, jamilhassanspain@gmail.com

 --------

 MIT license

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
'use strict';

const CryptoJS          = require('crypto-js');
const defaultKey        = "LBMesh.IO";
const debug             = require('debug')("app:cli:files");
const ejs               = require('ejs');
const fs                = require('fs');
 
const machine           = require('lbmesh-os').profile();
const path              = require('path');
const read              = require('read-file');
const sh                = require('shelljs');
const writeFile         = require('write');

module.exports = {
    getProjectObject: () => {
        let myProject = {
            "name": "",
            "path": "",
            "apps": {
                "www": {"port":0},
                "admin": {"port":0},
                "api": {"port":0},
                "scheduler": {"port":0},
                "messenger": {"port":0},
                "databank": {"port":0}
            }
        };
        return myProject;
    },
    readGlobalFile: () => {
        let fileString = read.sync( path.join(machine.homedir,".lbmesh.io","global-config"), 'utf8');
        debug( fileString );
        let bytes = CryptoJS.AES.decrypt(fileString, defaultKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    },
    writeGlobalFile: (dataObject) => {
        let plaintext =  CryptoJS.AES.encrypt(JSON.stringify(dataObject,null,2), defaultKey);
        writeFile.sync( path.join(machine.homedir,".lbmesh.io","global-config"), plaintext.toString() );
    },
    encryptGlobalObject: (dataObject) => {
        debug("Entering encryptGlobalObject() ");
            debug(dataObject);
            debug(defaultKey);
        let plaintext =  CryptoJS.AES.encrypt(JSON.stringify(dataObject,null,2), defaultKey);
        debug("Data Encrypted");
            debug(plaintext);
        return plaintext.toString();
    },
    decryptGlobalObject: (dataString) => {
        debug("Entering decryptGlobalObject ");
            debug(dataString);
        let bytes = CryptoJS.AES.decrypt(dataString, defaultKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    },
    readProjectFile: (folderpath) => {
        let projObject;
        let fileString = read.sync( path.join(folderpath, "lbmesh-config.json"), 'utf8');
        return JSON.parse(fileString);  
    },
    importProjectFile: (folderpath) => {
        let projObject;
        let fileString = read.sync( folderpath, 'utf8');
        return JSON.parse(fileString);  
    },
    jumpstartDbStack: (data) => {
        
        let myList = ['mongodb','mysql','cloudant','redis','postgres','mssql'];
        let tempImage = "";
        let tempPort = "";
        ejs.renderFile( path.join(data.templatefolder,'db','lbmesh-db-stack.ejs'), {
            "mysql_image":    data.dbStack.mysql.image,
            "mysql_port":     data.dbStack.mysql.port,
            "mysql_data":  path.join(data.homedir,'.lbmesh.io','mysql','data'),
            "cloudant_image": data.dbStack.cloudant.image,
            "cloudant_port":  data.dbStack.cloudant.port,
            "cloudant_data":  path.join(data.homedir,'.lbmesh.io','cloudant','data'),
            "mongodb_image":  data.dbStack.mongodb.image,
            "mongodb_port":  data.dbStack.mongodb.port,
            "mongodb_data":  path.join(data.homedir,'.lbmesh.io','mongodb','data'),
            "mongodb_config":  path.join(data.homedir,'.lbmesh.io','mongodb','config'),
            "redis_image":   data.dbStack.redis.image,
            "redis_port":     data.dbStack.redis.port,
            "redis_data":  path.join(data.homedir,'.lbmesh.io','redis','data'),
            "postgres_image": data.dbStack.postgres.image,
            "postgres_port":  data.dbStack.postgres.port, 
            "postgres_data":  path.join(data.homedir,'.lbmesh.io','postgres','data'), 
            "mssql_image": data.dbStack.mssql.image,
            "mssql_port":  data.dbStack.mssql.port   
        },{}, function(err,str){
            if( err ) console.log(err);
            fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','lbmesh-db-stack.yaml'), str);
        });

        myList.forEach( (db) => {
            tempImage = db + "_image";
            tempPort  = db + "_port";
            ejs.renderFile( path.join(data.templatefolder,'db','lbmesh-db-'+ db +'.ejs'), {
                [tempImage]:    data.dbStack[db].image,
                [tempPort]:    data.dbStack[db].port,  
                "homedir_data": path.join(data.homedir,'.lbmesh.io',db,'data'),
                "homedir_config": path.join(data.homedir,'.lbmesh.io',db,'config')
            },{}, function(err,str){
                if( err ) console.log(err);
                fs.writeFileSync( path.join(data.homedir,'.lbmesh.io',db,'lbmesh-db-'+ db +'.yaml'), str);
            });              
        });

        /**
         * Write the final YAML Files
         */
       // sh.cp('-r', path.join(data.templatefolder,'db','*.yaml'), path.join(data.homedir,'.lbmesh.io'));


    },
    jumpstartIntegStack: (data) => {
         
        let myList = ['datapower','mqlight'];
            // mq, acemqserver, iib
        ejs.renderFile( path.join(data.templatefolder,'integ','lbmesh-integ-stack.ejs'), {
            "mqlight_data": path.join(data.homedir,'.lbmesh.io','mqlight','data'),
            "datapower_config": path.join(data.homedir,'.lbmesh.io','datapower','config'),
            "datapower_local": path.join(data.homedir,'.lbmesh.io','datapower','local'),
        },{}, function(err,str){
            if( err ) console.log(err);
            fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','lbmesh-integ-stack.yaml'), str);
        });

        /**
         * DataPower
         */
            ejs.renderFile( path.join(data.templatefolder,'integ','lbmesh-integ-datapower.ejs'), {
                "datapower_local": path.join(data.homedir,'.lbmesh.io','datapower','data'),
                "datapower_config": path.join(data.homedir,'.lbmesh.io','datapower','config')
            },{}, function(err,str){
                if( err ) console.log(err);
                fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','datapower','lbmesh-integ-datapower.yaml'), str);
            });         

        /**
         * MQ Light
         */
            ejs.renderFile( path.join(data.templatefolder,'integ','lbmesh-integ-mqlight.ejs'), {
                "mqlight_data": path.join(data.homedir,'.lbmesh.io','mqlight','data')
            },{}, function(err,str){
                if( err ) console.log(err);
                fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','mqlight','lbmesh-integ-mqlight.yaml'), str);
            }); 
        
        /**
         * MQ Advanced
         */

        /**
         * IIB
         */

        /**
         * ACE MQ SERVER
         */


        /**
         * Write the final YAML Files
         */
        //sh.cp('-r', path.join(data.templatefolder,'integ','*.yaml'), path.join(data.homedir,'.lbmesh.io'));
    }
};