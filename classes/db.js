/*
 Copyright (c) Innovative Thinkrs LLC. 2019. All Rights Reserved.
 This project is licensed under the MIT License, full text below.

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
'use strict'

const Base      = require('./Base');
const chalk     = require('chalk');
const LOG       = console.log;
const ejs       = require('ejs');
const fs        = require('fs');
const path      = require('path');
const sh        = require('shelljs');
const table     = require('markdown-table');
const _         = require('underscore');

class Db extends Base{
    constructor(){
        super();
    }

    retrievePorts(){
        let selected = {
            "table": "",
            "sourceData": {}
        };
        let myDBStack = [];
            myDBStack.push(['DB','Port','Image']);
        let DBList = ['mongodb','mysql','cloudant','redis','postgres','mssql'];

        this.portsList = this.readGlobalConfig();
        
        _.each( DBList, (data) =>{
            myDBStack.push([data.toUpperCase(),this.portsList.dbStack[data].port,this.portsList.dbStack[data].image])
        });

        selected.table = table(myDBStack,{ start: '  |'});
        selected.sourceData = this.portsList.dbStack;
           
        return selected;
         
    }

    updatePorts(updates){
       // LOG(updates);
        this.portsList.dbStack[updates.chosenDB].port = parseInt(updates.newPort);

        /**
         * Write Global config
         */
        this.writeGlobalConfigWithObject(this.portsList);

        /**
         * Update Config with YAML
         */
        const machineData = this.portsList;
            ejs.renderFile( path.join(machineData.templatefolder,'db','lbmesh-db-stack.ejs'), {
                "mysql_image":    machineData.dbStack.mysql.image,
                "mysql_port":     machineData.dbStack.mysql.port,
                "mysql_data":     path.join(machineData.homedir,'.lbmesh.io','mysql','data'),
                "cloudant_image": machineData.dbStack.cloudant.image,
                "cloudant_port":  machineData.dbStack.cloudant.port,
                "cloudant_data":     path.join(machineData.homedir,'.lbmesh.io','cloudant','data'),
                "mongodb_image":  machineData.dbStack.mongodb.image,
                "mongodb_port":   machineData.dbStack.mongodb.port,
                "mongodb_data":     path.join(machineData.homedir,'.lbmesh.io','mongodb','data'),
                "mongodb_config":   path.join(machineData.homedir,'.lbmesh.io','mongodb','config'),
                "redis_image":   machineData.dbStack.redis.image,
                "redis_port":     machineData.dbStack.redis.port,
                "redis_data":     path.join(machineData.homedir,'.lbmesh.io','redis','data'),
                "postgres_image": machineData.dbStack.postgres.image,
                "postgres_port":  machineData.dbStack.postgres.port,
                "postgres_data":  path.join(machineData.homedir,'.lbmesh.io','postgres','data'), 
                "mssql_image": machineData.dbStack.mssql.image,
                "mssql_port":  machineData.dbStack.mssql.port   
            },{}, function(err,str){
                if( err ) console.log(err);
                fs.writeFileSync( path.join(machineData.homedir,'.lbmesh.io','lbmesh-db-stack.yaml'), str);
            });

        /**
         * Write Singular DB YAML
         */
            const tempImage = updates.chosenDB + "_image";
            const tempPort  = updates.chosenDB + "_port";
            ejs.renderFile( path.join(machineData.templatefolder,'db','lbmesh-db-'+updates.chosenDB+'.ejs'), {
                [tempImage]:    machineData.dbStack[updates.chosenDB].image,
                [tempPort]:     machineData.dbStack[updates.chosenDB].port,  
                "homedir_data": path.join(machineData.homedir,updates.chosenDB,'.lbmesh.io',updates.chosenDB, 'data'),
                "homedir_config": path.join(machineData.homedir,updates.chosenDB,'.lbmesh.io',updates.chosenDB,'config')
            },{}, function(err,str){
                if( err ) console.log(err);
                fs.writeFileSync( path.join(machineData.homedir,'.lbmesh.io',updates.chosenDB, 'lbmesh-db-'+updates.chosenDB+'.yaml'), str);
            });      
            
        /**
         * Copy to Home Dir
         */
        //sh.cp('-r', path.join(machineData.templatefolder,'db','*.yaml'), path.join(machineData.homedir,'.lbmesh.io'));

        /**
         * Final log Mesages
         */
        LOG();
        LOG('  LB Mesh DB Stack YAML Updated Successful')
        LOG();
        LOG('  - Please restart your desired DB Service using:')
        LOG()
        LOG('      $ lbmesh db');
        LOG();
    }

};

module.exports = Db;