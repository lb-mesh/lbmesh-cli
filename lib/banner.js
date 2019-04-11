#!/usr/bin/env node
/*
 Copyright (c) Innovative Thinkrs LLC 2019. All Rights Reserved.
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
'use strict';

const chalk = require('chalk');
const figlet = require('figlet');
const LOG = console.log;
const table     = require('markdown-table');


exports.display = () => {
 
    LOG(figlet.textSync('        LB Mesh  ', {
        font: 'Standard',
    }));

};

exports.interactive = () => {
 
    LOG(figlet.textSync(' INTERACTIVE', {
        font: 'Standard',
    }));

};

exports.create = () => {
 
    LOG(figlet.textSync('       CREATE   ', {
        font: 'Standard',
    }));

};

exports.projects = () => {
 
    LOG(figlet.textSync('     PROJECTS   ', {
        font: 'Standard',
    }));

};

exports.runhelp = (section) => {
    let myList = [];
    


    switch(section){
        case 'run':
            myList.push(['COMMAND', 'ARGUMENT','NOTES']);
            myList.push(['lbmesh run','start','This command will run \'pm2 start pm2.ecosystem.config.yaml\' ']);
            myList.push(['lbmesh run','stop','This command will run \'pm2 stop pm2.ecosystem.config.yaml\' ']);
            myList.push(['lbmesh run','restart','This command will run \'pm2 restart pm2.ecosystem.config.yaml\' ']);
            myList.push(['lbmesh run','status','This command will run \'pm2 list\' ']);


            let showTable = table(
                myList
            , {
                start: '   |'
            });
        
            LOG();
            LOG(showTable);

            myList = [];
            myList.push(['COMMAND', 'ARGUMENT','NOTES']);
            myList.push(['lbmesh run','docker','This command will run \'docker ps\' and \'docker images\' ']);
            myList.push(['lbmesh run','docker up','This command will run \'docker-compose up\' ']);
            myList.push(['lbmesh run','docker down','This command will run \'docker-compose down\' ']);
            showTable = table(
                myList
            , {
                start: '   |'
            });
        
            LOG();
            LOG('   These additional commands will work as well but are Experimental');
            LOG();
            LOG(showTable);
            LOG();

        break;

    }
    LOG();
};

exports.runtime = () => {
 
    LOG(figlet.textSync('      RUNTIME   ', {
        font: 'Standard',
    }));

};

exports.databases = () => {
 
    LOG(figlet.textSync('    DATASTORE   ', {
        font: 'Standard',
    }));

};

exports.integrations = () => {
 
    LOG(figlet.textSync('  INTEGRATE   ', {
        font: 'Standard',
    }));

};

exports.browser = () => {
 
    LOG(figlet.textSync('    BROWSER   ', {
        font: 'Standard',
    }));

};

exports.build = () => {
 
    LOG(figlet.textSync('          BUILD   ', {
        font: 'Standard',
    }));

};

exports.help = (section) => {
 
    switch(section){
        case 'run':
            LOG(figlet.textSync('     RUN  HELP   ', {
                font: 'Standard',
            }));
        break;
        case 'build':
            LOG(figlet.textSync('  BUILD  HELP   ', {
                font: 'Standard',
            }));
        break;
        case 'projects':
        LOG(figlet.textSync(' PROJECTS  HELP   ', {
            font: 'Standard',
        }));
        break;
        case 'open':
        LOG(figlet.textSync(' OPEN   HELP   ', {
            font: 'Standard',
        }));
        break;
       default:
        LOG(figlet.textSync('   HELP INFO   ', {
            font: 'Standard',
        }));      
       break;
    }


};

 