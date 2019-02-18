#!/usr/bin/env node
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

const banner = require("../lib/banner");
const chalk  = require('chalk');
const Create = require('../classes/create');
const debug  = require('debug')('app:cli:lbmesh');
const ask = require('inquirer');
const LOG    = console.log;
const program = require('commander');
const prompt = require('prompt');
const shellExec = require('shell-exec')

banner.display();

program
  .version('0.3.9', '-v, --version')
  .usage('create|pattern|code|run|build [options] ');

program
  .command('create [name]')
  .description('Scaffold a new lbmesh default project')
  // .option('-p, --prefix <string>', 'add folder project prefix')
  .action((name, options)=> {
    LOG(name);
    let generate = new Create();

    switch(name){
      case 'messenger':

        break;
      case 'scheduler':

        break;
      case 'databank':

        break;
      default: 

      ask
        .prompt([
          'What is your project folder name?',
        ]).then(answers => {
            LOG('ANSERS FROM PROMPT', answers);
        });
        break;
    }


  });

program
  .command('pattern [name]')
  .description('Create Scaffold off pre-built pattern')
  .option('-p, --prefix <string>', 'add folder project prefix')
  .action((name)=>{

  });

program
  .command('code [name]')
  .description('open project folder in Visual Studio Code')
  .action((name)=>{

  });

program
  .command('run [name]')
  .description('open project folder in Visual Studio Code')
  .action((name)=>{

  });

program
  .command('build [name]')
  .description('Generate Docker Images for LB Mesh Project')
  .action((name)=>{

  });


program
  .command("help [cmd]")
  .action((cmd)=>{


  });





program.on('--help', function(){
  console.log();
  console.log('Examples:');
  console.log('');
  console.log('  $ pass encrypt mypassword -k oneWordPass');
  console.log("  $ pass encrypt 'mypassword' -k 'Phrase to encrypt words' ");
  console.log('');
  console.log('  $ pass decrypt encryptedstring -k oneWordPass');
  console.log("  $ pass decrypt 'encryptedstring' -k 'Phrase to encrypt words' ");
  console.log('');
  console.log('Notice: ')
  console.log('  For special characters in passwords/keys,');
  console.log('  please use single quotes around each');
  console.log('');
  console.log('');
});
  
program
  .parse(process.argv);

/**
 * No Arguments Passed, Show Extended Help Menu
 */
if(!program.args.length) {
  program.help();
};