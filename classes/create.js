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

const chalk = require('chalk');
const path  = require('path');
const machine = require('lbmesh-os').profile();
const LOG   = console.log;
const debug = require('debug')('app:class:create');
const ejs   = require('ejs');
const files = require(path.join(machine.node.globalPath,'lbmesh-cli','lib','files'));
const fs    = require('fs');

const sh    = require('shelljs');
const _     = require('underscore');


class Create {
    constructor(){
        this.machine = files.readGlobalFile();
        this.currentProject = {
            "name": "",
            "path": "",
            "type": "",
            "dbname":"",
            "apps": {
                "www": {
                    "port":0,
                    "tag": ""
                },
                "admin": {
                    "port":0,
                    "tag": ""
                },
                "api": {
                    "port":0,
                    "tag": ""
                },
                "scheduler": {
                    "port":0,
                    "tag": ""
                },
                "messenger": {
                    "port":0,
                    "tag": ""
                },
                "databank": {
                    "port":0,
                    "tag": ""
                }
            }
        };
        // debug(this.machine);
    }

    folderExists(folder){
        return fs.existsSync( path.join(this.machine.homedir,this.machine.workspace,folder) );
    }

    scaffoldApp(svc, folder) {
        switch(svc){
            case 'messenger':
            case 'scheduler':
            case 'databank':
                fs.mkdirSync( path.join(folder, 'backend', svc) );
                sh.cp('-r', path.join(this.machine.templatefolder,'backend','app','*') , path.join( folder,'backend',svc) );
                
                ejs.renderFile( path.join(this.machine.templatefolder,'backend','package-' + svc + '.ejs') , {
                    "appname": this.answers.appname,
                    "appservice": svc
                },{}, function(err,str){
                    fs.writeFileSync( path.join( folder,'backend',svc,'package.json') , str);
                });

                ejs.renderFile( path.join(this.machine.templatefolder,'backend','config.ejs') , {
                    "port": this.currentProject.apps[svc].port              
                },{}, function(err,str){
                    fs.writeFileSync( path.join(folder, 'backend', svc,'server','config.json') , str);
                });
                
                /**
                 * Copy in App Specific Files
                 */
                sh.cp('-r', path.join(this.machine.templatefolder,'backend', svc,'*') , path.join(folder,'backend',svc,'server') );
                
                ejs.renderFile( path.join(this.machine.templatefolder,'backend','component-config.development.ejs') , {
                    "appname": this.answers.appname,
                    "appservice": svc            
                },{}, function(err,str){
                    fs.writeFileSync( path.join(folder, 'backend', svc ,'server', 'component-config.development.json'), str);
                });                

                LOG(chalk.blue("     - " + svc.toUpperCase() + " Project Completed."));

                LOG();
                LOG(chalk.blue("  - Running NPM INSTALL for... "));    
                LOG(chalk.blue("     - BACKEND: " + svc.toUpperCase() ));    
                    sh.cd( path.join(folder, 'backend', svc) );
                    sh.exec('npm install');

            break;
            case 'admin':
                sh.cp('-r', path.join(this.machine.templatefolder,'frontend','admin','app') , path.join(folder,'frontend',svc) );

                
                ejs.renderFile( path.join(this.machine.templatefolder,'frontend','admin','config.ejs'), {
                    "port_admin": this.currentProject.apps[svc].port              
                },{}, function(err,str){
                    fs.writeFileSync( path.join(folder,'frontend',svc,'server','config.json'), str);
                });

                ejs.renderFile( path.join(this.machine.templatefolder,'frontend','admin','package.ejs'), {
                    "appname": this.answers.appname,
                    "appservice": svc
                },{}, function(err,str){
                    fs.writeFileSync( path.join(folder ,'frontend', svc ,'package.json'), str);
                });

                LOG();
                LOG(chalk.blue("  - Running NPM INSTALL for... "));    
                LOG(chalk.blue("     - FRONTEND: " + svc.toUpperCase() ));    
                    sh.cd( path.join(folder,'frontend',svc) );
                    sh.exec('npm install');

            break;
            case 'www':
                sh.cp('-r', path.join(this.machine.templatefolder,'frontend','www','app') , path.join(folder,'frontend', svc) );
 
                ejs.renderFile( path.join(this.machine.templatefolder,'frontend','www','config.ejs') , {
                    "port_www": this.currentProject.apps[svc].port              
                },{}, function(err,str){
                    fs.writeFileSync( path.join(folder,'frontend',svc,'server','config.json') , str);
                });   
                
                ejs.renderFile( path.join(this.machine.templatefolder,'frontend','www','package.ejs'), {
                    "appname": this.answers.appname,
                    "appservice": svc
                },{}, function(err,str){
                    fs.writeFileSync( path.join(folder,'frontend',svc,'package.json') , str);
                });

                LOG();
                LOG(chalk.blue("  - Running NPM INSTALL for... "));    
                LOG(chalk.blue("     - FRONTEND: " + svc.toUpperCase() ));    
                    sh.cd( path.join(folder,'frontend', svc ) );
                    sh.exec('npm install');
            break;
            case 'api':
                sh.cp('-r', path.join(this.machine.templatefolder, 'frontend','api','app'), path.join(folder,'frontend',svc) );

                ejs.renderFile( path.join(this.machine.templatefolder,'frontend','api','config.ejs'), {
                    "port_api": this.currentProject.apps[svc].port              
                },{}, function(err,str){
                    fs.writeFileSync( path.join(folder,'frontend',svc, 'server','config.json') , str);
                });

                ejs.renderFile( path.join(this.machine.templatefolder,'frontend','api','component-config.development.ejs') , {
                    "appname": this.answers.appname,
                    "appservice": svc            
                },{}, function(err,str){
                    fs.writeFileSync( path.join(folder,'frontend',svc,'server','component-config.development.json'), str);
                });  

                ejs.renderFile( path.join(this.machine.templatefolder,'frontend','api','package.ejs') , {
                    "appname": this.answers.appname,
                    "appservice": svc
                },{}, function(err,str){
                    fs.writeFileSync( path.join(folder,'frontend', svc,'package.json') , str);
                });

                LOG();
                LOG(chalk.blue("  - Running NPM INSTALL for... "));    
                LOG(chalk.blue("     - FRONTEND: " + svc.toUpperCase() ));    
                    sh.cd( path.join(folder,'frontend',svc) );
                    sh.exec('npm install');
            break;
        }
    }

    generateProjectApps() {
        let proj = this.currentProject;
        
        switch(proj.type){
            case 'frontend-api':
                this.scaffoldApp('api', proj.path);
                break;
            case 'frontend-admin':
                this.scaffoldApp('admin', proj.path);
                break;
            case 'frontend-www':
                this.scaffoldApp('www', proj.path);
                break;
            case 'backend-messenger':
                this.scaffoldApp('messenger', proj.path);
                break;
            case 'backend-databank':
                this.scaffoldApp('databank', proj.path);
                break;
            case 'backend-scheduler':
                this.scaffoldApp('scheduler', proj.path);
                break;
            default:
                this.scaffoldApp('api', proj.path);
                this.scaffoldApp('admin', proj.path);
                this.scaffoldApp('www', proj.path);
                this.scaffoldApp('messenger', proj.path);
                this.scaffoldApp('databank', proj.path);
                this.scaffoldApp('scheduler', proj.path);
                break;
        }
    }

    generateProjectSettings() {
        let projFolder = this.machine.targetfolder;
        let projType = this.answers.projtype;
        LOG(chalk.blue("  - Creating Project Folder Files... "));
        debug('generateProjectSettings()')
        debug(this.machine);
        /**
         * Build App Folders
         */
        switch(projType){
            case 'frontend-api':
            case 'frontend-admin':
            case 'frontend-www':
                fs.mkdirSync(path.join(projFolder,'frontend') ); 
                fs.mkdirSync( path.join(projFolder,'database') );
                
                sh.cp('-r', path.join(this.machine.templatefolder,'README.md') , path.join(projFolder) );
                sh.cp('-r', path.join(this.machine.templatefolder,'db','mongo') , path.join(projFolder,'database','lbmesh-mongo-schema') );            
            break;
            case 'backend-messenger':
            case 'backend-scheduler':
            case 'backend-databank':
                fs.mkdirSync( path.join(projFolder,'backend') ); 
            break;
            default:
                fs.mkdirSync( path.join(projFolder,'backend') );
                fs.mkdirSync( path.join(projFolder, 'frontend') );    
                fs.mkdirSync( path.join(projFolder, 'database') );
                
                sh.cp('-r', path.join(this.machine.templatefolder,'README.md') , path.join(projFolder) );
                sh.cp('-r', path.join(this.machine.templatefolder,'db','mongo') , path.join(projFolder,'database','lbmesh-mongo-schema') );
            break;
        }
        
        fs.mkdirSync( path.join(projFolder, 'general') );

        fs.writeFileSync( path.join(projFolder, 'lbmesh-config.json') ,JSON.stringify(this.currentProject,null,2));
        
        ejs.renderFile( path.join(this.machine.templatefolder,'docker','docker-' + projType + '.ejs') , {
            "appname": this.answers.appname.toLowerCase(),
            "apptype": this.answers.projtype,
            "port_www": this.currentProject.apps.www.port,
            "port_api": this.currentProject.apps.api.port,
            "port_admin": this.currentProject.apps.admin.port,
            "port_scheduler": this.currentProject.apps.scheduler.port,
            "port_messenger": this.currentProject.apps.messenger.port,
            "port_databank": this.currentProject.apps.databank.port   
        },{}, function(err,str){
            fs.writeFileSync( path.join(projFolder, 'docker-compose.yaml') , str);
        });
        
 
        ejs.renderFile( path.join(this.machine.templatefolder,'pm2','pm2-' + projType + '.ejs') , {
            "appname": this.answers.appname.toLowerCase(),
            "apptype": this.answers.projtype,
            "port_www": this.currentProject.apps.www.port,
            "port_api": this.currentProject.apps.api.port,
            "port_admin": this.currentProject.apps.admin.port,
            "port_scheduler": this.currentProject.apps.scheduler.port,
            "port_messenger": this.currentProject.apps.messenger.port,
            "port_databank": this.currentProject.apps.databank.port         
        },{}, function(err,str){
            if(err){ debug("=== error pm2 file generation"); debug(err); }
            fs.writeFileSync( path.join( projFolder,'pm2-ecosystem.config.yaml') , str);
        });


    }

    generateProjectUpdates() {
        /**
         * Close Out Global Config
         */
        // TODO: MAKE THIS A WHILE LOOP
        if (this.answers.projtype=='frontend-backend'){
            this.machine.portStackCount = (this.machine.portStackExclude.includes(this.machine.portStackCount + 10))? this.machine.portStackCount + 20 : this.machine.portStackCount + 10;
        } else {
            this.machine.portAppCount =  (this.machine.portAppExclude.includes(this.machine.portAppCount + 2))? this.machine.portAppCount + 4 : this.machine.portAppCount + 2;
            //(this.machine.portAppCount + 2);
           
        }
        this.machine.projectAppsList.push( this.answers.appname );
        this.machine.projectApps.push({"name":this.answers.appname,"folder":this.currentProject.path,"type":this.answers.projtype});
        files.writeGlobalFile(this.machine);

        /**
         * Message Complete
         */
        LOG();
        LOG("%s PROJECT COMPLETED", this.answers.appname);
        LOG();
    }

    generateProjectFiles(){
        let projFolder = this.machine.targetfolder;
        let template;
        let backServices = ['scheduler', 'messenger', 'databank'];
        let backServicesTemplate = {
            
        };

        let frontServices = ['www','admin','api'];

        // LOG(chalk.blue("  - Creating Project Folder Files... "));

        // fs.writeFileSync(projFolder + '/lbmesh-config.json',JSON.stringify(this.currentProject,null,2));
        // ejs.renderFile(this.machine.templatefolder + '/docker-compose.ejs', {
        //     "appname": this.answers.appname.toLowerCase(),
        //     "apptype": this.answers.projtype,
        //     "port_www": this.currentProject.apps.www.port,
        //     "port_api": this.currentProject.apps.api.port,
        //     "port_admin": this.currentProject.apps.admin.port,
        //     "port_scheduler": this.currentProject.apps.scheduler.port,
        //     "port_messenger": this.currentProject.apps.messenger.port,
        //     "port_databank": this.currentProject.apps.databank.port   
        // },{}, function(err,str){
        //     fs.writeFileSync(projFolder + '/docker-compose.yaml', str);
        // });
        
        // ejs.renderFile(this.machine.templatefolder + '/pm2-ecosystem.config.ejs', {
        //     "appname": this.answers.appname.toLowerCase() ,
        //     "apptype": this.answers.projtype,
        //     "port_www": this.currentProject.apps.www.port,
        //     "port_api": this.currentProject.apps.api.port,
        //     "port_admin": this.currentProject.apps.admin.port,
        //     "port_scheduler": this.currentProject.apps.scheduler.port,
        //     "port_messenger": this.currentProject.apps.messenger.port,
        //     "port_databank": this.currentProject.apps.databank.port         
        // },{}, function(err,str){
        //     fs.writeFileSync(projFolder + '/pm2-ecosystem.config.yaml', str);
        // });
        

        // /**
        //  * Build App Folders
        //  */
        // fs.mkdirSync(projFolder + '/backend');
        // fs.mkdirSync(projFolder + '/frontend'); 
        // fs.mkdirSync(projFolder + '/database');      

        /**
         * Start on Backend Services...
         */
        LOG();
        LOG(chalk.blue("  - Generating Backend Services... "));
        _.each (backServices, (svc)=> {
            fs.mkdirSync(projFolder + '/backend/' + svc);

            sh.cp('-r', this.machine.templatefolder + '/backend/.d*', projFolder + '/backend/' + svc + '/')
            sh.cp('-r', this.machine.templatefolder + '/backend/.e*', projFolder + '/backend/' + svc + '/')
            sh.cp('-r', this.machine.templatefolder + '/backend/.g*', projFolder + '/backend/' + svc + '/')
            sh.cp('-r', this.machine.templatefolder + '/backend/.y*', projFolder + '/backend/' + svc + '/')
            sh.cp('-r', this.machine.templatefolder + '/backend/Dockerfile*', projFolder + '/backend/' + svc + '/')

            sh.cp('-r', this.machine.templatefolder + '/backend/server', projFolder + '/backend/' + svc + '/');

            ejs.renderFile(this.machine.templatefolder + '/backend/package.ejs', {
                "appname": this.answers.appname,
                "appservice": svc
            },{}, function(err,str){
                fs.writeFileSync(projFolder + '/backend/' + svc + '/package.json', str);
            });

            ejs.renderFile(this.machine.templatefolder + '/backend/package-lock.ejs', {
                "appname": this.answers.appname,
                "appservice": svc                
            },{}, function(err,str){
                fs.writeFileSync(projFolder + '/backend/' + svc + '/package-lock.json', str);
            });

            ejs.renderFile(this.machine.templatefolder + '/backend/config.ejs', {
                "port": this.currentProject.apps[svc].port              
            },{}, function(err,str){
                fs.writeFileSync(projFolder + '/backend/' + svc + '/server/config.json', str);
            });
            
            LOG(chalk.blue("     - " + svc.toUpperCase() + " Project Completed."));
            //sh.exec(projFolder + '/backend/' + svc + '/npm install').output
        });

        LOG();
        LOG(chalk.blue("  - Running NPM INSTALL for... "));    
        LOG(chalk.blue("     - BACKEND: MESSENGER "));    
            sh.cd(projFolder + '/backend/messenger/');
            sh.exec('npm install');
        LOG();
        LOG(chalk.blue("     - BACKEND: DATABANK "));    
            sh.cd(projFolder + '/backend/databank/');
            sh.exec('npm install');
        LOG();
        LOG(chalk.blue("     - BACKEND: SCHEDULER "));    
            sh.cd(projFolder + '/backend/databank/');
            sh.exec('npm install');

        LOG();
        LOG(chalk.blue("  - Generating Frontend Services... "));
        _.each (frontServices, (svc)=> {
            fs.mkdirSync(projFolder + '/frontend/' + svc);
        }); 

        /**
         * Build the Frontend API
         */

         /**
          * Build the Front End Admin
          */

        /**
         * Build The Front End WWW
         */


        LOG();
        LOG(chalk.blue("  - Running NPM INSTALL for... "));    
        LOG(chalk.blue("     - FRONTEND: API "));    
            sh.cd(projFolder + '/frontend/api');
            sh.exec('npm install');
        LOG();
        LOG(chalk.blue("     - FRONTEND: WWW "));    
            sh.cd(projFolder + '/frontend/www');
            sh.exec('npm install');
        LOG();
        LOG(chalk.blue("     - FRONTEND: ADMIN "));    
            sh.cd(projFolder + '/frontend/admin');
            sh.exec('npm install');    
        LOG();
        LOG();
        


    }

    projectFolder(answers){
        this.answers = answers;
         

        debug( "--- Machine State -----");
        debug( this.machine );
        debug( "--- Create Ansers -----");
        debug( this.answers );
        debug( "--- New Project State -----");
        debug( this.currentProject);


        /**
         * Setting Project State
         */
        this.currentProject.name = this.answers.appname;
        this.currentProject.type = this.answers.projtype;
        let starterPort = (this.answers.projtype == 'frontend-backend')? this.machine.portStackCount : this.machine.portAppCount;
        if( starterPort == 4990){
            starterPort = 4000;
        } else if (starterPort== 3950) {
            starterPort = 3500;
        }

        /**
         * Sett Project Port Numbers
         */
        switch(this.answers.projtype) {
            case 'frontend-backend':
                //starterPort = this.machine.portStackCount;
                this.currentProject.apps.www.port = (starterPort + 1);
                this.currentProject.apps.api.port = (starterPort + 2);
                this.currentProject.apps.admin.port = (starterPort + 3);
                this.currentProject.apps.scheduler.port = (starterPort + 6);
                this.currentProject.apps.messenger.port = (starterPort + 7);
                this.currentProject.apps.databank.port = (starterPort + 8);
            break;
            case 'frontend-www':
                this.currentProject.apps.www.port = (starterPort + 2);
            break;
            case 'frontend-admin':
                this.currentProject.apps.admin.port = (starterPort + 2);
            break;
            case 'frontend-api':
                this.currentProject.apps.api.port = (starterPort + 2);
            break;
            case 'backend-messenger':
                this.currentProject.apps.messenger.port = (starterPort + 2);
            break;
            case 'backend-databank':
                this.currentProject.apps.databank.port = (starterPort + 2);
            break;
            case 'backend-scheduler':
                this.currentProject.apps.scheduler.port = (starterPort + 2);
            break;
        };

        /**
         * Try to Generate Folder
         */
        if( !this.folderExists(this.answers.foldername) ){
            this.machine.targetfolder =  path.join(this.machine.workspace, this.answers.foldername);
            this.currentProject.path = this.machine.targetfolder;

            fs.mkdirSync(this.machine.targetfolder);

            this.generateProjectSettings();
            this.generateProjectApps();
            this.generateProjectUpdates();

        } else {
            LOG();
            LOG(chalk.red("  FOLDER ALREADY EXISTS WITH THAT NAME, PLEASE TRY AGAIN!"));
            LOG();
        }
    }
};

module.exports = Create;