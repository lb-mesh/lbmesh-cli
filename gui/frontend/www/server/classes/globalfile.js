'use strict'
const path = require('path');
const debug             = require('debug')("app:classes:globalfile");
const system = require(path.resolve(__dirname,'files'));


let lbmeshData = system.readGlobalFile()

 module.exports = {
    getData(){
        return lbmeshData;
    },
    refreshData() {
        lbmeshData = system.readGlobalFile()
        
    },
    writeData(obj) {
        lbmeshData = obj;
        system.writeGlobalFile(obj);
    },
    getDbYAML(component){
        return system.readComposeFileDB(component);
    },
    getIntegYAML(component){
        return system.readComposeFileINTEG(component);
    }
 };