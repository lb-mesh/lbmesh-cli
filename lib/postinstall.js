#!/usr/bin/env node
/*
 Copyright (c) IBM Corp. 2013,2017. All Rights Reserved.
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
const sh            = require('shelljs');
const writeFile     = require('write');


LOG();
LOG( chalk.blue("STARTING POST INSTALLATION TASKS: "))
LOG();

/**
 *  Check for Home Folder Existence
 */
if( !fs.existsSync(machine.homedir + "/.lbmesh.io") ){
    sh.mkdir(machine.homedir + "/.lbmesh.io");
    sh.touch(machine.homedir + "/.lbmesh.io/global-config");

    let objectData = machine;
        objectData["workspace"] = objectData.homedir + '/workspace-lbmesh/';  
        objectData["templatefolder"] = objectData.node.globalPath + '/lbmesh-cli/lib/template';
        objectData["workspaceConfig"] = objectData.homedir + "/.lbmesh.io/global-config";
        objectData["projectApps"] = [];
        objectData["projectAppsList"] = [];
        objectData["projectData"] = {};
        objectData["portStackCount"] = 4000;
        objectData["portAppCount"] = 3500;
        delete objectData.cwd;

    LOG( objectData );
    writeFile.sync(machine.homedir + "/.lbmesh.io/global-config", system.encryptGlobalObject(objectData));
    LOG('   -  Creating Global Preferences for CLI');

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

checkDirectorySync(machine.homedir + "/workspace-lbmesh");

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

//LOG( machine );
LOG();

