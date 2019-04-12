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
const path     = require('path');
const program = require('commander');
const prompt = require('prompt');
const shelljs   = require('shelljs');

const Create = require('../classes/create');
const Projects = require('../classes/projects');
const DB      = require('../classes/db');
const INTEG   = require('../classes/integ');

 
const LOG    = console.log;

banner.display();

program
  .version('1.0.0', '-v, --version')
  .usage('create|projects|run|open|build [options] ');

program
  .command('create')
  .alias('generate')
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
    // console.log('  Examples:');
    // console.log();
    // console.log('    $ deploy exec sequential');
    // console.log('    $ deploy exec async');
    // console.log();
  });

program
  .command('projects [name] [options]')
  //.alias('project')
  .description('Get LB Mesh Project Details')
  .action((name, options)=>{
    banner.projects();
    
    
    let list = new Projects();
      if( name == undefined ){
        LOG();
        LOG(list.viewProjectList());
        LOG();
      } else {
        switch(name){
          case 'import':
             //LOG('-- IMPORT PROJECT INTO SCAFFOLD --');
             LOG();
             // Are you in Project Dir
             if( fs.existsSync(path.resolve('lbmesh-config.json')) && fs.existsSync(path.resolve('docker-compose.yaml')) ){
              let potentialProject = list.importProjectConfig( path.resolve('lbmesh-config.json') );  
              // LOG( potentialProject);
              LOG('     ---  WELCOME TO LB MESH PROJECT IMPORT ---')
              LOG();
              LOG('     Detected Project Name: ' + potentialProject.name.toUpperCase() ); // type ' + list.getProjectType(potentialProject.type))
              LOG('     Detected Project Type: ' + list.getProjectType(potentialProject.type));
              LOG();

              ask.
                  prompt([
                    {
                      "type": "confirm",
                      "default": "Y",
                      "name": "doimport",
                      "message": 'Are you sure you want to import this project? ' 
                    },
                    {
                      "type": "confirm",
                      "default": "Y",
                      "name": "donpm",
                      "message": 'Do you need to run `npm install` in this project? ' 
                    }     
                  ]).then( answers => {
                      //LOG(answers);
                      if( answers.doimport ){
                        
                        LOG();
                        // Check
                        if( !list.doesProjectExist(potentialProject.name) ){
                          list.importProject( potentialProject );

                          LOG( chalk.blue('      Project '+ potentialProject.name.toUpperCase() + ' successfully imported!'))
                          LOG('    -------------------------------------------');   

                          if( answers.donpm ){
                            LOG();
                            LOG(chalk.blue("  - Running NPM INSTALL for... "));    
                            LOG();
                            // list.updateImportProject( potentialProject.type );
                            switch( potentialProject.type ){
                              case 'frontend+backend':
                                  LOG(chalk.blue("     - FRONTEND: WWW "));    
                                  sh.cd( path.join(potentialProject.path,'frontend','www') );  
                                  sh.exec('npm install');

                                  LOG(chalk.blue("     - FRONTEND: ADMIN "));    
                                  sh.cd( path.join(potentialProject.path,'frontend','admin') );  
                                  sh.exec('npm install');

                                  LOG(chalk.blue("     - FRONTEND: API "));    
                                  sh.cd( path.join(potentialProject.path,'frontend','api') );  
                                  sh.exec('npm install');

                                  LOG(chalk.blue("     - BACKEND: SCHEDULER "));    
                                  sh.cd( path.join(potentialProject.path,'backend','scheduler') );  
                                  sh.exec('npm install');

                                  LOG(chalk.blue("     - BACKEND: DATABANK "));    
                                  sh.cd( path.join(potentialProject.path,'backend','databank') );  
                                      sh.exec('npm install');

                                      LOG(chalk.blue("     - BACKEND: MESSENGER "));    
                                      sh.cd( path.join(potentialProject.path,'backend','messenger') );  
                                          sh.exec('npm install');
                              break;
                              case 'frontend-www':
                                LOG(chalk.blue("     - FRONTEND: WWW "));    
                                sh.cd( path.join(potentialProject.path,'frontend','www') );  
                                sh.exec('npm install');
 
                              break;
                              case 'frontend-admin':
                                LOG(chalk.blue("     - FRONTEND: ADMIN "));    
                                sh.cd( path.join(potentialProject.path,'frontend','admin') );  
                                sh.exec('npm install');
                              break;
                              case 'frontend-api':
                                LOG(chalk.blue("     - FRONTEND: API "));    
                                sh.cd( path.join(potentialProject.path,'frontend','api') );  
                                sh.exec('npm install');
                              break;
                              case 'backend-scheduler':
                                LOG(chalk.blue("     - BACKEND: SCHEDULER "));    
                                sh.cd( path.join(potentialProject.path,'backend','scheduler') );  
                                sh.exec('npm install');
                              break;
                              case 'backend-databank':
                                LOG(chalk.blue("     - BACKEND: DATABANK "));    
                                sh.cd( path.join(potentialProject.path,'backend','databank') );  
                                    sh.exec('npm install');
                              break;
                              case 'backend-messenger':
                                LOG(chalk.blue("     - BACKEND: MESSENGER "));    
                                sh.cd( path.join(potentialProject.path,'backend','messenger') );  
                                    sh.exec('npm install');
                              break;
                            }
                            LOG('    -------------------------------------------'); 
                          }

                        } else {
                          LOG( chalk.red('      Project with name '+ potentialProject.name.toUpperCase() + ' already exists!'))
                          LOG('    -------------------------------------------');                            
                        }

                        LOG();

                      } else {

                        LOG();
                        LOG( chalk.red('      Canceling '+ potentialProject.name.toUpperCase() + ' Project Import'))
                        LOG('    -------------------------------------------');
                        LOG();

                      }
                  });

                //list.importProject( path.resolve('lbmesh-config.json') );
              
               
             } else {
               LOG();
               LOG( chalk.red('Not currently in a LB Mesh Project Directory') );
               LOG();
             }
             


          break;
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

program
  .command('db [action] [service]')
  .description('Manage DB Containers (start|stop|restart|status|logs|config) ')
  .action((action, service)=>{
       
      banner.databases();
      let myAction = (action == undefined)? 'empty' : action.toLowerCase();
      let myComponent = (service == undefined)? 'all' : service.toLowerCase();
      let myServices = ['mongodb','postgres','redis','mysql','cloudant','mssql'];
      //console.log( machine );
      let datastoreFilePath = path.join(machine.homedir,'.lbmesh.io','lbmesh-db-stack.yaml');
    if( fs.existsSync(datastoreFilePath) ){
      switch(myAction){   
        case 'config':
            let mySettings = new DB();
            let showTable = mySettings.retrievePorts();
            
            LOG( showTable.table );
            LOG();

            ask
            .prompt([
              // {
              //   "type": "input",
              //   "default": "Demo",
              //   "name": "appname",
              //   "message": 'What is the name of your Application?'
              // },
              {
                "type": "list",
                "default": "exit",
                "message": "Which DB Settings would you like to update?",
                "name": "dbSettings",
                "choices": [
                 // {"name": "Full Stack ( Frontend + Backend )", "value": "frontend-backend"},
                  //new ask.Separator(),
                  {"name":"MongoDB", "value":"mongodb"},
                  {"name":"MySQL", "value":"mysql"},
                  {"name":"Cloudant", "value":"cloudant"},
                  {"name":"Redis", "value":"redis"},
                  {"name":"Postgres", "value":"postgres"},
                  {"name":"MS SQL", "value":"mssql"},
                  new ask.Separator(),
                  {"name":"No Changes, Exit", "value":"exit"},                  
                ],
                //"message": 'Create Project in Default Workspace $HOME/Workspace-lbmesh/ (Y) or Current Directory (n)?'
              }
            ]).then(answers => {
                //LOG(answers);
                if( answers.dbSettings !== 'exit') {
                  ask.
                  prompt([
                    {
                      "type": "input",
                      "default": showTable.sourceData[answers.dbSettings].port,
                      "name": "newPort",
                      "message": 'What port would you like to use for ' + answers.dbSettings.toUpperCase() + ' ?'
                    }                   
                    // {
                    //   "type": "input",
                    //   "default": showTable.sourceData[answers].image,
                    //   "name": "newImage",
                    //   "message": 'What Container Image would you like to use for your ' + answers.toUpperCase() + ' Instance?'
                    // },  
                  ]).then( answers2 => {
                        answers2["chosenDB"] = answers.dbSettings;
                        mySettings.updatePorts(answers2);
                  });
                }
    
            });
            //LOG( mySettings.retrievePorts() );
            LOG()
        break;
        case 'start':
            let myStart = new DB();
            let startTable = myStart.retrievePorts();
          if( myServices.includes(myComponent) ){
            shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-db-'+ myComponent +'.yaml') + " up -d"); 
            switch(myComponent){
              case 'cloudant':
                LOG();
                LOG('   OPENING CLOUDANT DASHBOARD http://localhost:' + startTable.sourceData.cloudant.port + '/dashboard.html ');
                LOG('           CLOUDANT User/Pass:  admin / pass');
                LOG();
                shelljs.exec("sleep 3s");
                shelljs.exec("opn http://localhost:" + startTable.sourceData.cloudant.port +"/dashboard.html");                  
              break;
            }
          } else {
            shelljs.exec("docker-compose -f " + datastoreFilePath + " up -d"); 
          }
          LOG()
        break;
        case 'stop':
          if( myServices.includes(myComponent) ){
            shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-db-'+ myComponent +'.yaml') + " down"); 
          } else {
            shelljs.exec("docker-compose -f " + datastoreFilePath + " down");  
          }
          LOG()
        break;
        case 'restart':
          if( myServices.includes(myComponent) ){
            shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-db-'+ myComponent +'.yaml') + " restart"); 
          } else {
            shelljs.exec("docker-compose -f " + datastoreFilePath + " restart"); 
          }
          LOG();
        break;
        case 'status':
          shelljs.exec("docker ps --filter name=lbmesh-db*");
          LOG();
        break;
        case 'logs':
          if( myServices.includes(myComponent) ){
            shelljs.exec("docker logs lbmesh-db-" + myComponent + " -f");
            //  -f " + datastoreFilePath + " down"); 
          } else {
            LOG()
            LOG(' Please supply a service name to view container logs.  Options are: mongodb | redis | mysql | postgres | cloudant')
            LOG()
          }
        break;
        default:
            let mySettingsView = new DB();
            let showTableList = mySettingsView.retrievePorts();
            
            LOG();
            LOG( showTableList.table );
            LOG();


        break;
      }
    } else {
      LOG();
      LOG('  - Cannot Find LB Mesh DB Stack YAML');
      LOG();
    }

  });

program
  .command('integ [name] [service]')
  .description('Manage Integration Containers (start|stop|restart|status|logs) ')
  .action((action, service)=>{
    banner.integrations();
    let myAction = (action == undefined)? 'empty' : action.toLowerCase();
    let myComponent = (service == undefined)? 'all' : service.toLowerCase();
    let myServices = ['datapower','mqlight'];

    let integrationFilePath = path.join(machine.homedir,'.lbmesh.io','lbmesh-integ-stack.yaml');
    if( fs.existsSync(integrationFilePath) ){
      switch(myAction){
        case 'start':
          if( myServices.includes(myComponent) ){
            shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-integ-'+ myComponent +'.yaml') + " up -d"); 
          } else {
            //shelljs.exec("docker-compose -f " + datastoreFilePath + " restart"); 
          }
          LOG();
        break;
        case 'stop':
          if( myServices.includes(myComponent) ){
            shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent,'lbmesh-integ-'+ myComponent +'.yaml') + " down"); 
          } else {
            //shelljs.exec("docker-compose -f " + datastoreFilePath + " restart"); 
          }
          LOG();
        break;
        case 'restart':
          if( myServices.includes(myComponent) ){
            shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-integ-'+ myComponent +'.yaml') + " restart"); 
          } else {
            //shelljs.exec("docker-compose -f " + datastoreFilePath + " restart"); 
          }
          LOG();
        break;
        case 'status':
          shelljs.exec("docker ps --filter name=lbmesh-integ*");
          LOG();
        break;
        case 'logs':
            if( myServices.includes(myComponent) ){
              shelljs.exec("docker logs lbmesh-integ-" + myComponent + " -f");
              //  -f " + datastoreFilePath + " down"); 
            } else {
              LOG()
              LOG(' Please supply a service name to view container logs.  Options are: datapower | mqlight | iib | acemqserver | mq')
              LOG()
            }
        break;
        default:
          let mySettingsView = new INTEG();
          let showTableList = mySettingsView.retrievePorts();
          
          LOG();
          LOG( showTableList.table );
          LOG();
        break;
      }
    } else {
      LOG();
      LOG('  - Cannot Find LB Mesh Integration Stack YAML');
      LOG();      
    }

  });


program
  .command('run [action] [component]')
  .description('Start|Stop|Restart|Log environment via pm2 runtime')
  .action((action, component)=>{
    banner.runtime();
    if( fs.existsSync(path.resolve('lbmesh-config.json')) && fs.existsSync(path.resolve('docker-compose.yaml')) ){
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
      if( fs.existsSync(path.resolve('lbmesh-config.json')) && fs.existsSync(path.resolve('docker-compose.yaml')) ) {
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
            shelljs.exec("opn http://localhost:" + projDetails.apps.api.port + "/wwwapi/explorer");
          }

          if( projDetails.apps.scheduler.port > 0 ){
            LOG('   OPENING BACKEND-SCHEDULER http://localhost:' + projDetails.apps.scheduler.port + ' for Project ' + projDetails.name)
            shelljs.exec("opn http://localhost:" + projDetails.apps.scheduler.port + "/scheduler/explorer");
          }

          if( projDetails.apps.messenger.port > 0 ){
            LOG('   OPENING BACKEND-MESSENGER http://localhost:' + projDetails.apps.messenger.port + ' for Project ' + projDetails.name)
            shelljs.exec("opn http://localhost:" + projDetails.apps.messenger.port + "/messenger/explorer");
          }

          if( projDetails.apps.databank.port > 0 ){
            LOG('   OPENING BACKEND-DATABANK http://localhost:' + projDetails.apps.databank.port + ' for Project ' + projDetails.name)
            shelljs.exec("opn http://localhost:" + projDetails.apps.databank.port + "/databank/explorer");
          }
          LOG();

      } else {
        LOG();
        banner.browser();
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
      if( fs.existsSync(path.resolve('lbmesh-config.json')) && fs.existsSync(path.resolve('docker-compose.yaml')) ){
       // shelljs.exec("docker-compose build");
      } else {
        LOG();
        console.error("Not in a current LB Mesh Project Directory.")
        LOG();
      }
  });

  program
  .command('k8')
  .description('Generate Kubernetes YAML Deployment Files')
  .action((name)=>{

  });

// program
//   .command('interactive')
//   .description('Interactive CLI Interface to guide through Project')
//   .action((name)=>{
//       shelljs.exec("lbmesh-helper");
//   });

program
  .command("help [cmd]")
  .description("Get Detailed Usage Help for Command")
  .action((cmd)=> {
    let myCommand = (cmd == undefined)? 'empty' : cmd.toLowerCase();
    banner.help(myCommand);

    switch(myCommand){
      case 'run':
        LOG();
        LOG('   This COMMAND is available only within the root of a LB Mesh Project Folder.');
        LOG('   It wraps around PM2 and DOCKER runtime environments.  Please view list of available options in table below. ');
        LOG();
        banner.runhelp('run');

      break;
      case 'create':
        LOG();
        LOG('   This COMMAND is available anywhere on the filesystem.  It will start the wizard to create a project inside the workspace.');
        LOG('   You will have the option to build a complete stack ( Frontend & Backend ) or build an individual project');
        LOG();        
        LOG();
        LOG('   $ lbmesh create')
        LOG();
      break;
      case 'open':
        LOG();
        LOG('   This COMMAND is available only within the root of a LB Mesh Project Folder.');
        LOG('   It will read the project config file and get a list of the ports where apps are assigned.');
        LOG('   Run the following command to access open the project componets in the default browser');
        LOG();
        LOG('   $ lbmesh open')
        LOG();
        LOG();  

      break;
      case 'projects':
        LOG();
        LOG('   This COMMAND is available anywhere on the filesystem.  There are two states you can use this command.  ');
        LOG('   It will read the project config file and get a list of the ports where apps are assigned.');
        LOG();
        LOG('   $ lbmesh projects')
        LOG();
        LOG();
        LOG('   Once you have a list of projects, you can get details about that project by using the project name appended to the same command')
        LOG();
        LOG('   $ lbmesh projects #projectname#')
        LOG();
        LOG('   Change Directory to that folder to get more access to the following commands:');
        LOG();
        LOG('   $ lbmesh run')
        LOG('   $ lbmesh open')
        LOG('   $ lbmesh build')
        LOG();

      break;
      case 'build':
        LOG();
        LOG('   This COMMAND is available only within the root of a LB Mesh Project Folder.');
        LOG('   It will read the docker-compose.yaml file and get the path for each component and do a \'docker build\'.');
        LOG();
        LOG();
        LOG('   $ lbmesh build')
        LOG();
        LOG('   This will not assign tag numbers to the build, but give them all the :latest tag.');
        LOG('   If you wish to assign your own container image tags, cd to the root of each component and run the following command:')
        LOG();
        LOG('   $ docker build -t imagename:tag .')
        LOG();
        LOG('   Looking to add this functionality as a future feature to do the following: ')
        LOG();
        LOG();
        LOG('   $ lbmesh build')
        LOG();
        LOG();
      break;
      default:
        program.help();
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

// if( !availableCommands.includes(program.args[0]) ){
//   program.help();
// }