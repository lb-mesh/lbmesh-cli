/*
 Copyright (c) IBM Corp. 2013,2017. All Rights Reserved.
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
'use strict'

const chalk = require('chalk');
const LOG   = console.log;
const debug = require('debug')('app:class:create');
const fs    = require('fs');
const _     = require('underscore');


class Create {
    constructor(profile){
        this.machine = profile;     
    }

    folderExists(folder){
        return fs.existsSync(this.machine.cwd + '/' + folder);
    }

    generateProjectFiles(){
        let projFolder = this.machine.targetfolder;
        let services = ['messenger', 'databank', 'scheduler', 'api', 'admin', 'app'];

        LOG(chalk.blue("  Creating Project Folder Files... "))
        fs.writeFileSync(projFolder + '/lbmesh-config.json');
        fs.writeFileSync(projFolder + '/docker-compose.yml');

        _.each (services, (svc)=> {
            fs.mkdirSync(projFolder + '/' + svc);
        });
        process.exit(1);
        debug("Creating ")
    }

    projectFolder(answers){
        this.answers = answers;
        debug( "--- projectFolder() -----");
        debug( this.machine );
        debug( this.answers );

        if( !this.folderExists(this.answers.foldername) ){
            this.machine.targetfolder = this.machine.cwd + '/' + this.answers.foldername;

            fs.mkdirSync(this.machine.targetfolder);
            this.generateProjectFiles();

        } else {
            LOG();
            LOG(chalk.red("  FOLDER ALREADY EXISTS WITH THAT NAME, PLEASE TRY AGAIN!"));
            LOG();
        }
    }
};

module.exports = Create;