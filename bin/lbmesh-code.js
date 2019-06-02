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
const path = require('path');
const machine = require('lbmesh-os').profile();
const pkg = require( path.join(machine.node.globalPath, 'lbmesh-cli','package.json')) ;

const banner = require(path.join(machine.node.globalPath,'lbmesh-cli','lib','banner.js'));
const decisions = require(path.join(machine.node.globalPath,'lbmesh-cli','classes','decisions.js'));

const LOG    = console.log;

const chalk  = require('chalk');
const availableCommands = ['create','projects','build','run','open','help'];
const availableApps = ['admin','databank','scheduler','messenger','www','api'];

const resolveCWD = require('resolve-cwd');
const debug  = require('debug')('app:cli:lbmesh-api');
const fs     = require('fs');
const jsonfile = require('jsonfile');

const program = require('commander');
const prompt = require('prompt');
const shelljs   = require('shelljs');
const isWindows = (machine.platform == 'win32')? true : false;


/**
 * Display Additional Banner
 */
banner.display();
banner.api();

program
  .version(pkg.version, '-v, --version')
  .usage('model [options] ');

program
  .command('model [action] [name]')
  .description('Work with Project Model')
  .action( (action, name) => {
    let myAction = (action == undefined)? 'empty' : action;
    let myName = (name == undefined)? 'empty' : name;

    switch(myAction){
      case 'create':

      break;
      case 'delete':

      break;
      default:

      break;
    }

    // LOG( myAction );
    // LOG( myName );
  });

  program
  .command('app [name]')
  .description('Work with Project Component')
  .action( (name) => {
    
    let myName = (name == undefined)? 'empty' : name;
    
    if( fs.existsSync(path.resolve('lbmesh-config.json')  ) ){    
      
        if( availableApps.includes(myName)){

          let myComponent = new decisions();
              myComponent.startProcess(myName);
          
        } else {
            // List Prompt
        }

    } else {
      LOG();
      LOG( chalk.red('Not currently in a LB Mesh Project Directory') );
      LOG();       
    }
  
  });

  program
  .parse(process.argv);


