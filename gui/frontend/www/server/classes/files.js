'use strict'

const machine           = require('lbmesh-os').profile();
const path              = require('path');
const CryptoJS          = require('crypto-js');
const defaultKey        = "LBMesh.IO";
const debug             = require('debug')("app:classes:files");
const fs                = require('fs');
const read              = require('read-file');
const writeFile         = require('write');



module.exports = {
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
    readComposeFileDB: (component) => {
        let fileLocation = path.join(machine.homedir,".lbmesh.io",component,"lbmesh-db-" + component + ".yaml");
        return read.sync( fileLocation, 'utf8');
    },    
    readComposeFileINTEG: (component) => {
        let fileLocation = path.join(machine.homedir,".lbmesh.io",component,"lbmesh-integ-" + component + ".yaml");
        return read.sync( fileLocation, 'utf8');
    },
    encryptGlobalObject: (dataObject) => {
        debug("Entering encryptGlobalObject() ");
            debug(dataObject);
            debug(defaultKey);
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
    },
    importProjectFile: (folderpath) => {
        let projObject;
        let fileString = read.sync( folderpath, 'utf8');
        return JSON.parse(fileString);  
    },
};

