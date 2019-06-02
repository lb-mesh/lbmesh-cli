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
const path      = require('path');
const machine = require('lbmesh-os').profile();
const Base      = require(path.join(machine.node.globalPath,'lbmesh-cli','classes','base') );
const chalk     = require('chalk');
const debug     = require('debug')('app:cli:projects');
const LOG       = console.log;
const table     = require('markdown-table');
const _         = require('underscore');


class Projects extends Base{
    constructor(){
        super();
    }

    
    viewProjectList(){
       let myList = [];
           myList.push(['Project Name', 'Project Type']);

       _.each(this.machine.projectApps, (p)=> {
            myList.push([p.name, this.getProjectType(p.type)]);
       });

       let showTable = table(
           myList
       , {
           start: ' |'
       })
        return showTable; 
    }

    getModelTemplate(){
        return {
            "model": {},
            "definition": {}
        }
    }

    viewProjectDetails(projname){
        let selected;
        let myProjDetails = [];
            //,'API','Admin','Scheduler','Messenger','DataBank']);

        let myProjPorts = [];
            myProjPorts.push(['WWW','API','Admin','Scheduler','Messenger','DataBank'])

        _.each( this.machine.projectApps, (p) => {
            if( p.name == projname ){
                selected = p;
            }
        });
        selected["details"] = this.readProjectConfig(selected.folder);

        switch(selected.details.type){
            case 'frontend-backend':
                myProjDetails.push(['Name','Type','Folder']);
                myProjDetails.push([
                    selected.details.name,
                    selected.details.type,
                    selected.details.path
                ]);


                myProjPorts.push([
                    (selected.details.apps.www.port > 0 )? selected.details.apps.www.port : ' ',
                    (selected.details.apps.api.port > 0 )? selected.details.apps.api.port : ' ',
                    (selected.details.apps.admin.port > 0 )? selected.details.apps.admin.port : ' ',
                    (selected.details.apps.scheduler.port > 0 )? selected.details.apps.scheduler.port : ' ',
                    (selected.details.apps.messenger.port > 0 )? selected.details.apps.messenger.port : ' ',
                    (selected.details.apps.databank.port > 0 )? selected.details.apps.databank.port : ' ',
                ]);

            break;
            default:
                myProjDetails.push(['Name','Type','Port','Folder']);
                myProjDetails.push([
                    selected.details.name,
                    selected.details.type,
                    this.activeAppPort(selected.details.type,selected.details.apps),
                    selected.details.path
                ]);
            break;
        }
        
        // Generate Tables for Display
        selected["table_header"] = table(myProjDetails,{ start: '  |'});
        selected["table_ports"]  = table(myProjPorts, {start: '   |'});
        return selected;
    }

    isProject(projname) {
        return this.machine.projectAppsList.includes(projname);
    }

    resetProjectList(){
        this.machine.projectAppsList.length = 0;
        this.machine.projectApps.length = 0;
        this.writeGlobalConfig();
    }

    arrayRemove(arr, value) {

        return arr.filter(function(ele){
            return ele != value;
        });
     
    }

    doesProjectExist(name){
        return this.machine.projectAppsList.includes(name.toLowerCase());
    }

    importProjectConfig(folderpath){
        return this.readImportProjectConfig(folderpath);
    }

    importProject(importDetails){

        /**
         * Read Project Folder & Grab Settings
         */
            this.machine.projectAppsList.push( importDetails.name );
            this.machine.projectApps.push({
                name:   importDetails.name,
                folder: importDetails.path,
                type:   importDetails.type
            });
            this.machine.portStackExclude.push( parseInt( (importDetails.apps.www.port - 1) ) );

         /**
          * Check App Settings ( Exit if Exists)
          */
            this.writeGlobalConfig();

        /**
         * Import Port Exclude & ProjectApps / ProjectData
         */
    }

    updateImportProject(projtype){
        switch(type){
            case 'frontend-www':
                myPort = apps.www.port;
            break;
            case 'frontend-admin':
                myPort = apps.admin.port;
            break;
            case 'frontend-api':
                myPort = apps.api.port;
            break;
            case 'backend-scheduler':
                myPort = apps.scheduler.port;
            break;
            case 'backend-messenger':
                myPort = apps.messenger.port;
            break;
            case 'backend-databank':
                myPort = apps.databank.port;
            break;
            case 'frontend-backend':

            break;
        }        
    }

    activeAppPort(type, apps){
        let myPort = 0;
            switch(type){
                case 'frontend-www':
                    myPort = apps.www.port;
                break;
                case 'frontend-admin':
                    myPort = apps.admin.port;
                break;
                case 'frontend-api':
                    myPort = apps.api.port;
                break;
                case 'backend-scheduler':
                    myPort = apps.scheduler.port;
                break;
                case 'backend-messenger':
                    myPort = apps.messenger.port;
                break;
                case 'backend-databank':
                    myPort = apps.databank.port;
                break;
            }
        return myPort;
    }
    
};

module.exports = Projects;