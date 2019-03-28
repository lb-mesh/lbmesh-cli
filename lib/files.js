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

const CryptoJS          = require('crypto-js');
const defaultKey        = "LBMesh.IO";
const debug             = require('debug')("app:cli:files");
const machine           = require('lbmesh-os').profile();
const path              = require('path');
const read              = require('read-file');
const writeFile         = require('write');

module.exports = {
    getProjectObject: () => {
        let myProject = {
            "name": "",
            "path": "",
            "apps": {
                "www": {"port":0},
                "admin": {"port":0},
                "api": {"port":0},
                "scheduler": {"port":0},
                "messenger": {"port":0},
                "databank": {"port":0}
            }
        };
        return myProject;
    },
    readGlobalFile: () => {
        let fileString = read.sync( path.join(machine.homedir,".lbmesh.io","global-config"), 'utf8');
        debug( fileString );
        let bytes = CryptoJS.AES.decrypt(fileString, defaultKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    },
    writeGlobalFile: (dataObject) => {
        let plaintext =  CryptoJS.AES.encrypt(JSON.stringify(dataObject,null,2), defaultKey);
        writeFile.sync( path.join(machine.homedir,".lbmesh.io","global-config"), plaintext.toString() );
    },
    encryptGlobalObject: (dataObject) => {
        debug("Entering encryptGlobalObject() ");
        debug(dataObject);
        debug(defaultKey)
        let plaintext =  CryptoJS.AES.encrypt(JSON.stringify(dataObject,null,2), defaultKey);
        debug("Data Encrypted");
        debug(plaintext);
        return plaintext.toString();
    },
    decryptGlobalObject: (dataString) => {
        debug("Entering decryptGlobalObject ");
        debug(dataString);
        let bytes = CryptoJS.AES.decrypt(dataString, defaultKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    },
    readProjectFile: (folderpath) => {
        let projObject;
        let fileString = read.sync( path.join(folderpath, "lbmesh-config.json"), 'utf8');
        return JSON.parse(fileString);  
    }
};