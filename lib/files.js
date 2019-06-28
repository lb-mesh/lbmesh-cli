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

const machine           = require('lbmesh-os').profile();
const path              = require('path');
const CryptoJS          = require('crypto-js');
const defaultKey        = "LBMesh.IO";
const jsontoxml         = require('jsontoxml');
const jsonfile          = require('jsonfile');
const utf8              = require('utf8');
const debug             = require('debug')("app:cli:files");
const ejs               = require('ejs');
const fs                = require('fs');
 
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
    getModelDefinition: () => {
        return {
            "name": "",
            "base": "PersistedModel",
            "idInjection": true,
            "options": {
              "validateUpsert": true
            },
            "properties": {},
            "validations": [],
            "relations": {},
            "acls": [],
            "methods": {}
          };
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
    writeProjectFile: (dataObject) => {
        let projObject;
        projectObject = JSON.stringify(dataObject,null,2);
        writeFile.sync( path.join(process.cwd(),"lbmesh-config.json"), projectObject );
    },
    writeComponentModelMethod: (machineData, folderPath, modelname) => {
        debug( '-- files.writeComponentModelMethod() --' );
        // debug( folderPath );
        // debug( machineData );
        debug( modelname );

        let desiredFolder = "frontend";
        let desiredComponent = modelname.app;
        switch( desiredComponent ){
            case 'messenger':
            case 'databank':
            case 'scheduler':
               desiredFolder = "backend";
            break;
        }

        /**
         * Pull Model File and Parse
         */
        let modelPath = path.join( folderPath, desiredFolder, desiredComponent, 'server','models',modelname.model + '.js');
        let modelText = fs.readFileSync( modelPath ).toString('utf-8');
        let modelTextArray = modelText.split("\n");

        ejs.renderFile( path.join(machineData.templatefolder,'general','model-method-' + modelname.modelmethod + '.ejs'), {
            "modelname": modelname.model.charAt(0).toUpperCase() +  modelname.model.slice(1),
            "methodpath": modelname.modelpath,
            "methodname": modelname.modelfunc
        },{}, function(err, str){
            if( err ) console.log(err);

            let newMethod = utf8.encode( str );
            let newMethodArray = newMethod.split("\n");

            for(var x = 0; x < modelTextArray.length; x++){
                let testString = String(modelTextArray[x]);
         
                if( ! testString.search("module.exports") ){
                    // console.log( x + 1 );
                    let lineNumber = x + 1;
                    modelTextArray.splice(lineNumber,0, newMethodArray.join("\n") );
                }
            }

            fs.writeFileSync( path.join(folderPath, desiredFolder, desiredComponent,'server','models', modelname.model + '.js'), modelTextArray.join("\n") );
        });

    },
    readProjectFile: (folderpath) => {
        
        let fileString = read.sync( path.join(folderpath, "lbmesh-config.json"), 'utf8');
        return JSON.parse(fileString);  
    },
    writeComponentModel: (machineData, folderPath, modelname) => {
         debug( folderPath );
         debug( machineData );
         let desiredFolder = "frontend";
         let desiredComponent = modelname.app;
         switch( desiredComponent ){
             case 'messenger':
             case 'databank':
             case 'scheduler':
                desiredFolder = "backend";
             break;
         }
        /**  
         * Writing Logic File
         * name.charAt(0).toUpperCase() + name.slice(1)
         */
            ejs.renderFile( path.join(machineData.templatefolder,'general','model-js.ejs'), {
                "modelname": modelname.model.charAt(0).toUpperCase() +  modelname.model.slice(1)
            },{}, function(err,str){
                if( err ) console.log(err);
                fs.writeFileSync( path.join(folderPath, desiredFolder ,desiredComponent,'server','models', modelname.model + '.js' ), str);
            }); 
         /**
          * Writin Definition File
          */
            let tempFile = {
                "name": "",
                "base": "PersistedModel",
                "plural": "",
                "idInjection": true,
                "options": {
                  "validateUpsert": true
                },
                "properties": {},
                "validations": [],
                "relations": {},
                "acls": [],
                "methods": {}
              };
                tempFile.name = modelname.model;
                tempFile.plural = modelname.model;
                tempFile.base = modelname.modeltype;

            jsonfile.writeFile(path.join(folderPath, desiredFolder ,desiredComponent,'server','models', modelname.model + '.json' ), tempFile,  { spaces: 2 })
                .then(res => {
                    //console.log('Write complete');
                    //console.log( res );
                })
                .catch(error => console.error(error))
            
    },
    importProjectFile: (folderpath) => {
        let projObject;
        let fileString = read.sync( folderpath, 'utf8');
        return JSON.parse(fileString);  
    },
    jumpstartDbStack: (data) => {
        
        let myList = ['mongodb','mysql','cloudant','redis','postgres','mssql','elasticsearch','cassandra'];
        let tempImage = "";
        let tempPasswd = "";
        let tempAdminPort = 0;
        let tempAdminImage = "";
        let tempAdminUser = "";
        let tempAdminPass = "";
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
            tempPasswd = db + "_env_passwd";
            tempPort  = db + "_port";
            tempAdminImage = db + "_admin_image";
            tempAdminPort  = db + "_admin_port";
            tempAdminUser   = db + "_admin_user";
            tempAdminPass   = db + "_admin_passwd";
           
            if( data.dbStack[db].env.passwd.length > 0 ){
                ejs.renderFile( path.join(data.templatefolder,'db','lbmesh-db-'+ db +'.ejs'), {
                    [tempImage]:    data.dbStack[db].image,
                    [tempPort]:    data.dbStack[db].port,  
                    [tempPasswd]: data.dbStack[db].env.passwd,
                    [tempAdminImage]: data.dbStack[db].admin.image,
                    [tempAdminPort]: data.dbStack[db].admin.port,
                    [tempAdminUser]: data.dbStack[db].admin.user,
                    [tempAdminPass]: data.dbStack[db].admin.passwd,
                    "homedir_data": path.join(data.homedir,'.lbmesh.io',db,'data'),
                    "homedir": path.join(data.homedir,'.lbmesh.io',db),
                    "homedir_config": path.join(data.homedir,'.lbmesh.io',db,'config')
                },{}, function(err,str){
                    if( err ) console.log(err);
                    fs.writeFileSync( path.join(data.homedir,'.lbmesh.io',db,'lbmesh-db-'+ db +'.yaml'), str);
                });
            } else {
 
                ejs.renderFile( path.join(data.templatefolder,'db','lbmesh-db-'+ db +'.ejs'), {
                    [tempImage]:    data.dbStack[db].image,
                    [tempPort]:    data.dbStack[db].port,  
                    [tempAdminImage]: data.dbStack[db].admin.image,
                    [tempAdminPort]: data.dbStack[db].admin.port,
                    [tempAdminUser]: data.dbStack[db].admin.user,
                    [tempAdminPass]: data.dbStack[db].admin.passwd,
                    "homedir_data": path.join(data.homedir,'.lbmesh.io',db,'data'),
                    "homedir": path.join(data.homedir,'.lbmesh.io',db),
                    "homedir_config": path.join(data.homedir,'.lbmesh.io',db,'config')
                },{}, function(err,str){
                    if( err ) console.log(err);
                    fs.writeFileSync( path.join(data.homedir,'.lbmesh.io',db,'lbmesh-db-'+ db +'.yaml'), str);
                });
 
            }
              
        });

        /**
         * Write the final YAML Files
         */
       // sh.cp('-r', path.join(data.templatefolder,'db','*.yaml'), path.join(data.homedir,'.lbmesh.io'));


    },
    updateIntegStackFile: (global, data) => {

        switch(data.instance){
            case 'datapower':
                ejs.renderFile( path.join(global.templatefolder,'integ','lbmesh-integ-datapower.ejs'), {
                    "datapower_local": path.join(global.homedir,'.lbmesh.io','datapower','data'),
                    "datapower_admin": data.admin,
                    "datapower_config": path.join(global.homedir,'.lbmesh.io','datapower','config')
                },{}, function(err,str){
                    if( err ) console.log(err);
                    fs.writeFileSync( path.join(global.homedir,'.lbmesh.io','datapower','lbmesh-integ-datapower.yaml'), str);
                });   
            break;
        }

    },
    jumpstartDashboardApp: (data) => {
        sh.cp('-r', path.join(data.node.globalPath, 'lbmesh-cli','gui') , path.join(data.homedir,'.lbmesh.io','dashboard'));

        ejs.renderFile( path.join(data.templatefolder,'general','pm2-ecosystem.config.ejs'), {
            "homedir_path": path.join(data.homedir,'.lbmesh.io','dashboard','frontend','www','server','server.js'),
        },{}, function(err,str){
            if( err ) console.log(err);
            fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','dashboard','pm2-ecosystem.config.yaml'), str);
        });


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
                "datapower_admin": data.integStack.datapower.port.admin,
                "datapower_local": path.join(data.homedir,'.lbmesh.io','datapower','data'),
                "datapower_config": path.join(data.homedir,'.lbmesh.io','datapower','config')
            },{}, function(err,str){
                if( err ) console.log(err);
                fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','datapower','lbmesh-integ-datapower.yaml'), str);
            });         
        
        /**
         * MQTT
         */
        ejs.renderFile( path.join(data.templatefolder,'integ','lbmesh-integ-mqtt.ejs'), {
            "mqtt_data": path.join(data.homedir,'.lbmesh.io','mqtt','data'),
            "mqtt_config": path.join(data.homedir,'.lbmesh.io','mqtt','config'),
            "mqtt_log": path.join(data.homedir,'.lbmesh.io','mqtt','log'),
            "mqtt_port_admin": data.integStack.mqlight.port.admin,
            "mqtt_port_socket": data.integStack.mqlight.port.socket,
            "mqtt_port_data": data.integStack.mqlight.port.data,
        },{}, function(err,str){
            if( err ) console.log(err);
            fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','mqtt','lbmesh-integ-mqtt.yaml'), str);
        }); 

        /**
         * MQ Light
         */
            ejs.renderFile( path.join(data.templatefolder,'integ','lbmesh-integ-mqlight.ejs'), {
                "mqlight_data": path.join(data.homedir,'.lbmesh.io','mqlight','data'),
                "mqlight_port_admin": data.integStack.mqlight.port.admin,
                "mqlight_port_data": data.integStack.mqlight.port.data,
            },{}, function(err,str){
                if( err ) console.log(err);
                fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','mqlight','lbmesh-integ-mqlight.yaml'), str);
            }); 

        /**
         * KAFKA
         */
        ejs.renderFile( path.join(data.templatefolder,'integ','lbmesh-integ-kafka.ejs'), {
            "kafka_data": path.join(data.homedir,'.lbmesh.io','kafka','data'),
            "kafka_port_admin": data.integStack.kafka.port.admin,
            "kafka_port_data": data.integStack.kafka.port.data,
            "kafka_port_topics": data.integStack.kafka.port.topics,
            "kafka_port_registry": data.integStack.kafka.port.registry,
            "kafka_port_rest": data.integStack.kafka.port.rest,
            "kafka_port_zookeeper": data.integStack.kafka.port.zookeeper,
        },{}, function(err,str){
            if( err ) console.log(err);
            fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','kafka','lbmesh-integ-kafka.yaml'), str);
        }); 

        /**
         * MQ Advanced
         */
            ejs.renderFile( path.join(data.templatefolder,'integ','lbmesh-integ-mq.ejs'), {
                "mq_data": path.join(data.homedir,'.lbmesh.io','mq','data'),
                "mq_config": path.join(data.homedir,'.lbmesh.io','mq','config'),
                "mq_port_admin": data.integStack.mq.port.admin,
                "mq_port_data": data.integStack.mq.port.data,
                "mq_env_admin_pass": data.integStack.mq.env.admin_pass,
                "mq_env_app_pass": data.integStack.mq.env.app_pass
            },{}, function(err,str){
                if( err ) console.log(err);
                fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','mq','lbmesh-integ-mq.yaml'), str);
            });
        /**
         * SPLUNK
         */
        ejs.renderFile( path.join(data.templatefolder,'integ','lbmesh-integ-splunk.ejs'), {
            "splunk_config": path.join(data.homedir,'.lbmesh.io','splunk','config'),
            "splunk_env_pass": data.integStack.splunk.env.pass,
            "splunk_image": data.integStack.splunk.image,
            "splunk_port_admin": data.integStack.splunk.port.admin,
            "splunk_port_data": data.integStack.splunk.port.data,
        },{}, function(err,str){
            if( err ) console.log(err);
            fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','splunk','lbmesh-integ-splunk.yaml'), str);
        }); 

        /**
         * IIB
         */
            ejs.renderFile( path.join(data.templatefolder,'integ','lbmesh-integ-iib.ejs'), {
                "iib_data": path.join(data.homedir,'.lbmesh.io','iib','data'),
                "iib_port_admin": data.integStack.iib.port.admin,
                "iib_port_data": data.integStack.iib.port.data,
            },{}, function(err,str){
                if( err ) console.log(err);
                fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','iib','lbmesh-integ-iib.yaml'), str);
            }); 
        /**
         * ACE MQ SERVER
         */
            ejs.renderFile( path.join(data.templatefolder,'integ','lbmesh-integ-acemq.ejs'), {
                "acemq_data": path.join(data.homedir,'.lbmesh.io','acemq','data'),
                "acemq_config": path.join(data.homedir,'.lbmesh.io','acemq','config','initial-config')
            },{}, function(err,str){
                if( err ) console.log(err);
                fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','acemq','lbmesh-integ-acemq.yaml'), str);
            }); 
        /**
         * Rabbit MQ
         */
            ejs.renderFile( path.join(data.templatefolder,'integ','lbmesh-integ-rabbitmq.ejs'), {
                "rabbitmq_data": path.join(data.homedir,'.lbmesh.io','rabbitmq','data'),
                "rabbitmq_hostname": machine.hostname,
                "rabbitmq_env_user": data.integStack.rabbitmq.env.user,
                "rabbitmq_env_pass": data.integStack.rabbitmq.env.pass,
                "rabbitmq_port_admin": data.integStack.rabbitmq.port.admin,
                "rabbitmq_port_data": data.integStack.rabbitmq.port.data,
            },{}, function(err,str){
                if( err ) console.log(err);
                fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','rabbitmq','lbmesh-integ-rabbitmq.yaml'), str);
            }); 

        /**
         * Write the final YAML Files
         */
        //sh.cp('-r', path.join(data.templatefolder,'integ','*.yaml'), path.join(data.homedir,'.lbmesh.io'));
    }
};