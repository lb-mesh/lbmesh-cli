#!/usr/bin/env node
/*
 Copyright (c) Innovative Thinkrs LLC 2019. All Rights Reserved.
 This project is licensed under the MIT License, full text below.

Author: Jamil Spain  <jamilhassanspain@gmail.com> http://www.jamilspain.com

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

const chalk         = require('chalk');
const debug         = require('debug')('app:cli:postinstall');
const system        = require('./files');
const fs            = require('fs');
const LOG           = console.log;
const machine       = require('lbmesh-os').profile();
const path          = require('path');
const sh            = require('shelljs');
const writeFile     = require('write');


LOG();
LOG( chalk.blue("STARTING POST INSTALLATION TASKS: ") );
LOG();

/**
 * Set Object for Install
 */
let objectData = machine;
objectData["workspace"] = path.join(objectData.homedir,'workspace-lbmesh');  
objectData["templatefolder"] = path.join(objectData.node.globalPath, 'lbmesh-cli','lib','template');
objectData["workspaceConfig"] = path.join(objectData.homedir, ".lbmesh.io","global-config");
objectData["projectApps"] = [];
objectData["projectAppsList"] = [];
objectData["projectData"] = {};
objectData["dbStack"] = {
  "mongodb": {
      "image": "mongo:3.6.1",
      "passwd": "",
      "port": 27017
  },
  "mysql": {
    "image": "mysql:5.7",
    "passwd": "lbmesh-db-mysql",
    "port": 3306
  },
  "cloudant": {
    "image": "ibmcom/cloudant-developer:latest",
    "passwd": "admin/pass",
    "port": 8880
  },
  "redis": {
    "image": "redis:latest",
    "passwd": "",
    "port": 6379         
  },
  "postgres": {
    "image": "postgres:latest",
    "passwd": "lbmesh-db-postgres",
    "port": 5432         
  },
  "mssql": {
    "image": "mcr.microsoft.com/mssql/server:2017-latest-ubuntu",
    "passwd": "",
    "port": 1433      
  }
};
objectData["integStack"] = {
  "mqlight": {
    "image":"ibmcom/mqlight:1.0",
    "port": {
      "admin": 9180,
      "data": 5672
    }  
  }, 
  "mq": {
    "image":"",
    "port": {
      "admin": 9443,
      "data": 1414
    }
  },
  "ace-mq": {
    "image":"",
    "port": {
      "admin": 0,
      "data": 0      
    }
  },
  "iib": {
    "image":"ibmcom/iib",
    "port": {
      "admin": 0,
      "data": 0
    }   
  },
  "datapower":{
    "image":"ibmcom/datapower",
    "port": {
      "admin": 9090,
      "ssh": 9022,
      "xml": 5550
    }
  }
};
objectData["portStackCount"] = 4000;
objectData["portStackExclude"] = [];
objectData["portAppCount"] = 3500;
objectData["portAppExclude"] = [];
delete objectData.cwd;


/**
 *  Check for Home Folder Existence
 */
if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io')) ){
    sh.mkdir(path.join(machine.homedir, ".lbmesh.io"));
    sh.touch(path.join(machine.homedir, ".lbmesh.io","global-config"));


    /**
     * Writing Docker Compose
     */
      sh.cp('-r', path.join(objectData.templatefolder,'db','*.yaml'), path.join(objectData.homedir,'.lbmesh.io'));

    /**
     * Writing Global-Config 
     */
    writeFile.sync(path.join(machine.homedir,".lbmesh.io","global-config"), system.encryptGlobalObject(objectData));
    LOG('   -  Creating Global Preferences for CLI');

} else {

    /**
     * Writing Global-Config 
     */
    sh.cp('-r', path.join(objectData.templatefolder,'db','*.yaml'), path.join(objectData.homedir,'.lbmesh.io'));
    writeFile.sync(path.join(machine.homedir,".lbmesh.io","global-config"), system.encryptGlobalObject(objectData));
    LOG('   -  Resetting Global Preferences for CLI');
}

/**
 * Regenerate DB Yaml
 */
system.jumpstartDbStack(objectData);

/**
 * Regenerate Integeration YAML
 */
system.jumpstartIntegStack(objectData);


/**
 * Create DB Directories
 * @param {*} directory 
 */
function checkDBDirectories(){

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','mongodb')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mongodb')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mongodb','data'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mongodb','config'));
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','cloudant')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','cloudant')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','cloudant','data'));
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','mysql')) ){

    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mysql'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mysql','data'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mysql','config'));
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','postgres')) ){

    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','postgres'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','postgres','config'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','postgres','data'));
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','redis')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','redis')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','redis','data')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','redis','config')); 

  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','mssql')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mssql')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mssql','data')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mssql','config')); 
  }
}

checkDBDirectories();

/**
 * Check IntegrationDirectories()
 * @param {} directory 
 */
function checkIntegrationDirectories(){
  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','datapower')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','datapower')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','datapower','local')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','datapower','config')); 
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','mqlight')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mqlight')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mqlight','data'));  
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','mq-developers')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mq-developers')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mq-developers','data'));  
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','ace-mq')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','ace-mq')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','ace-mq','data'));  
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','ace-mq','config')); 
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','iib')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','iib')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','iib','data'));  
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','iib','config')); 
  }
}
checkIntegrationDirectories();

/**
 * Create Workspace Folder for LB Mesh Projects
 */
function checkDirectorySync(directory) {  
    try {
      fs.statSync(directory);
    } catch(e) {
      LOG("   -  Creating Workspace for LB Mesh Projects: ");
      LOG("   -  " + directory)
      fs.mkdirSync(directory);
    }
}

checkDirectorySync(path.join(machine.homedir,"workspace-lbmesh"));

/**
 *  Check for Docker and PM2 Installs
 */
if( !sh.which('pm2') ){
    LOG("   -  PM2 not installed, running install now.")
    sh.exec("npm install -g pm2");
}

/**
 * Check for open-cli
 */
if( !sh.which('opn') ){
  LOG("   -  Open-CLI  not installed, running install now.")
  sh.exec("npm install -g opn-cli");
}

/**
 * Check for Password Encrypt CLI
 *  - More Information: https://www.npmjs.com/package/password-encrypt-cli
 */
if( !sh.which('pass') ){
  LOG("   -  Password Encrypt CLI not installed, running install now.")
  sh.exec("npm install -g password-encrypt-cli");
}

/**
 * check for Docker-Compose
 * https://docs.docker.com/compose/install/
 */
if( !sh.which('docker-compose') ){
  LOG("   -  Docker-Compose  not installed, please visit the following URL below on install.")
  LOG("      https://docs.docker.com/compose/install/");
}


//LOG( machine );
LOG();

