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
 *  Check for Home Folder Existence
 */
if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io')) ){
    sh.mkdir(path.join(machine.homedir, ".lbmesh.io"));
    sh.touch(path.join(machine.homedir, ".lbmesh.io","global-config"));

    let objectData = machine;
        objectData["workspace"] = path.join(objectData.homedir,'workspace-lbmesh');  
        objectData["templatefolder"] = path.join(objectData.node.globalPath, 'lbmesh-cli','lib','template');
        objectData["workspaceConfig"] = path.join(objectData.homedir, ".lbmesh.io","global-config");
        objectData["projectApps"] = [];
        objectData["projectAppsList"] = [];
        objectData["projectData"] = {};
        objectData["dbStack"] = {
          "mongodb": {
              "image": "mysql:5.7",
              "port": 27017
          },
          "mysql": {
            "image": "mysql:5.7",
            "port": 3306
          },
          "cloudant": {
            "image": "ibmcom/cloudant-developer:latest",
            "port": 8880
          },
          "redis": {
            "image": "redis",
            "port": 6379         
          },
          "postgres": {
            "image": "postgres",
            "port": 5432         
          }
        };
        objectData["portStackCount"] = 4000;
        objectData["portStackExclude"] = [];
        objectData["portAppCount"] = 3500;
        objectData["portAppExclude"] = [];
        delete objectData.cwd;

    /**
     * Writing Docker Compose
     */
      sh.cp('-r', path.join(objectData.templatefolder,'db','*.yaml'), path.join(objectData.homedir,'.lbmesh.io'));
      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mongodb')); 
      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mongodb','data'));
      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mongodb','config'));

      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','cloudant')); 
      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','cloudant','data'));

      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mysql'));
      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mysql','data'));
      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mysql','config'));

      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','postgres'));
      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','postgres','config'));
      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','postgres','data'));

      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','redis')); 
      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','redis','data')); 
      sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','redis','config')); 

    /**
     * Writing Global-Config 
     */
    writeFile.sync(path.join(machine.homedir,".lbmesh.io","global-config"), system.encryptGlobalObject(objectData));
    LOG('   -  Creating Global Preferences for CLI');

} else {

}

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

