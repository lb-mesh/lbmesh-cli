'use strict';
const machine = require('lbmesh-os').profile();
const debug   = require('debug')('app:classes:integ');
const approvedInteg = ['mq','datapower','mqlight','rabbitmq','acemq','iib','splunk','kafka'];
const path    = require('path');
const globalFile =  require( path.join(machine.node.globalPath,'lbmesh-cli','gui','frontend','www','server','classes','globalfile.js') );
const system = require( path.join(machine.node.globalPath,'lbmesh-cli','gui','frontend','www','server','classes','files.js') );


module.exports = function(Integ) {

    Integ.services = approvedInteg;

    
    Integ.getList = function(cb){
        let ourData = globalFile.getData();
        console.log( ourData);
        cb(null,ourData.dbStack);
    };

    Integ.remoteMethod('getList', {
   
        returns: {arg: 'status', type: 'object', root: true },
        http: {path: "/", verb: "get"},            
    });

    Integ.getCompose = function(name,cb){
         
        cb(null,system.readComposeFileINTEG(name));
    };

    Integ.remoteMethod('getCompose', {
        accepts: {arg: 'component', type: 'string', http: { source: 'path'}},
        returns: {arg: 'status', type: 'string', root: true },
        http: {path: "/compose/:component", verb: "get"},            
    });

};
