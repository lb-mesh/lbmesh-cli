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
const path     = require('path');
const pkg = require( path.join(machine.node.globalPath, 'lbmesh-cli','package.json')) ;
require('please-upgrade-node')(pkg)

const ask = require('inquirer');
const banner = require( path.join(machine.node.globalPath,"lbmesh-cli","lib","banner" ) );
const chalk  = require('chalk');
const availableCommands = ['create','projects','build','run','open','help'];
const availableApps = ['admin','databank','scheduler','messenger','www','api'];

const resolveCWD = require('resolve-cwd');
const debug  = require('debug')('app:cli:lbmesh');
const fs     = require('fs');
const jsonfile = require('jsonfile');

const Ora = require('ora');
const program = require('commander');
const prompt = require('prompt');
const shelljs   = require('shelljs');
const isWindows = (machine.platform == 'win32')? true : false;

const Create = require( path.join(machine.node.globalPath,'lbmesh-cli','classes','create'));
const Projects = require(path.join(machine.node.globalPath,'lbmesh-cli','classes','projects'));
const DB      = require(path.join(machine.node.globalPath,'lbmesh-cli','classes','db'));
const INTEG   = require(path.join(machine.node.globalPath,'lbmesh-cli','classes','integ'));
const GUI    = require( path.join(machine.node.globalPath,'lbmesh-cli','classes','gui') );
const DECISIONS = require(path.join(machine.node.globalPath,'lbmesh-cli','classes','decisions.js'));
 
const LOG    = console.log;



program
  .version(pkg.version, '-v, --version')
  .usage('create|projects|run|open|code|dash|build [options] ');

program
  .command('create')
  .alias('generate')
  .description('Scaffold a new LB Mesh Default Project')
  .action( ()=> {

    banner.display();
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
            "default": "frontend-backend",
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

  });

program
  .command('projects [name] [options]')
  .description('Get LB Mesh Project Details')
  .action((name, options)=>{

    banner.display();
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
                      "message": 'Do you need to run `npm install` for this project? ' 
                    }   
                  ]).then( answers => {
                      //LOG(answers);
                      if( answers.doimport ){
                        
                        LOG();
                        // Check
                        if( !list.doesProjectExist(potentialProject.name) ){

                              if(answers.donpm ){
                                LOG();
                                LOG(chalk.blue("  - Running NPM INSTALL for... "));    
                                LOG();
                                // list.updateImportProject( potentialProject.type );
                                switch( potentialProject.type ){
                                  case 'frontend-backend':
                                      LOG(chalk.blue("     - FRONTEND: WWW "));    
                                      shelljs.cd( path.join(potentialProject.path,'frontend','www') );  
                                      shelljs.exec('npm install');

                                      LOG(chalk.blue("     - FRONTEND: ADMIN "));    
                                      shelljs.cd( path.join(potentialProject.path,'frontend','admin') );  
                                      shelljs.exec('npm install');

                                      LOG(chalk.blue("     - FRONTEND: API "));    
                                      shelljs.cd( path.join(potentialProject.path,'frontend','api') );  
                                      shelljs.exec('npm install');

                                      LOG(chalk.blue("     - BACKEND: SCHEDULER "));    
                                      shelljs.cd( path.join(potentialProject.path,'backend','scheduler') );  
                                      shelljs.exec('npm install');

                                      LOG(chalk.blue("     - BACKEND: DATABANK "));    
                                      shelljs.cd( path.join(potentialProject.path,'backend','databank') );  
                                          shelljs.exec('npm install');

                                          LOG(chalk.blue("     - BACKEND: MESSENGER "));    
                                          shelljs.cd( path.join(potentialProject.path,'backend','messenger') );  
                                              shelljs.exec('npm install');
                                  break;
                                  case 'frontend-www':
                                    LOG(chalk.blue("     - FRONTEND: WWW "));    
                                    shelljs.cd( path.join(potentialProject.path,'frontend','www') );  
                                    shelljs.exec('npm install');
    
                                  break;
                                  case 'frontend-admin':
                                    LOG(chalk.blue("     - FRONTEND: ADMIN "));    
                                    shelljs.cd( path.join(potentialProject.path,'frontend','admin') );  
                                    shelljs.exec('npm install');
                                  break;
                                  case 'frontend-api':
                                    LOG(chalk.blue("     - FRONTEND: API "));    
                                    shelljs.cd( path.join(potentialProject.path,'frontend','api') );  
                                    shelljs.exec('npm install');
                                  break;
                                  case 'backend-scheduler':
                                    LOG(chalk.blue("     - BACKEND: SCHEDULER "));    
                                    shelljs.cd( path.join(potentialProject.path,'backend','scheduler') );  
                                    shelljs.exec('npm install');
                                  break;
                                  case 'backend-databank':
                                    LOG(chalk.blue("     - BACKEND: DATABANK "));    
                                    shelljs.cd( path.join(potentialProject.path,'backend','databank') );  
                                        shelljs.exec('npm install');
                                  break;
                                  case 'backend-messenger':
                                    LOG(chalk.blue("     - BACKEND: MESSENGER "));    
                                    shelljs.cd( path.join(potentialProject.path,'backend','messenger') );  
                                        shelljs.exec('npm install');
                                  break;
                                }

                                LOG();
                                list.importProject( potentialProject );
                                LOG();

                              } else {
                                LOG();
                                list.importProject( potentialProject );
                                LOG();
                              }
                         
                          LOG();
                          LOG( chalk.blue('      Project '+ potentialProject.name.toUpperCase() + ' successfully imported!'))
                          LOG('    -------------------------------------------');   

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
.command('code [component]')
.description('Work with Project Component')
.action( (component) => {

  banner.display();
  banner.code();

  let myName = (component == undefined)? 'empty' : component;
  
  if( fs.existsSync(path.resolve('lbmesh-config.json')  ) ){    
    
      if( availableApps.includes(myName)){

        let myComponent = new DECISIONS();
            myComponent.startProcess(myName);
        
      } else {
        LOG()
        LOG()
        LOG(chalk.red(' Please supply a correct COMPONENT to start interactive coding.  '));
        LOG(' Options are:  ' + availableApps)
        LOG()
        LOG()
      }

  } else {
    LOG();
    LOG( chalk.red('Not currently in a LB Mesh Project Directory') );
    LOG();       
  }

});


program
  .command('run [action] [component]')
  .description('Start|Stop|Restart|Log environment via pm2 runtime')
  .action((action, component)=>{
    LOG();
    banner.display();
    banner.runtime();

    if( fs.existsSync(path.resolve('lbmesh-config.json')) && fs.existsSync(path.resolve('docker-compose.yaml')) ){
        let myAction = (action == undefined)? 'empty' : action.toLowerCase();
        let myComponent = (component == undefined)? 'all' : component.toLowerCase() ;

        switch(myAction){
          case 'empty':
              LOG(' no action provided');
          break;
          case 'start':
          case 'stop':
          case 'restart':
          case 'delete':
              shelljs.exec("pm2 " + myAction +" pm2-ecosystem.config.yaml");
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

    banner.display();
    banner.browser();

      if( fs.existsSync(path.resolve('lbmesh-config.json')) && fs.existsSync(path.resolve('docker-compose.yaml')) ) {

            
        let list = new Projects();
        let projDetails = list.readProjectConfig(process.cwd());

          // Loop thru all the apps ports
          LOG();
          if( projDetails.apps.www.port > 0 ){
            LOG('   OPENING FRONTEND-WWW http://localhost:' + projDetails.apps.www.port + ' for Project ' + projDetails.name)
            shelljs.exec("open http://localhost:" + projDetails.apps.www.port);
          }

          if( projDetails.apps.admin.port > 0 ){
            LOG('   OPENING FRONTEND-ADMIN http://localhost:' + projDetails.apps.admin.port + ' for Project ' + projDetails.name)
            shelljs.exec("open http://localhost:" + projDetails.apps.admin.port);
          }

          if( projDetails.apps.api.port > 0 ){
            LOG('   OPENING FRONTEND-API http://localhost:' + projDetails.apps.api.port + ' for Project ' + projDetails.name)
            shelljs.exec("open http://localhost:" + projDetails.apps.api.port + "/wwwapi/explorer");
          }

          if( projDetails.apps.scheduler.port > 0 ){
            LOG('   OPENING BACKEND-SCHEDULER http://localhost:' + projDetails.apps.scheduler.port + ' for Project ' + projDetails.name)
            shelljs.exec("open http://localhost:" + projDetails.apps.scheduler.port + "/scheduler/explorer");
          }

          if( projDetails.apps.messenger.port > 0 ){
            LOG('   OPENING BACKEND-MESSENGER http://localhost:' + projDetails.apps.messenger.port + ' for Project ' + projDetails.name)
            shelljs.exec("open http://localhost:" + projDetails.apps.messenger.port + "/messenger/explorer");
          }

          if( projDetails.apps.databank.port > 0 ){
            LOG('   OPENING BACKEND-DATABANK http://localhost:' + projDetails.apps.databank.port + ' for Project ' + projDetails.name)
            shelljs.exec("open http://localhost:" + projDetails.apps.databank.port + "/databank/explorer");
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
  .description('Generate Docker Container for LB Code')
  .action((name)=>{

    banner.browser();
    banner.build();

      if( fs.existsSync(path.resolve('lbmesh-config.json')) && fs.existsSync(path.resolve('docker-compose.yaml')) ){
          let myName = (name == undefined)? 'none' : name.toLowerCase();
          const servicesList = ['www','api','admin','messenger','scheduler','databank'];

          let list = new Projects();
          let projDetails = list.readProjectConfig(process.cwd());

            LOG('     ---  WELCOME TO LB MESH PROJECT BUILD ---')
            LOG();
            LOG('     Detected Project Name: ' + projDetails.name.toUpperCase() ); 
            LOG('     Detected Project Type: ' + list.getProjectType(projDetails.type));
            LOG(); 

          LOG(myName);
          switch(projDetails.type){
            case 'frontend-backend':
                if( servicesList.includes(myName) ){
                    /**
                     * Build Container specified
                     */
                      ask.prompt([{
                        "type": "input",
                        "default": "latest",
                        "name": "tagLabel",
                        "message": 'Specify a label tag for the component ' + list.getProjectType( (myName=='www'||myName=='admin'||myName=='api')? 'frontend-' + myName : 'backend-' + myName ) + '? '
                      }]).then( answers2 => {
  
                          switch( myName ){
                            case 'www':
                              shelljs.exec("docker build -t " + projDetails.name + "-www:" + answers2.tagLabel + " " + path.join(process.cwd(),'frontend','www','.') );
                            break;
                            case 'admin':
                              shelljs.exec("docker build -t " + projDetails.name + "-admin:" + answers2.tagLabel + " " + path.join(process.cwd(),'frontend','admin','.') );
                            break;
                            case 'api':
                              shelljs.exec("docker build -t " + projDetails.name + "-api:" + answers2.tagLabel + " " + path.join(process.cwd(),'frontend','api','.') );
                            break;
                            case 'messenger':
                              shelljs.exec("docker build -t " + projDetails.name + "-messenger:" + answers2.tagLabel + " " + path.join(process.cwd(),'backend','messenger','.') );
                            break;
                            case 'databank':
                              shelljs.exec("docker build -t " + projDetails.name + "-databank:" + answers2.tagLabel + " " + path.join(process.cwd(),'backend','databank','.') );
                            break;
                            case 'scheduler':
                              shelljs.exec("docker build -t " + projDetails.name + "-scheduler:" + answers2.tagLabel + " " + path.join(process.cwd(),'backend','scheduler','.') );
                            break;
                          }
                          LOG();

                      });
                } else {
                    ask.
                    prompt([
                        {
                          "type": "confirm",
                          "default": "Y",
                          "name": "buildall",
                          "message": 'Would you like to build all containers with same tag? ' 
                        },                 
                    ])
                    .then(answers => {
                        if( answers.buildall ){
                            // Ask for Tag
                            ask.prompt([{
                              "type": "input",
                              "default": "latest",
                              "name": "tagLabel",
                              "message": 'Specify a label to tag all containers in this PROJECT? '
                            }]).then(answers2 => {
                                LOG()
                                LOG(' ---- BUILDING PROJECT ' + projDetails.name.toUpperCase() + ' with TAG ' + answers2.tagLabel );
                                LOG();
                                LOG();
                                    // docker build -t imagename:tag .
                                    shelljs.exec("docker build -t " + projDetails.name + "-www:" + answers2.tagLabel + " " + path.join(process.cwd(),'frontend','www','.') );
                                    LOG();
                                      projDetails.apps.www.image = projDetails.name + "-www";
                                      projDetails.app.www.tag = answers2.tagLabel;

                                    shelljs.exec("docker build -t " + projDetails.name + "-admin:" + answers2.tagLabel + " " + path.join(process.cwd(),'frontend','admin','.') );
                                    LOG();
                                      projDetails.apps.admin.image = projDetails.name + "-admin";
                                      projDetails.app.admin.tag = answers2.tagLabel;

                                    shelljs.exec("docker build -t " + projDetails.name + "-api:" + answers2.tagLabel + " " + path.join(process.cwd(),'frontend','api','.') );
                                    LOG();
                                    LOG();
                                      projDetails.apps.api.image = projDetails.name + "-api";
                                      projDetails.app.api.tag = answers2.tagLabel;

                                    shelljs.exec("docker build -t " + projDetails.name + "-messenger:" + answers2.tagLabel + " " + path.join(process.cwd(),'backend','messenger','.') ); 
                                    LOG();
                                      projDetails.apps.messenger.image = projDetails.name + "-messenger";
                                      projDetails.app.messenger.tag = answers2.tagLabel;

                                    shelljs.exec("docker build -t " + projDetails.name + "-scheduler:" + answers2.tagLabel + " " + path.join(process.cwd(),'backend','scheduler','.') );
                                    LOG();
                                      projDetails.apps.scheduler.image = projDetails.name + "-scheduler";
                                      projDetails.app.scheduler.tag = answers2.tagLabel;
                                      
                                    shelljs.exec("docker build -t " + projDetails.name + "-databank:" + answers2.tagLabel + " " + path.join(process.cwd(),'backend','databank','.') );
                                    LOG();
                                    LOG();
                                      projDetails.apps.databank.image = projDetails.name + "-databank";
                                      projDetails.app.databank.tag = answers2.tagLabel;

                                    
                            });
                        } else {
                            // Want to build individual container
                            ask.prompt([
                              {
                                "type": "list",
                                "default": "exit",
                                "message": "Which project component would you like to build?",
                                "name": "component",
                                "choices": [
                                  new ask.Separator(),
                                  {"name":"Frontend - WWW", "value":"www"},
                                  {"name":"Frontend - Admin", "value":"admin"},
                                  {"name":"Frontend - API", "value":"api"},
                                  {"name":"Backend - Messenger", "value":"messenger"},
                                  {"name":"Backend - Databank", "value":"databank"},
                                  {"name":"Backend - Scheduler", "value":"scheduler"},
                                  new ask.Separator(),
                                  {"name":"None, Exit without action", "value":"exit"},                  
                                ]
                              }
                            ]).then(answers => {
                               if( answers.component !== 'exit' ){
                                  ask.prompt([{
                                    "type": "input",
                                    "default": "latest",
                                    "name": "tagLabel",
                                    "message": 'Specify a label to tag this component? '
                                  }]).then(answers2 => {
                                      LOG()
                                      LOG(' ---- BUILDING PROJECT ' + projDetails.name.toUpperCase() + ' COMPONENT ' + answers.component + ' with TAG ' + answers2.tagLabel );
                                      LOG();
                                      LOG();
                                          // docker build -t imagename:tag .
                                          switch( answers.component ){
                                            case 'www':
                                              shelljs.exec("docker build -t " + projDetails.name + "-www:" + answers2.tagLabel + " " + path.join(process.cwd(),'frontend','www','.') );
                                            break;
                                            case 'admin':
                                              shelljs.exec("docker build -t " + projDetails.name + "-admin:" + answers2.tagLabel + " " + path.join(process.cwd(),'frontend','admin','.') );
                                            break;
                                            case 'api':
                                              shelljs.exec("docker build -t " + projDetails.name + "-api:" + answers2.tagLabel + " " + path.join(process.cwd(),'frontend','api','.') );
                                            break;
                                            case 'messenger':
                                              shelljs.exec("docker build -t " + projDetails.name + "-messenger:" + answers2.tagLabel + " " + path.join(process.cwd(),'backend','messenger','.') );
                                            break;
                                            case 'databank':
                                              shelljs.exec("docker build -t " + projDetails.name + "-databank:" + answers2.tagLabel + " " + path.join(process.cwd(),'backend','databank','.') );
                                            break;
                                            case 'scheduler':
                                               shelljs.exec("docker build -t " + projDetails.name + "-scheduler:" + answers2.tagLabel + " " + path.join(process.cwd(),'backend','scheduler','.') );
                                            break;
                                          }
                                      LOG();
                                          
                                  }); 
                               } else {
                                 LOG();
                                 LOG();
                               }                             
                            });
                        }
                    });
                }
            break;
            default:

            break;
          }

      } else {
        LOG();
        console.error("This command is only available within a current LB Mesh Project Directory.")
        LOG();
      }
  });


program
  .command('db [action] [service] [display]')
   
  .description('Manage DB Containers with simple commands ')
  .action((action, service, display)=>{
      LOG()

      let myDisplay = (display == undefined )? 'empty' : display.toLowerCase();
      let myAction = (action == undefined)? 'empty' : action.toLowerCase();
      let myComponent = (service == undefined)? 'all' : service.toLowerCase();
      let myServices = ['mongodb','postgres','redis','mysql','cloudant','mssql','cassandra','elasticsearch'];
      let myServicesList = 'mongodb | redis | mysql | postgres | cloudant | mssql | cassandra | elasticsearch';
      //console.log( machine );

      if( myDisplay !== 'hide' ){
        banner.display();
        banner.databases();
      }

      let datastoreFilePath = path.join(machine.homedir,'.lbmesh.io','lbmesh-db-stack.yaml');

    if( fs.existsSync(datastoreFilePath) ){
      switch(myAction){   
        case 'config':
            let mySettings = new DB();
            let showTable = mySettings.retrievePorts();
            
            //LOG( showTable );
            LOG( showTable.table );
            LOG();

            ask
            .prompt([
              {
                "type": "list",
                "default": "exit",
                "message": "Which DB Settings would you like to update?",
                "name": "dbSettings",
                "choices": [
                  new ask.Separator(),
                  {"name":"MONGODB", "value":"mongodb"},
                  {"name":"MYSQL", "value":"mysql"},
                  {"name":"CLOUDANT", "value":"cloudant"},
                  {"name":"REDIS", "value":"redis"},
                  {"name":"POSTGRES", "value":"postgres"},
                  {"name":"MS SQL", "value":"mssql"},
                  {"name":"CASSANDRA", "value":"cassandra"},
                  {"name":"ELASTIC SEARCH", "value":"elasticsearch"},
                  new ask.Separator(),
                  {"name":"No Changes, Exit", "value":"exit"},                  
                ],
                
              }
            ]).then(answers => {
                if( answers.dbSettings !== 'exit') {
                  ask.
                  prompt([
                    {
                      "type": "input",
                      "default": showTable.sourceData[answers.dbSettings].port,
                      "name": "newPort",
                      "message": 'What port would you like to use for ' + answers.dbSettings.toUpperCase() + ' ?'
                    }                   
                  ]).then( answers2 => {
                        answers2["chosenDB"] = answers.dbSettings;
                        mySettings.updatePorts(answers2);
                  });
                }
            });
            //LOG( mySettings.retrievePorts() );
            LOG()
        break;
        case 'open':
 
            if( myServices.includes(myComponent) ){
                let myStart = new DB();
                let myDBPorts = myStart.retrievePorts();

                switch(myComponent){
                  case 'mssql':
                       
                          LOG();
                          LOG('           MSSQL User/Pass:  sa / ' + myDBPorts.sourceData.mssql.env.passwd);
                          LOG();
                     
                  break;
                  case 'cloudant':
                      LOG();
                      LOG('   OPENING CLOUDANT DASHBOARD http://localhost:' + myDBPorts.sourceData.cloudant.port + '/dashboard.html ');
                      LOG('           CLOUDANT User/Pass:  admin / pass');
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 3s");
                      }
                      shelljs.exec("open http://localhost:" + myDBPorts.sourceData.cloudant.port +"/dashboard.html");  
                  break;
                  case 'mongodb':
                      LOG();
                      LOG('   OPENING MONGODB WEB DASHBOARD http://localhost:' + myDBPorts.sourceData.mongodb.admin.port + ' ');
                      LOG();

                      if( !isWindows ){
                        shelljs.exec("sleep 3s");
                      }
                      shelljs.exec("open http://localhost:" + myDBPorts.sourceData.mongodb.admin.port );    
                  break;
                  case 'mysql':
                      LOG();
                      LOG('   OPENING MYSQL WEB DASHBOARD http://localhost:' + myDBPorts.sourceData.mysql.admin.port + ' ');
                      LOG('           MYSQL User/Pass:  root / ' + myDBPorts.sourceData.mysql.env.passwd);

                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 3s");
                      }
                      shelljs.exec("open http://localhost:" + myDBPorts.sourceData.mysql.admin.port );    
                  break;
                  case 'postgres':
                      LOG();
                      LOG('   OPENING POSTGRES WEB DASHBOARD http://localhost:' + myDBPorts.sourceData.postgres.admin.port + ' ');
                      LOG('           POSTGRES WEB User/Pass: ' + myDBPorts.sourceData.postgres.admin.user + '  / ' + myDBPorts.sourceData.postgres.admin.passwd);
                      LOG('           POSTGRES DB User/Pass: postgres  / ' + myDBPorts.sourceData.postgres.env.passwd);
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 3s");
                      }
                      shelljs.exec("open http://localhost:" + myDBPorts.sourceData.postgres.admin.port ); 
                  break;
                  case 'elasticsearch':
                      LOG();
                      LOG('   OPENING ELASTICSEARCH WEB DASHBOARD http://localhost:' + myDBPorts.sourceData.elasticsearch.admin.port + ' ');
                      LOG('           ELASTICSEARCH DATA Port: ' + myDBPorts.sourceData.elasticsearch.port );
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 3s");
                      }
                      shelljs.exec("open http://localhost:" + myDBPorts.sourceData.elasticsearch.port ); 
                      shelljs.exec("open http://localhost:" + myDBPorts.sourceData.elasticsearch.admin.port );
                  break;
                  case 'redis':
                      LOG();
                      LOG('   OPENING REDIS WEB DASHBOARD http://localhost:' + myDBPorts.sourceData.redis.admin.port + ' ');
                     // LOG('           REDIS WEB User/Pass: ' + myDBPorts.sourceData.postgres.admin.user + '  / ' + startTable.sourceData.postgres.admin.passwd);
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 3s");
                      }
                      shelljs.exec("open http://localhost:" + myDBPorts.sourceData.redis.admin.port ); 
                  break;
                  case 'cassandra':
                      LOG();
                      LOG('   OPENING CASSANDRA WEB DASHBOARD http://localhost:' + myDBPorts.sourceData.cassandra.admin.port + ' ');
                     // LOG('           REDIS WEB User/Pass: ' + myDBPorts.sourceData.postgres.admin.user + '  / ' + startTable.sourceData.postgres.admin.passwd);
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 3s");
                      }
                      shelljs.exec("open http://localhost:" + myDBPorts.sourceData.cassandra.admin.port ); 
                  break;
                }
            } else {
              LOG()
              LOG(' Please supply a correct DB service name.  ');
              LOG(' Options are:  ' + myServicesList)
              LOG()
            }
        break;
        case 'pull':
          if( myServices.includes(myComponent) ){

            LOG();
              let spinner = new Ora({
                "text": 'Processing Request to ' + myAction +' DB ' + myComponent.toUpperCase() + ' container service...'
              }).start();

            LOG('  ')
            LOG();
            shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-db-'+ myComponent +'.yaml') + " up --no-start ");
            LOG();

              spinner.succeed('  -- Successfully created ' + myComponent.toUpperCase() + ' INTEG Container Service ')
              LOG();
              LOG( chalk.red('  -- Please run the following command first to start the service --'))
              LOG( chalk.blue('     $ lbmesh db start ' + myComponent))
              LOG();
              LOG();

          } else {
            LOG()
            LOG(' Please supply a correct DB service name.  ');
            LOG(' Options are:  ' + myServicesList)
            LOG()
          }
        break;
        case 'start':
            let myStart = new DB();
            let startTable = myStart.retrievePorts();
          if( myServices.includes(myComponent) ){

            LOG();
            LOG('  Processing Request to ' + myAction +' ' + myComponent.toUpperCase() + ' DB container service...')
            LOG();

            //shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmeshelljs.io', myComponent, 'lbmesh-db-'+ myComponent +'.yaml') + " up -d"); 
              //let decision = shelljs.exec("docker start lbmesh-db-" + myComponent +' ');
              let decision = shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-db-'+ myComponent +'.yaml') + " start  "); 
              if( !decision.code ){
                  switch(myComponent){
                    case 'mssql':
                        LOG();
                        LOG('           MSSQL User/Pass:  sa / ' + startTable.sourceData.mssql.env.passwd);
                        LOG();
                    break;
                    case 'cloudant':
                      LOG();
                      LOG('   OPENING CLOUDANT DASHBOARD http://localhost:' + startTable.sourceData.cloudant.port + '/dashboard.html ');
                      LOG('           CLOUDANT User/Pass:  admin / pass');
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 3s");
                      }
                      shelljs.exec("open http://localhost:" + startTable.sourceData.cloudant.port +"/dashboard.html");                  
                    break;
                    case 'mongodb':
                        LOG();
                        LOG('   OPENING MONGODB WEB DASHBOARD http://localhost:' + startTable.sourceData.mongodb.admin.port + ' ');
 
                        LOG();
                        if( !isWindows ){
                          shelljs.exec("sleep 3s");
                        }
                        shelljs.exec("open http://localhost:" + startTable.sourceData.mongodb.admin.port );    
                    break;
                    case 'mysql':
                        LOG();
                        LOG('   OPENING MYSQL WEB DASHBOARD http://localhost:' + startTable.sourceData.mysql.admin.port + ' ');
                        LOG('           MYSQL User/Pass:  root / ' + startTable.sourceData.mysql.env.passwd);
                        LOG();
                        if( !isWindows ){
                          shelljs.exec("sleep 3s");
                        }
                        shelljs.exec("open http://localhost:" + startTable.sourceData.mysql.admin.port );    
                    break;
                    case 'postgres':
                        LOG();
                        LOG('   OPENING POSTGRES WEB DASHBOARD http://localhost:' + startTable.sourceData.postgres.admin.port + ' ');
                        LOG('           POSTGRES WEB User/Pass: ' + startTable.sourceData.postgres.admin.user + '  / ' + startTable.sourceData.postgres.admin.passwd);
                        LOG('           POSTGRES DB User/Pass: postgres  / ' + startTable.sourceData.postgres.env.passwd);
                        LOG();
                        if( !isWindows ){
                          shelljs.exec("sleep 3s");
                        }
                        shelljs.exec("open http://localhost:" + startTable.sourceData.postgres.admin.port ); 
                    break;
                    case 'elasticsearch':
                        LOG();
                        LOG('   OPENING ELASTICSEARCH WEB DASHBOARD http://localhost:' + startTable.sourceData.elasticsearch.admin.port + ' ');
                        LOG('           ELASTICSEARCH DATA Port: ' + startTable.sourceData.elasticsearch.port );
                        LOG();
                        if( !isWindows ){
                          shelljs.exec("sleep 3s");
                        }
                        shelljs.exec("open http://localhost:" + startTable.sourceData.elasticsearch.port ); 
                        shelljs.exec("open http://localhost:" + startTable.sourceData.elasticsearch.admin.port );
                    break;
                    case 'redis':
                        LOG();
                        LOG('   OPENING REDIS WEB DASHBOARD http://localhost:' + startTable.sourceData.redis.admin.port + ' ');
                        LOG();
                        if( !isWindows ){
                          shelljs.exec("sleep 3s");
                        }
                        shelljs.exec("open http://localhost:" + startTable.sourceData.redis.admin.port ); 
                    break;
                    case 'cassandra':
                        LOG();
                        LOG('   OPENING CASSANDRA WEB DASHBOARD http://localhost:' + startTable.sourceData.cassandra.admin.port + ' ');
                        LOG();
                        if( !isWindows ){
                          shelljs.exec("sleep 3s");
                        }
                        shelljs.exec("open http://localhost:" + startTable.sourceData.cassandra.admin.port ); 
                    break;
                  }

                  LOG();
                  LOG();

              } else {
                LOG()
                LOG( chalk.red('  -- Please run the following command first to start | stop | restart --'))
                LOG( chalk.blue('     $ lbmesh db pull ' + myComponent))
                LOG();
              }

          } else {
            LOG()
            LOG(' Please supply a correct DB service name.  ');
            LOG(' Options are:  ' + myServicesList)
            LOG()
          }
          LOG()
        break;
        case 'remove':
        if( myServices.includes(myComponent) ){
          ask
          .prompt([
            {
              "type": "confirm",
              "default": "Y",
              "name": "doremove",
              "message": 'Are you sure you want to remove this ' + myComponent.toUpperCase() + ' DB container and source image? ' 
            },
          ]).then( answers3 => {
            if( answers3.doremove){

              let decision = shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-db-'+ myComponent +'.yaml') + "  down --rmi all  ",{"silent":true}); 
              
              if( !decision.code ){
                LOG()
                LOG(' Successfully removed all services and images for ' + myComponent.toUpperCase() + ' database container service');
                LOG()                 
              } else {

              }              
 
            }
          });


        } else {
          LOG()
          LOG(' Please supply a correct DB service name.  ');
          LOG(' Options are:  ' + myServicesList)
          LOG()
        }
        LOG();
        break;
        case 'recreate':
          if( myServices.includes(myComponent) ){
            LOG();
            LOG();
            LOG('   -- STOPPING DB container for ' + myComponent);
            shelljs.exec("docker stop lbmesh-db-" + myComponent);
            LOG('   -- REMOVING DB container for ' + myComponent);
            shelljs.exec("docker rm lbmesh-db-" + myComponent);
            LOG();
            LOG('   -- Rebuilding new container for ' + myComponent);
            LOG();
            shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-db-'+ myComponent +'.yaml') + " up --no-start --force-recreate "); 

            LOG();
            LOG();
          } else {
            LOG()
            LOG(' Please supply a correct DB service name.  ');
            LOG(' Options are:  ' + myServicesList)
            LOG()
          }
          LOG();
        break;
        case 'stop':
        //case 'restart':
          if( myServices.includes(myComponent) ){

            LOG();
            LOG('  Processing Request to ' + myAction +' ' + myComponent.toUpperCase() + ' DB container service...')
            LOG();

              //let decision = shelljs.exec("docker  "+ myAction +"  lbmesh-db-" + myComponent +" ");
              let decision = shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-db-'+ myComponent +'.yaml') + " stop  "); 
              if( !decision.code ){

              } else {
                LOG()
                LOG( chalk.red('  -- Please run the following command first to start | stop | restart | remove --'))
                LOG( chalk.blue('     $ lbmesh db pull ' + myComponent))
                LOG();
              }
             
          } else {
            LOG()
            LOG(' Please supply a correct DB service name.  ');
            LOG(' Options are:  ' + myServicesList)
            LOG()
          }
          LOG()
        break;

        case 'status':
          shelljs.exec("docker ps --filter name=lbmesh-db*");
          LOG();
        break;
        case 'logs':
          if( myServices.includes(myComponent) ){
            shelljs.exec("docker logs lbmesh-db-" + myComponent + " -f ");
            //  -f " + datastoreFilePath + " down"); 
          } else {
            LOG()
            LOG(' Please supply a correct DB service name.  ');
            LOG(' Options are:  ' + myServicesList)
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
  .command('integ [action] [service] [display]')
  .description('Manage Integration Containers with simple commands   ')
  .action((action, service, display)=>{
    LOG();

    let myDisplay = (display == undefined)? 'empty': display.toLowerCase();
    let myAction = (action == undefined)? 'empty' : action.toLowerCase();
    let myComponent = (service == undefined)? 'all' : service.toLowerCase();
    let myServices = ['datapower','mqlight','iib','mq','rabbitmq','acemq','ace','mqtt','splunk','kafka'];
    let myServicesList = 'datapower | mqlight | iib | rabbitmq | acemq | mq | splunk | kafka | mqtt | ace';

     
    if( myDisplay !== 'hide'){
      banner.display();
      banner.integrations();
    }
    
    let integrationFilePath = path.join(machine.homedir,'.lbmesh.io','lbmesh-integ-stack.yaml');
    if( fs.existsSync(integrationFilePath) ){
      switch(myAction){
        case 'config':

              let myIntegDashboard = new INTEG();
              let myIntegConfig  = myIntegDashboard.retrievePorts();
              
              LOG( myIntegConfig.table );
              LOG();

              ask
              .prompt([
                {
                  "type": "list",
                  "default": "exit",
                  "message": "Which Integration Service would you like to update?",
                  "name": "integSettings",
                  "choices": [
                    new ask.Separator(),
                    {"name":"DATAPOWER", "value":"datapower"},
                    {"name":"MQLIGHT", "value":"mqlight"},
                    {"name":"IIB", "value":"iib"},
                    {"name":"MQ", "value":"mq"},
                    {"name":"KAFKA", "value":"kafka"},
                    {"name":"SPLUNK", "value":"splunk"},
                    {"name":"RABBITMQ", "value":"rabbitmq"},
                    {"name":"ACEMQ", "value":"acemq"},
                    new ask.Separator(),
                    {"name":"No Changes, Exit", "value":"exit"},                  
                  ],
                  //"message": 'Create Project in Default Workspace $HOME/Workspace-lbmesh/ (Y) or Current Directory (n)?'
                }
              ]).then(answers => {
                  if( answers.integSettings !== 'exit') {

                    let configQuestions = myIntegDashboard.getQuestionList(answers.integSettings);
                    ask.
                    prompt(configQuestions).then( answers2 => {
                        answers2["instance"] = answers.integSettings;
                        
                        debug("INTEG CONFIG: ANSWERS FROM FORM");
                        debug( answers2 );

                        myIntegDashboard.updatePorts(answers2);
                        
                          // answers2["chosenDB"] = answers.dbSettings;
                          // mySettings.updatePorts(answers2);
                    });
                  } else {
                    LOG();
                    LOG();
                  }
              });

              LOG();
 
        break;
        case 'remove':
            if( myServices.includes(myComponent) ){

              LOG();
              LOG('  Processing Request to ' + myAction +' ' + myComponent.toUpperCase() + ' integration container service...')
              LOG();

                ask
                .prompt([
                  {
                    "type": "confirm",
                    "default": "Y",
                    "name": "doremove",
                    "message": 'Are you sure you want to remove this INTEGRATION ' + myComponent + ' container and source images ? ' 
                  },
                ]).then( answers3 => {
                  if( answers3.doremove){

                    let decision = shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-integ-'+ myComponent +'.yaml') + "  down --rmi all  ",{"silent":true}); 
              
                    if( !decision.code ){
                      LOG()
                      LOG(' Successfully removed all services and images for ' + myComponent + ' integration container service');
                      LOG()                 
                    } else {
      
                    }
 
                  }
                });   

                LOG();


            } else {
              LOG()
              LOG(' Please supply a correct integration service name.');
              LOG(' Options are: ' + myServicesList)
              LOG()                
            }
            LOG()
        break;
        case 'start':
          if( myServices.includes(myComponent) ){

            LOG();
            LOG('  Processing Request to ' + myAction +' integration container service...')
            LOG();

            //let decision = shelljs.exec("docker "+ myAction +" lbmesh-integ-" + myComponent + " ");
            let decision = shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-integ-'+ myComponent +'.yaml') + " start  "); 
            if( !decision.code ){

                let myDashboard = new INTEG();
                let myPorts  = myDashboard.retrievePorts();

                //LOG(myPorts.sourceData);
                //if( myAction == 'start' ){
                  switch(myComponent){
                      case 'mqlight':
                      LOG();
                      LOG('   OPENING MQLIGHT DASHBOARD http://localhost:' + myPorts.sourceData.mqlight.port.admin  + '/#page=home');
                      LOG('   OPENING MQLIGHT DATA PORT: ' +  myPorts.sourceData.mqlight.port.data );                       
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 5s");
                      }
                      
                      shelljs.exec("open http://localhost:" +  myPorts.sourceData.mqlight.port.admin + "/#page=home" );                  
                    break;
                    case 'kafka':
                        LOG();
                        LOG('   OPENING KAFKA TOPICS UI http://localhost:' + myPorts.sourceData.kafka.port.topics  + '/');
                        LOG('   OPENING KAFKA SCHEMA REGISTRY UI http://localhost:' + myPorts.sourceData.kafka.port.registry  + '/');
                        LOG('   OPENING KAFKA REST http://localhost:' + myPorts.sourceData.kafka.port.rest  + '/topics');
                        LOG('           KAFKA DATA PORT: ' +  myPorts.sourceData.kafka.port.data );        
                        LOG('           KAFKA ZOOKEEPER PORT: ' +  myPorts.sourceData.kafka.port.zookeeper );                 
                        LOG();
                        if( !isWindows ){
                          shelljs.exec("sleep 5s");
                        }
                        
                        shelljs.exec("open http://localhost:" +  myPorts.sourceData.kafka.port.topics + "/" ); 
                        shelljs.exec("open http://localhost:" +  myPorts.sourceData.kafka.port.registry + "/" ); 
                        shelljs.exec("open http://localhost:" +  myPorts.sourceData.kafka.port.rest + "/topics" );
                    break;
                    case 'splunk':
                      LOG();
                      LOG('   OPENING SPLUNK DASHBOARD http://localhost:' +  myPorts.sourceData.splunk.port.admin);
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 5s");
                      }
                      shelljs.exec("open http://localhost:" +  myPorts.sourceData.splunk.port.admin);   
                    break;
                    case 'iib':
                      LOG();
                      LOG('   OPENING IIB DASHBOARD http://localhost:' +  myPorts.sourceData.iib.port.admin);
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 5s");
                      }
                      shelljs.exec("open http://localhost:" +  myPorts.sourceData.iib.port.admin);   
                    break;
                    case 'ace':
                      LOG();
                      LOG('   OPENING ACE DASHBOARD http://localhost:' +  myPorts.sourceData.ace.port.admin);
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 5s");
                      }
                      shelljs.exec("open http://localhost:" +  myAdminPorts.sourceData.iib.port.admin);   
                    break;
                    case 'datapower':
                      LOG();
                      LOG('   OPENING DATAPOWER DASHBOARD https://localhost:' +  myPorts.sourceData.datapower.port.admin);
                      LOG('           DATAPOWER User/Pass:  admin / admin');
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 5s");
                      }
                      shelljs.exec("open https://localhost:" +  myPorts.sourceData.datapower.port.admin);   
                    break;
                    case 'rabbitmq':
                      LOG();
                      LOG('   OPENING RABBITMQ DASHBOARD http://localhost:' +  myPorts.sourceData.rabbitmq.port.admin);
                      LOG('           RABBITMQ User/Pass: ' + myPorts.sourceData.rabbitmq.env.user + ' / ' + myPorts.sourceData.rabbitmq.env.pass );
                      LOG('           RABBITMQ DATA PORT: ' + myPorts.sourceData.rabbitmq.port.data );                      
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 5s");
                      }
                      shelljs.exec("open http://localhost:" +  myPorts.sourceData.rabbitmq.port.admin);   
                    break;
                    case 'mq':
                      LOG();
                      LOG('   OPENING MQ ADVANCED DASHBOARD https://localhost:' +  myPorts.sourceData.mq.port.admin + '/ibmmq/console/login.html ');
                      LOG('           MQ ADVANCED DASHBOARD User/Pass:  admin / ' +  myPorts.sourceData.mq.env.admin_pass );
                      //LOG('   OPENING MQ ADVANCED METRICS http://localhost:9157/metrics ');
                      LOG();
                      if( !isWindows ){
                        shelljs.exec("sleep 5s");
                      }
                      shelljs.exec("open https://localhost:" +  myPorts.sourceData.mq.port.admin + "/ibmmq/console/login.html");  
                      //shelljs.exec("open http://localhost:9157/metrics"); 
                    break;
                    case 'acemq':
                      LOG();
                      LOG('   OPENING ACE MQ DASHBOARD https://localhost:' +  myPorts.sourceData.acemq.port.mq.admin + '/ibmmq/console/login.html ');
                      LOG('           ACE MQ User/Pass:  admin / lbmesh-integ-mq');
                      LOG('   OPENING ACE SERVER DASHBOARD http://localhost:'  +  myPorts.sourceData.acemq.port.ace.admin );
                      LOG('           ACE Dashboard User/Pass:  admin / acemq');
                      //LOG('   OPENING MQ ADVANCED METRICS http://localhost:9157/metrics ');
                      LOG();
                      // shelljs.exec("sleep 5s");
                      // shelljs.exec("open https://localhost:9444/ibmmq/console/login.html");  
                      // shelljs.exec("open http://localhost:7600");  
                      //shelljs.exec("open http://localhost:9157/metrics"); 
                    break;
                    
                  }             
               // }// end if start
            }else{
              LOG()
              LOG( chalk.red('  -- Please run the following command first to start | stop | restart --'))
              LOG( chalk.blue('     $ lbmesh integ pull ' + myComponent))
              LOG();
            }
          } else {
            LOG()
            LOG(' Please supply a correct integration service name.');
            LOG(' Options are: ' + myServicesList)
            LOG()  
          }
          LOG();
        break;
        case 'stop':
        //case 'restart':

            if( myServices.includes(myComponent) ){
                LOG();
                LOG('  Processing Request to ' + myAction +' integration container service...')
                LOG();
                //let decision = shelljs.exec("docker "+ myAction +" lbmesh-integ-" + myComponent + " ");
                let decision = shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-integ-'+ myComponent +'.yaml') + " stop  "); 
                if( !decision.code ){  

                } else {
                  LOG()
                  LOG( chalk.red('  -- Please run the following command first to start | stop | restart --'))
                  LOG( chalk.blue('     $ lbmesh integ pull ' + myComponent))
                  LOG();                  
                }

            } else {
              LOG()
              LOG(' Please supply a correct integration service name.');
              LOG(' Options are: ' + myServicesList)
              LOG()  
            }
        break;
        case 'recreate':
          if( myServices.includes(myComponent) ){
            LOG();
            LOG('   -- REMOVING old integration container for ' + myComponent);
            shelljs.exec("docker rm lbmesh-integ-" + myComponent);
            LOG();
            LOG('   -- Rebuilding new integration container for ' + myComponent);
            LOG();
            shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-integ-'+ myComponent +'.yaml') + " up --no-start --force-recreate "); 
          } else {
            LOG()
            LOG(' Please supply a correct integration service name.');
            LOG(' Options are: ' + myServicesList)
            LOG()  
          }
          LOG();
        break;
        case 'pull':
          if( myServices.includes(myComponent) ){
 
              let spinner = new Ora({
                "text": 'Processing request to ' + myAction + ' ' + myComponent.toUpperCase() +' integration container service...',
                "indent": 2
              }); 
              spinner.start();
              LOG();

              let decision = shelljs.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io', myComponent, 'lbmesh-integ-'+ myComponent +'.yaml') + " up --no-start  ",{"silent":true}); 
              if( !decision.code ){
                spinner.succeed('  -- Successfully created ' + myComponent + ' INTEG Container Service ')
                LOG();
                LOG( chalk.red('  -- Please run the following command first to start the service --'))
                LOG( chalk.blue('     $ lbmesh integ start ' + myComponent))
                LOG();
                LOG();
              } else {

              }
         
          } else {
            LOG()
            LOG(' Please supply a correct integration service name.');
            LOG(' Options are: ' + myServicesList)
            LOG()  
          }
          LOG();
        break;
        case 'status':
          LOG();
          shelljs.exec("docker ps --filter name=lbmesh-integ*");
          LOG();
        break;
        case 'open':
            if( myServices.includes(myComponent) ){
                let myAdmin = new INTEG();
                let myAdminPorts  = myAdmin.retrievePorts();

                switch(myComponent){
                  case 'mqlight':
                  LOG();
                  LOG('   OPENING MQLIGHT DASHBOARD http://localhost:' +  myAdminPorts.sourceData.mqlight.port.admin + '/#page=home' );
                  LOG('   OPENING MQLIGHT DATA PORT: ' +  myAdminPorts.sourceData.mqlight.port.data );                  
                  LOG();
                   
                  if( !isWindows ){
                    shelljs.exec("sleep 5s");
                  }
                  shelljs.exec("open http://localhost:" +  myAdminPorts.sourceData.mqlight.port.admin + "/#page=home" );                  
                break;
                case 'ace':
                  LOG();
                  LOG('   OPENING ACE DASHBOARD http://localhost:' +  myAdminPorts.sourceData.ace.port.admin);
                  LOG();
                  if( !isWindows ){
                    shelljs.exec("sleep 5s");
                  }
                  shelljs.exec("open http://localhost:" +  myAdminPorts.sourceData.iib.port.admin);   
                break;
                case 'iib':
                  LOG();
                  LOG('   OPENING IIB DASHBOARD http://localhost:' +  myAdminPorts.sourceData.iib.port.admin);
                  LOG();
                  if( !isWindows ){
                    shelljs.exec("sleep 5s");
                  }
                  shelljs.exec("open http://localhost:" +  myAdminPorts.sourceData.iib.port.admin);   
                break;
                case 'splunk':
                  LOG();
                  LOG('   OPENING SPLUNK DASHBOARD http://localhost:' +  myAdminPorts.sourceData.splunk.port.admin);
                  LOG();
                  if( !isWindows ){
                    shelljs.exec("sleep 5s");
                  }
                  shelljs.exec("open http://localhost:" +  myAdminPorts.sourceData.splunk.port.admin);   
                break;
                case 'datapower':
                  LOG();
                  LOG('   OPENING DATAPOWER DASHBOARD https://localhost:' +  myAdminPorts.sourceData.datapower.port.admin);
                  LOG('           DATAPOWER User/Pass:  admin / admin');
                  LOG();
                  if( !isWindows ){
                    shelljs.exec("sleep 5s");
                  }
                  shelljs.exec("open https://localhost:" +  myAdminPorts.sourceData.datapower.port.admin);   
                break;
                case 'kafka':
                    LOG();
                    LOG('   OPENING KAFKA TOPICS UI http://localhost:' + myAdminPorts.sourceData.kafka.port.topics  + '/');
                    LOG('   OPENING KAFKA SCHEMA REGISTRY UI http://localhost:' + myAdminPorts.sourceData.kafka.port.registry  + '/');
                    LOG('   OPENING KAFKA REST http://localhost:' + myAdminPorts.sourceData.kafka.port.rest  + '/topics');
                    LOG('           KAFKA DATA PORT: ' +  myAdminPorts.sourceData.kafka.port.data );  
                    LOG('           KAFKA ZOOKEEPER PORT: ' +  myAdminPorts.sourceData.kafka.port.zookeeper );                      
                    LOG();
                    if( !isWindows ){
                      shelljs.exec("sleep 5s");
                    }
                    
                    shelljs.exec("open http://localhost:" +  myAdminPorts.sourceData.kafka.port.topics + "/" ); 
                    shelljs.exec("open http://localhost:" +  myAdminPorts.sourceData.kafka.port.registry + "/" ); 
                    shelljs.exec("open http://localhost:" +  myAdminPorts.sourceData.kafka.port.rest + "/topics" );
                break;
                case 'rabbitmq':
                  LOG();
                  LOG('   OPENING RABBITMQ DASHBOARD http://localhost:' +  myAdminPorts.sourceData.rabbitmq.port.admin);
                  LOG('           RABBITMQ User/Pass: ' + myAdminPorts.sourceData.rabbitmq.env.user + ' / ' + myAdminPorts.sourceData.rabbitmq.env.pass );
                  LOG('           RABBITMQ DATA PORT: ' + myAdminPorts.sourceData.rabbitmq.port.data );                  
                  LOG();
                  if( !isWindows ){
                    shelljs.exec("sleep 5s");
                  }
                  shelljs.exec("open http://localhost:" +  myAdminPorts.sourceData.rabbitmq.port.admin);   
                break;
                case 'mq':
                  LOG();
                  LOG('   OPENING MQ ADVANCED DASHBOARD https://localhost:' +  myAdminPorts.sourceData.mq.port.admin + '/ibmmq/console/login.html ');
                  LOG('           MQ ADVANCED DASHBOARD User/Pass:  admin / ' +  myAdminPorts.sourceData.mq.env.admin_pass );
                  //LOG('   OPENING MQ ADVANCED METRICS http://localhost:9157/metrics ');
                  LOG();
                  if( !isWindows ){
                    shelljs.exec("sleep 5s");
                  }
                  shelljs.exec("open https://localhost:" +  myAdminPorts.sourceData.mq.port.admin + "/ibmmq/console/login.html");  
                  //shelljs.exec("open http://localhost:9157/metrics"); 
                break;
                case 'acemq':
                  LOG();
                  LOG('   OPENING ACE MQ DASHBOARD https://localhost:' +  myAdminPorts.sourceData.acemq.port.mq.admin + '/ibmmq/console/login.html ');
                  LOG('           ACE MQ User/Pass:  admin / lbmesh-integ-mq');
                  LOG('   OPENING ACE SERVER DASHBOARD http://localhost:' + +  myAdminPorts.sourceData.acemq.port.ace.admin );
                  LOG('           ACE Dashboard User/Pass:  admin / acemq');
                  //LOG('   OPENING MQ ADVANCED METRICS http://localhost:9157/metrics ');
                  LOG();
                  // shelljs.exec("sleep 5s");
                  // shelljs.exec("open https://localhost:9444/ibmmq/console/login.html");  
                  // shelljs.exec("open http://localhost:7600");  
                  //shelljs.exec("open http://localhost:9157/metrics"); 
                break;
                }     

            } else {
              LOG()
              LOG(' Please supply a correct integration service name.');
              LOG(' Options are: ' + myServicesList)
              LOG()  
            }
        break;
        case 'logs':
            if( myServices.includes(myComponent) ){
              shelljs.exec("docker logs lbmesh-integ-" + myComponent + " -f");
              //  -f " + datastoreFilePath + " down"); 
            } else {
              LOG()
              LOG(' Please supply a correct integration service name.');
              LOG(' Options are: ' + myServicesList)
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

  // program
  // .command('k8')
  // .description('Generate Kubernetes YAML Deployment Files')
  // .action((name)=>{
  //   LOG();
  //   LOG('    - FEATURE not implemented yet');
  //   LOG();
  // });

program
  .command('dash [action]')
  .description('Launch Web UI Dashboard to manage CLI Functionality')
  .action((action)=>{
      let actions = ['init','start','stop','open','start-debug','stop-debug'];
      let myAction = (action == undefined)? 'empty' : action.toLowerCase();

      banner.display();
      banner.dashboard();
      LOG();
      
      if( actions.includes(myAction) ){
          LOG();
          let myGui = new GUI();
          let guiInstalled = myGui.isInstalled();

          switch( guiInstalled ){
            case false:

               switch( myAction ){
                 case 'init':
                  LOG();
 
                  let spinner = new Ora({
                    "text": 'Initializing  LB Mesh Dashboard.  Please Wait ....',
                    "spinner": 'line'
                  });
                         
                    spinner.start();
                 
                     shelljs.cd( path.join(machine.homedir,".lbmesh.io","dashboard","frontend","www") );
                     shelljs.exec('npm install',{silent: true});
                    
                      myGui.updateStatus();

                    LOG();
                    LOG();
 
                    spinner.succeed('LB Mesh Dashboard Install Complete.  Start the dashboard with command below');

                    LOG();
                    LOG( chalk.blue('     $ lbmesh dash start '))
                    LOG();

                 break;
                 default:
                    LOG()
                    LOG( chalk.red('  -- Before using the LB MESH DASHBOARD, '));
                    LOG( chalk.red('     please run the installer to download dependencies first. '))
                    LOG();
                    LOG( chalk.blue('     $ lbmesh dash init '))
                    LOG();   
                    LOG();
                 break;
               }

            break;
            case true:

                    switch(myAction){
                      case 'start':
                      case 'stop':
                       // shelljs.exec("pm2 " + myAction +" " + path.join(machine.node.globalPath,"lbmesh-cli","gui","pm2-ecosystem.config.yaml"));
                        shelljs.exec("pm2 " + myAction +" " + path.join(machine.homedir,".lbmesh.io","dashboard","pm2-ecosystem.config.yaml"),{silent: true});
                        LOG();
                        LOG();
                        if( myAction == "start" ){
                          LOG('   STARTING LB MESH DASHBOARD WWW ... PLEASE WAIT' )
                          LOG();
                          // LOG('   OPENING LB MESH DASHBOARD WWW http://localhost:9976' )
                          // shelljs.exec("open http://localhost:9976");
                        } else {
                          LOG('   STOPPING LB MESH DASHBOARD WWW ... PLEASE WAIT' )
                        }
                        LOG();
                        LOG();
                      break;
                      case 'start-debug':
                      case 'stop-debug':
                        //shelljs.exec("pm2 " + myAction +" " + path.join(machine.node.globalPath,".lbmesh.io","dashboard","pm2-gui-debug.config.yaml"));
                        LOG();
                      break;
                      case 'open':
                        LOG();
                        LOG('   OPENING LB MESH DASHBOARD WWW http://localhost:9976' )
                        shelljs.exec("open http://localhost:9976");
                        LOG();
                      break;
                    }
                 
           break;    
        }// end if switch
         
      } else {
        LOG();
        LOG('  ----  ACTIONS NOT ALLOWED ----')
        LOG();
      }
       
  });

program
  .command("help [cmd]")
  .description("Get Detailed Usage Help for Command")
  .action((cmd)=> {
    let myCommand = (cmd == undefined)? 'empty' : cmd.toLowerCase();

    banner.browser();
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
  banner.display();
  program.help();
};

// if( !availableCommands.includes(program.args[0]) ){
//   program.help();
// }