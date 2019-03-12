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
const files = require('../lib/files');

class Base {
    constructor(){
        this.machine = files.readGlobalFile();        
    }

    getProjectType(label){
        let newLabel;
        switch(label){
            case 'frontend-backend':    newLabel = "Full Stack (Frontend + Backend)";   break;
            case 'backend-messenger':   newLabel = "Backend Messenger";                 break;
            case 'backend-databank':    newLabel = "Backend Databank";                  break;
            case 'backend-scheduler':   newLabel = "Backend Scheduler";                 break;
            case 'frontend-api':        newLabel = "Frontend API";                      break;
            case 'frontend-www':        newLabel = "Frontend WWW";                      break;
            case 'frontend-admin':      newLabel = "Frontend ADMIN";                    break;
        }
        return newLabel;
    }

    readProjectConfig(projFolder){
        return files.readProjectFile(projFolder);
    }

    writeGlobalConfig(){
        files.writeGlobalFile(this.machine);
    };
}

module.exports = Base;