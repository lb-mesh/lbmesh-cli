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
const machine = require('lbmesh-os').profile();
const pkg = require( machine.node.globalPath + '/lbmesh-cli/package.json');
require('please-upgrade-node')(pkg)

const ask = require('inquirer');
const banner = require("../lib/banner");
const chalk  = require('chalk');
const availableCommands = ['create','projects','build','run','open','help'];

const resolveCWD = require('resolve-cwd');
const debug  = require('debug')('app:cli:lbmesh');
const fs     = require('fs');
const jsonfile = require('jsonfile');
const program = require('commander');
const prompt = require('prompt');
const shelljs   = require('shelljs');

const Create = require('../classes/create');
const Projects = require('../classes/projects');
const LOG    = console.log;

banner.display();

program
  .version('1.0.0', '-v, --version')
  .usage('create|projects|run|open|build [options] ');

program
  .command('create')
  .description('Scaffold a new LB Mesh Default Project')
  .action( ()=> {
    
    banner.create();
    LOG();
  
      ask
        .prompt([
          {
            "type": "input",
            "default": "Demo",
            "name": "appname",
            "message": 'What is the name of your Application?'
          },
          {
            "type": "list",
            "default": "fronted-backend",
            "message": "Select your Project Type?",
            "name": "projtype",
            "choices": [
              {"name": "Full Stack ( Frontend + Backend )", "value": "frontend-backend"},
              new ask.Separator(),
              {"name":"Frontend WWW", "value":"frontend-www"},
              {"name":"Frontend API", "value":"frontend-api"},
              {"name":"Frontend Admin", "value":"frontend-admin"},
              new ask.Separator(),
              {"name":"Backend Scheduler", "value":"backend-scheduler"},
              {"name":"Backend Databank", "value":"backend-databank"},
              {"name":"Backend Messenger", "value":"backend-messenger"},                  
            ],
            //"message": 'Create Project in Default Workspace $HOME/Workspace-lbmesh/ (Y) or Current Directory (n)?'
          },
          {
            "type": "input",
            "default": "project",
            "name": "foldername",
            "message": 'What is your project folder name?'
          }
        ]).then(answers => {
            LOG();
            let generate = new Create();
            generate.projectFolder(answers);

        });

  })
  .on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ deploy exec sequential');
    console.log('    $ deploy exec async');
    console.log();
  });

program
  .command('projects [name] [options]')
  .description('Get Project Details')
  .action((name, options)=>{
    banner.projects();
    
    
    let list = new Projects();
      if( name == undefined ){
        LOG();
        LOG(list.viewProjectList());
        LOG();
      } else {
        switch(name){
          case 'reset':
            ask.prompt([ 
              {
                "type": "confirm",
                "default": "Y",
                "name": "resetlist",
                "message": 'Are you sure you want to reset the project list?'
              }             
             ]).then(answers => {
                 if( answers.resetlist ){
                   list.resetProjectList();
                 }
             });
          break;
          default:
            if(list.isProject(name)){
              let listDetails = list.viewProjectDetails(name);
              LOG();
                LOG('  PROJECT DETAILS')
                LOG(listDetails.table_header);
                LOG();
                if( listDetails.type == 'frontend-backend') {
                  LOG('  PROJECT PORTS')
                  LOG(listDetails.table_ports);
                }
              LOG();            
            } else {
              LOG();
              LOG(list.viewProjectList());
              LOG();          
            }
          break;
        }
      }


      
  });
// program
//   .command('pattern [name]')
//   .description('Create Scaffold off pre-built pattern')
//   .option('-p, --prefix <string>', 'add folder project prefix')
//   .action((name)=>{

//   });

// program
//   .command('code [name]')
//   .description('open project folder in Visual Studio Code')
//   .action((name)=>{

//   });

program
  .command('run [action] [component]')
  .description('Start|Stop|Restart|Log environment via pm2 runtime')
  .action((action, component)=>{
    banner.runtime();
    if( fs.existsSync('./lbmesh-config.json') && fs.existsSync('./docker-compose.yaml') ){
        let myAction = (action == undefined)? 'empty' : action.toLowerCase();
        let myComponent = (component == undefined)? 'all' : component.toLowerCase() ;

        switch(myAction){
          case 'empty':
              LOG(' no action provided');
          break;
          case 'start':
              shelljs.exec("pm2 start pm2-ecosystem.config.yaml");
          break;
          case 'stop':
            shelljs.exec("pm2 stop pm2-ecosystem.config.yaml");
          break;
          case 'restart':
            shelljs.exec("pm2 restart pm2-ecosystem.config.yaml");
          break;
          case 'delete':
            shelljs.exec("pm2 delete pm2-ecosystem.config.yaml");
          break;
          case 'logs':
            switch(myComponent){
              case 'all':

              break;
              default:
                shelljs.exec("pm2 logs " + myComponent);
              break;
            }
          break;
          case 'status':
            shelljs.exec("pm2 status pm2-ecosystem.config.yaml", [ 'arg1', 'arg2', 'arg3' ], { stdio: 'inherit'});
          break;
          case 'docker':
            
              switch(myComponent){
                case 'up':
                  shelljs.exec("docker-compose up", {stdio: 'inherit'});
                break;
                case 'down':
                shelljs.exec("docker-compose down", {stdio: 'inherit'});
                break;
                default:
                  LOG()
                  LOG('   Current Running Docker Processes')
                  LOG();
                  shelljs.exec("docker ps", {stdio: 'inherit'});
                  LOG()
                  LOG('   Current Docker Images')
                  LOG();
                  shelljs.exec("docker images", {stdio: 'inherit'});
                  LOG();
                break;
              }
          break;
          default:
            LOG();
            LOG(" COMMAND NOT RECOGNIZED ");
            LOG();
          break;

        }
 

    } else {
      LOG();
      console.error("Not in a current LB Mesh Project Directory.")
      banner.runhelp();
      LOG();
    }
    
  });


program
  .command('open')
  .description('Open Browser Windows for Project')
  .action((name)=>{
      if( fs.existsSync('./lbmesh-config.json') && fs.existsSync('./docker-compose.yaml') ) {
            banner.browser();
        let list = new Projects();
        let projDetails = list.readProjectConfig(process.cwd());

          // Loop thru all the apps ports
          LOG();
          if( projDetails.apps.www.port > 0 ){
            LOG('   OPENING FRONTEND-WWW http://localhost:' + projDetails.apps.www.port + ' for Project ' + projDetails.name)
            shelljs.exec("opn http://localhost:" + projDetails.apps.www.port);
          }

          if( projDetails.apps.admin.port > 0 ){
            LOG('   OPENING FRONTEND-ADMIN http://localhost:' + projDetails.apps.admin.port + ' for Project ' + projDetails.name)
            shelljs.exec("opn http://localhost:" + projDetails.apps.admin.port);
          }

          if( projDetails.apps.api.port > 0 ){
            LOG('   OPENING FRONTEND-API http://localhost:' + projDetails.apps.api.port + ' for Project ' + projDetails.name)
            shelljs.exec("opn http://localhost:" + projDetails.apps.api.port + "/explorer");
          }

          if( projDetails.apps.messenger.port > 0 ){
            LOG('   OPENING BACKEND-MESSENGER http://localhost:' + projDetails.apps.messenger.port + ' for Project ' + projDetails.name)
            shelljs.exec("opn http://localhost:" + projDetails.apps.messenger.port + "/explorer");
          }

          if( projDetails.apps.databank.port > 0 ){
            LOG('   OPENING BACKEND-DATABANK http://localhost:' + projDetails.apps.databank.port + ' for Project ' + projDetails.name)
            shelljs.exec("opn http://localhost:" + projDetails.apps.databank.port + "/explorer");
          }
          LOG();

      } else {
        LOG();
        console.error("Not in a current LB Mesh Project Directory.")
        banner.runhelp();
        LOG();
      }
  });


program
  .command('build [name]')
  .description('Generate Docker Images for LB Mesh Project')
  .action((name)=>{
      banner.build();
      if( fs.existsSync('./lbmesh-config.json') && fs.existsSync('./docker-compose.yaml') ){
        shelljs.exec("docker-compose build");
      } else {
        LOG();
        console.error("Not in a current LB Mesh Project Directory.")
        LOG();
      }
  });


// program
//   .command('interactive')
//   .description('Interactive CLI Interface to guide through Project')
//   .action((name)=>{
//       shelljs.exec("lbmesh-helper");
//   });

program
  .command("help [cmd]")
  .action((cmd)=> {

    switch(cmd.toLowerCase()){
      case 'run':
        LOG();
        LOG('THIS IS HELPF OR RUN');
      break;
    }

  });

// program
//   .command('*')
//   .action( ()=> {
//     program.help();
//   });
   
program.on('--help', function(){
  LOG();
  //console.log('Examples:');
  // console.log('');
  // console.log('  $ pass encrypt mypassword -k oneWordPass');
  // console.log("  $ pass encrypt 'mypassword' -k 'Phrase to encrypt words' ");
  // console.log('');
  // console.log('  $ pass decrypt encryptedstring -k oneWordPass');
  // console.log("  $ pass decrypt 'encryptedstring' -k 'Phrase to encrypt words' ");
  // console.log('');
  // console.log('Notice: ')
  // console.log('  For special characters in passwords/keys,');
  // console.log('  please use single quotes around each');
  // console.log('');
  // console.log('');
  LOG();
});
  
program
  .parse(process.argv);

/**
 * No Arguments Passed, Show Extended Help Menu
 */

 

if(!program.args.length  ) {
  program.help();
};

if( !availableCommands.includes(program.args[0]) ){
  program.help();
}