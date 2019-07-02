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
const path      = require('path');
const machine = require('lbmesh-os').profile();
const Base      = require(path.join(machine.node.globalPath,'lbmesh-cli','classes','base') );
const chalk     = require('chalk');
const debug     = require('debug')('app:classes:integ');
const LOG       = console.log;
const ejs       = require('ejs');
const fs        = require('fs');
 
const sh        = require('shelljs');
const table     = require('markdown-table');
const _         = require('underscore');

class Integ extends Base{
    constructor(){
        super();
    }

    getQuestionList(instance){
        let questions = [];
        debug("BUILDING QUESTIONS FOR " + instance );

        switch(instance){
            case 'datapower':
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.admin,
                    "name": "admin",
                    "message": 'What port would you for the ' + instance.toUpperCase() + ' WEB ADMIN ?'
                });             
            break;
            case 'iib':
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.admin,
                    "name": "admin",
                    "message": 'What port would you for the ' + instance.toUpperCase() + ' DASHBOARD ?'
                });
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.data,
                    "name": "data",
                    "message": 'What port would you for the ' + instance.toUpperCase() + ' WEB SERVER ?'
                });    
            break;
            case 'ace':
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.admin,
                    "name": "admin",
                    "message": 'What port would you for the ' + instance.toUpperCase() + ' DASHBOARD ?'
                });
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.data,
                    "name": "data",
                    "message": 'What port would you for the ' + instance.toUpperCase() + ' WEB SERVER ?'
                });    
            break;
            case 'splunk':
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.admin,
                    "name": "admin",
                    "message": 'What port to use for ' + instance.toUpperCase() + ' DASHBOARD ?'
                });
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.data,
                    "name": "data",
                    "message": 'What port range to use for ' + instance.toUpperCase() + ' DATA ?'
                });   
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].env.pass,
                    "name": "admin",
                    "message": 'What password to use for ' + instance.toUpperCase() + ' DASHBOARD admin ?'
                }); 
            break;
            case 'mqlight':
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.admin,
                    "name": "admin",
                    "message": 'What port to use for ' + instance.toUpperCase() + ' DASHBOARD ?'
                }); 
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.data,
                    "name": "data",
                    "message": 'What port to use for ' + instance.toUpperCase() + ' DATA  ?'
                });  
            break;
            case 'rabbitmq':
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.admin,
                    "name": "admin",
                    "message": 'What port to use for ' + instance.toUpperCase() + ' DASHBOARD ?'
                }); 
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.data,
                    "name": "data",
                    "message": 'What port to use for ' + instance.toUpperCase() + ' DATA  ?'
                });  
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].env.app_pass,
                    "name": "env_user",
                    "message": 'What username to use for ' + instance.toUpperCase() + ' DASHBOARD ?'
                });   
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].env.admin_pass,
                    "name": "env_pass",
                    "message": 'What password to use for ' + instance.toUpperCase() + ' DASHBOARD ?'
                }); 
            break;
            case 'mq':
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.admin,
                    "name": "admin",
                    "message": 'What port to use for ' + instance.toUpperCase() + ' DASHBOARD ?'
                }); 
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].port.data,
                    "name": "data",
                    "message": 'What port to use for ' + instance.toUpperCase() + ' DATA  ?'
                });  
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].env.app_pass,
                    "name": "env_app_pass",
                    "message": 'What password to use for ' + instance.toUpperCase() + ' APP PASSWORD ?'
                });   
                questions.push({
                    "type": "input",
                    "default": this.portsList.integStack[instance].env.admin_pass,
                    "name": "env_admin_pass",
                    "message": 'What password to use for ' + instance.toUpperCase() + ' DASHBOARD  admin user account ?'
                });  
            break;
        }

        return questions;
    }

    updateGuiPorts(choices){
        debug("Preparing for INTEG PORT DASHBOARD Updates ");
        debug(choices);

        switch( choices.chosenDB ){
            case 'datapower':
                    this.portsList.integStack[choices.chosenDB].port.admin =  choices.newPortAdmin;
            break;
            case 'mqtt':
                    this.portsList.integStack[choices.chosenDB].port.socket =  choices.newPortSocket;
                    this.portsList.integStack[choices.chosenDB].port.data =  choices.newPortData;
            break;
            case 'iib':
                    this.portsList.integStack[choices.chosenDB].port.admin =  choices.newPortAdmin;
                    this.portsList.integStack[choices.chosenDB].port.data =  choices.newPortData;
            break;
            case 'ace':
                    this.portsList.integStack[choices.chosenDB].port.admin =  choices.newPortAdmin;
                    this.portsList.integStack[choices.chosenDB].port.data =  choices.newPortData;
            break;
            case 'kafka':
                    this.portsList.integStack[choices.chosenDB].port.zookeeper =  parseInt(choices.newPortZookeeper);
                    this.portsList.integStack[choices.chosenDB].port.registry =  parseInt(choices.newPortRegistry);
                    this.portsList.integStack[choices.chosenDB].port.topics =  parseInt(choices.newPortTopics);
                    this.portsList.integStack[choices.chosenDB].port.rest =  parseInt(choices.newPortRest);
            break;
            case 'splunk':
                    this.portsList.integStack[choices.chosenDB].image =  choices.newImage;
                    this.portsList.integStack[choices.chosenDB].env.pass =  choices.newDashPass;
                    this.portsList.integStack[choices.chosenDB].port.admin =  choices.newPortAdmin;
                    this.portsList.integStack[choices.chosenDB].port.data =  String(choices.newPortData);
            break;
            case 'rabbitmq':
                    this.portsList.integStack[choices.chosenDB].env.user =  choices.newDashUser;
                    this.portsList.integStack[choices.chosenDB].env.pass =  choices.newDashPass;
                    this.portsList.integStack[choices.chosenDB].port.admin =  parseInt(choices.newPortAdmin);
                    this.portsList.integStack[choices.chosenDB].port.data =  parseInt(choices.newPortData);
            break;
            case 'mqlight':
                    this.portsList.integStack[choices.chosenDB].port.admin =  parseInt(choices.newPortAdmin);
                    this.portsList.integStack[choices.chosenDB].port.data =  parseInt(choices.newPortData);
            break;
            case 'mq':
                    this.portsList.integStack[choices.chosenDB].env.admin_pass = choices.newPassAdmin;
                    this.portsList.integStack[choices.chosenDB].env.app_pass =  choices.newPassApp;
                    this.portsList.integStack[choices.chosenDB].port.admin =  parseInt(choices.newPortAdmin);
                    this.portsList.integStack[choices.chosenDB].port.data = parseInt( choices.newPortData);

            break;
            case 'acemq':

            break;
        }


        // Write Global Config
        this.writeGlobalConfigWithObject(this.portsList);

        let fullData = this.portsList;
        switch(choices.chosenDB){
            case 'datapower':
                ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-datapower.ejs'), {
                    "datapower_local": path.join(machine.homedir,'.lbmesh.io','datapower','data'),
                    "datapower_admin": fullData.integStack.datapower.port.admin,
                    "datapower_config": path.join(machine.homedir,'.lbmesh.io','datapower','config')
                },{}, function(err,str){
                    if( err ) console.log(err);
                    fs.writeFileSync( path.join(machine.homedir,'.lbmesh.io','datapower','lbmesh-integ-datapower.yaml'), str);
                });  
            break;
            case 'mq':
                ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-mq.ejs'), {
                    "mq_data": path.join(machine.homedir,'.lbmesh.io','mq','data'),
                    "mq_config": path.join(machine.homedir,'.lbmesh.io','mq','config'),
                    "mq_port_admin": fullData.integStack.mq.port.admin,
                    "mq_port_data": fullData.integStack.mq.port.data,
                    "mq_env_admin_pass": fullData.integStack.mq.env.admin_pass,
                    "mq_env_app_pass": fullData.integStack.mq.env.app_pass
                },{}, function(err,str){
                    if( err ) console.log(err);
                    fs.writeFileSync( path.join(machine.homedir,'.lbmesh.io','mq','lbmesh-integ-mq.yaml'), str);
                });
            break;
            case 'rabbitmq':
                ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-rabbitmq.ejs'), {
                    "rabbitmq_data": path.join(machine.homedir,'.lbmesh.io','rabbitmq','data'),
                    "rabbitmq_hostname": machine.hostname,
                    "rabbitmq_env_user": fullData.integStack.rabbitmq.env.user,
                    "rabbitmq_env_pass": fullData.integStack.rabbitmq.env.pass,
                    "rabbitmq_port_admin": fullData.integStack.rabbitmq.port.admin,
                    "rabbitmq_port_data": fullData.integStack.rabbitmq.port.data,
                },{}, function(err,str){
                    if( err ) console.log(err);
                    fs.writeFileSync( path.join(machine.homedir,'.lbmesh.io','rabbitmq','lbmesh-integ-rabbitmq.yaml'), str);
                }); 
            break;
            case 'splunk':
                    ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-splunk.ejs'), {
                        "splunk_config": path.join(machine.homedir,'.lbmesh.io','splunk','config'),
                        "splunk_env_pass": fullData.integStack.splunk.env.pass,
                        "splunk_image": fullData.integStack.splunk.image,
                        "splunk_port_admin": fullData.integStack.splunk.port.admin,
                        "splunk_port_data": fullData.integStack.splunk.port.data,
                    },{}, function(err,str){
                        if( err ) console.log(err);
                        fs.writeFileSync( path.join(machine.homedir,'.lbmesh.io','splunk','lbmesh-integ-splunk.yaml'), str);
                    }); 
            break;
            case 'mqtt':
                    ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-mqtt.ejs'), {
                        "mqtt_data": path.join(machine.homedir,'.lbmesh.io','mqtt','data'),
                        "mqtt_log": path.join(machine.homedir,'.lbmesh.io','mqtt','log'),
                        "mqtt_config": path.join(data.homedir,'.lbmesh.io','mqtt','config','mosquitto.conf'),
                        "mqtt_port_admin": fullData.integStack.mqtt.port.admin,
                        "mqtt_port_socket": fullData.integStack.mqtt.port.socket,
                        "mqtt_port_data": fullData.integStack.mqtt.port.data,
                    },{}, function(err,str){
                        if( err ) console.log(err);
                        fs.writeFileSync( path.join(machine.homedir,'.lbmesh.io','mqlight','lbmesh-integ-mqtt.yaml'), str);
                    }); 
            break;
            case 'mqlight':
                    ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-mqlight.ejs'), {
                        "mqlight_data": path.join(machine.homedir,'.lbmesh.io','mqlight','data'),
                        "mqlight_port_admin": fullData.integStack.mqlight.port.admin,
                        "mqlight_port_data": fullData.integStack.mqlight.port.data,
                    },{}, function(err,str){
                        if( err ) console.log(err);
                        fs.writeFileSync( path.join(machine.homedir,'.lbmesh.io','mqlight','lbmesh-integ-mqlight.yaml'), str);
                    }); 
            break;
            case 'kafka':
                    ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-kafka.ejs'), {
                        "kafka_data": path.join(machine.homedir,'.lbmesh.io','kafka','data'),
                        "kafka_port_admin": fullData.integStack.kafka.port.admin,
                        "kafka_port_data": fullData.integStack.kafka.port.data,
                        "kafka_port_topics": fullData.integStack.kafka.port.topics,
                        "kafka_port_registry": fullData.integStack.kafka.port.registry,
                        "kafka_port_rest": fullData.integStack.kafka.port.rest,
                        "kafka_port_zookeeper": fullData.integStack.kafka.port.zookeeper,
                    },{}, function(err,str){
                        if( err ) console.log(err);
                        fs.writeFileSync( path.join(machine.homedir,'.lbmesh.io','kafka','lbmesh-integ-kafka.yaml'), str);
                    }); 
            break;
            case 'acemq':
                    
            break;
            case 'ace':
                    ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-ace.ejs'), {
                        "ace_data": path.join(machine.homedir,'.lbmesh.io','ace','data'),
                        "ace_port_admin": fullData.integStack.ace.port.admin,
                        "ace_port_data": fullData.integStack.ace.port.data,
                    },{}, function(err,str){
                        if( err ) console.log(err);
                        fs.writeFileSync( path.join(machine.homedir,'.lbmesh.io','ace','lbmesh-integ-ace.yaml'), str);
                    }); 
            break;
            case 'iib':
                ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-iib.ejs'), {
                    "iib_data": path.join(machine.homedir,'.lbmesh.io','iib','data'),
                    "iib_port_admin": fullData.integStack.iib.port.admin,
                    "iib_port_data": fullData.integStack.iib.port.data,
                },{}, function(err,str){
                    if( err ) console.log(err);
                    fs.writeFileSync( path.join(machine.homedir,'.lbmesh.io','iib','lbmesh-integ-iib.yaml'), str);
                }); 
            break; 
        }

        /**
          * Decide to recreate container or not ( exited )
          */
         if( choices.containerState == 'exited') {
            sh.exec("docker rm lbmesh-integ-" + choices.chosenDB);
            sh.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io',choices.chosenDB, 'lbmesh-integ-'+ choices.chosenDB +'.yaml') + " up --no-start --force-recreate ");            
         }
 

    }


    updatePorts(choices){
        debug("Preparing for INTEG PORT Updates ");
        debug(choices);

        let chosen = choices.instance;
        let fullData = this.portsList;
        switch(chosen){
            case 'datapower':
                this.portsList.integStack[chosen].port.admin = choices.admin;
            break;
            case 'splunk':
                    this.portsList.integStack[chosen].port.admin = choices.admin;
                    this.portsList.integStack[chosen].port.data = choices.data;
                    this.portsList.integStack[chosen].env.pass = choices.env_app_pass;
            break;
            case 'mq':
                this.portsList.integStack[chosen].port.admin = choices.admin;
                this.portsList.integStack[chosen].port.data = choices.data;
                this.portsList.integStack[chosen].env.admin_pass = choices.env_admin_pass;
                this.portsList.integStack[chosen].env.app_pass = choices.env_app_pass;
            break;
            case 'rabbitmq':
                this.portsList.integStack[chosen].port.admin = choices.admin;
                this.portsList.integStack[chosen].port.data = choices.data;
                this.portsList.integStack[chosen].env.user = choices.env_user;
                this.portsList.integStack[chosen].env.pass = choices.env_pass;
            break;
            case 'mqlight':
                this.portsList.integStack[chosen].port.admin = choices.admin;
                this.portsList.integStack[chosen].port.data = choices.data;
            break;
            case 'mqtt':
                this.portsList.integStack[chosen].port.socket = choices.socket;
                this.portsList.integStack[chosen].port.data = choices.data;
            break;
            case 'ace':
                this.portsList.integStack[chosen].port.admin = choices.admin;
                this.portsList.integStack[chosen].port.data = choices.data;
            break;
            case 'iib':
                this.portsList.integStack[chosen].port.admin = choices.admin;
                this.portsList.integStack[chosen].port.data = choices.data;
            break;
            
        }

        // Write Global Config
        this.writeGlobalConfigWithObject(this.portsList);

        // Write New Container Compose File
        
        switch(chosen){
            case 'datapower':
                ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-datapower.ejs'), {
                    "datapower_local": path.join(fullData.homedir,'.lbmesh.io','datapower','data'),
                    "datapower_admin": choices.admin,
                    "datapower_config": path.join(fullData.homedir,'.lbmesh.io','datapower','config')
                },{}, function(err,str){
                    if( err ) console.log(err);
                    fs.writeFileSync( path.join(fullData.homedir,'.lbmesh.io','datapower','lbmesh-integ-datapower.yaml'), str);
                });  
            break;
            case 'mq':
                ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-mq.ejs'), {
                    "mq_data": path.join(fullData.homedir,'.lbmesh.io','mq','data'),
                    "mq_config": path.join(fullData.homedir,'.lbmesh.io','mq','config'),
                    "mq_port_admin": fullData.integStack.mq.port.admin,
                    "mq_port_data": fullData.integStack.mq.port.data,
                    "mq_env_admin_pass": fullData.integStack.mq.env.admin_pass,
                    "mq_env_app_pass": fullData.integStack.mq.env.app_pass
                },{}, function(err,str){
                    if( err ) console.log(err);
                    fs.writeFileSync( path.join(fullData.homedir,'.lbmesh.io','mq','lbmesh-integ-mq.yaml'), str);
                });
            break;
            case 'rabbitmq':
                ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-rabbitmq.ejs'), {
                    "rabbitmq_data": path.join(fullData.homedir,'.lbmesh.io','rabbitmq','data'),
                    "rabbitmq_hostname": machine.hostname,
                    "rabbitmq_env_user": fullData.integStack.rabbitmq.env.user,
                    "rabbitmq_env_pass": fullData.integStack.rabbitmq.env.pass,
                    "rabbitmq_port_admin": fullData.integStack.rabbitmq.port.admin,
                    "rabbitmq_port_data": fullData.integStack.rabbitmq.port.data,
                },{}, function(err,str){
                    if( err ) console.log(err);
                    fs.writeFileSync( path.join(fullData.homedir,'.lbmesh.io','rabbitmq','lbmesh-integ-rabbitmq.yaml'), str);
                }); 
            break;
            case 'splunk':
                    ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-splunk.ejs'), {
                        "splunk_config": path.join(fullData.homedir,'.lbmesh.io','splunk','config'),
                        "splunk_env_pass": fullData.integStack.splunk.env.pass,
                        "splunk_image": fullData.integStack.splunk.image,
                        "splunk_port_admin": fullData.integStack.splunk.port.admin,
                        "splunk_port_data": fullData.integStack.splunk.port.data,
                    },{}, function(err,str){
                        if( err ) console.log(err);
                        fs.writeFileSync( path.join(data.homedir,'.lbmesh.io','splunk','lbmesh-integ-splunk.yaml'), str);
                    }); 
            break;
            case 'mqlight':
                    ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-mqlight.ejs'), {
                        "mqlight_data": path.join(fullData.homedir,'.lbmesh.io','mqlight','data'),
                        "mqlight_port_admin": fullData.integStack.mqlight.port.admin,
                        "mqlight_port_data": fullData.integStack.mqlight.port.data,
                    },{}, function(err,str){
                        if( err ) console.log(err);
                        fs.writeFileSync( path.join(fullData.homedir,'.lbmesh.io','mqlight','lbmesh-integ-mqlight.yaml'), str);
                    }); 
            break;
            case 'mqtt':
                    ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-mqtt.ejs'), {
                        "mqtt_data": path.join(machine.homedir,'.lbmesh.io','mqtt','data'),
                        "mqtt_log": path.join(machine.homedir,'.lbmesh.io','mqtt','log'),
                        "mqtt_config": path.join(data.homedir,'.lbmesh.io','mqtt','config','mosquitto.conf'),
                        "mqtt_port_admin": fullData.integStack.mqtt.port.admin,
                        "mqtt_port_socket": fullData.integStack.mqtt.port.socket,
                        "mqtt_port_data": fullData.integStack.mqtt.port.data,
                    },{}, function(err,str){
                        if( err ) console.log(err);
                        fs.writeFileSync( path.join(fullData.homedir,'.lbmesh.io','mqtt','lbmesh-integ-mqtt.yaml'), str);
                    });
            break;
            case 'ace':
                    ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-ace.ejs'), {
                        "ace_data": path.join(fullData.homedir,'.lbmesh.io','ace','data'),
                        "ace_port_admin": fullData.integStack.ace.port.admin,
                        "ace_port_data": fullData.integStack.ace.port.data,
                    },{}, function(err,str){
                        if( err ) console.log(err);
                        fs.writeFileSync( path.join(fullData.homedir,'.lbmesh.io','ace','lbmesh-integ-ace.yaml'), str);
                    });
            break;
            case 'iib':
                ejs.renderFile( path.join(fullData.templatefolder,'integ','lbmesh-integ-iib.ejs'), {
                    "iib_data": path.join(fullData.homedir,'.lbmesh.io','iib','data'),
                    "iib_port_admin": fullData.integStack.iib.port.admin,
                    "iib_port_data": fullData.integStack.iib.port.data,
                },{}, function(err,str){
                    if( err ) console.log(err);
                    fs.writeFileSync( path.join(fullData.homedir,'.lbmesh.io','iib','lbmesh-integ-iib.yaml'), str);
                }); 
            break;
        }

        // Rewrite Container & Rebuild
        
            LOG();
            LOG('   -- REMOVING old integration Container for ' + chosen);
            sh.exec("docker stop lbmesh-integ-" + chosen);
            sh.exec("docker rm lbmesh-integ-" + chosen);
            LOG();
            LOG('   -- Rebuilding new integration Container for ' + chosen);
            LOG();
            sh.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io',chosen, 'lbmesh-integ-'+ chosen +'.yaml') + " up --no-start --force-recreate  ");            
            LOG();
            LOG( chalk.red('  -- Please run the following command to start the new ' + chosen + ' instance --'))
            LOG( chalk.blue('     $ lbmesh integ start ' + chosen))
            LOG();


    }

    retrievePorts(){
        let selected = {
            "table": "",
            "sourceData": {}
        };
        let myDBStack = [];
            myDBStack.push(['Integ','Admin Port','Data Port','Image']);
        let DBList = ['datapower','mq','mqlight','rabbitmq','mqtt','iib','ace','acemq','splunk','kafka'];
            // mq, acemqserver, iib
        this.portsList = this.readGlobalConfig();
        
        _.each( DBList, (data) =>{
            myDBStack.push([data.toUpperCase(),(this.portsList.integStack[data].port.admin > 0 ? this.portsList.integStack[data].port.admin : '' ),(this.portsList.integStack[data].port.data > 0 ? this.portsList.integStack[data].port.data : '' ),this.portsList.integStack[data].image])
        });

        selected.table = table(myDBStack,{ start: '  |'});
        selected.sourceData = this.portsList.integStack;
           
        return selected;
         
    }

}

module.exports = Integ;
