'use strict';
const machine = require('lbmesh-os').profile();
const path    = require('path');
const approvedDB = ['mysql','mongodb','redis','mssql','cloudant','postgres','elasticsearch','cassandra'];
const debug   = require('debug')('app:classes:database');
const globalFile =  require( path.join(machine.node.globalPath,'lbmesh-cli','gui','frontend','www','server','classes','globalfile.js') );
const system = require( path.join(machine.node.globalPath,'lbmesh-cli','gui','frontend','www','server','classes','files.js') );

module.exports = function(Database) {

    Database.services = approvedDB;
 /**
  * @method getList
  */
    Database.getList = function(cb){
        let ourData = globalFile.getData();
 
        cb(null,ourData.dbStack);
    };

    Database.remoteMethod('getList', {
   
        returns: {arg: 'status', type: 'object', root: true },
        http: {path: "/", verb: "get"},            
    });

/**
  * @method getList
  */
 Database.getServices = function(cb){

    Database.app.models.container.getList(function(err,data){
        cb(null,data);
    });
    
};

Database.remoteMethod('getServices', {

    returns: {arg: 'status', type: 'object', root: true },
    http: {path: "/services", verb: "get"},            
});

/**
 * @method getCompose
 */
    Database.getCompose = function(name,cb){
         
        cb(null,system.readComposeFileDB(name));
    };

    Database.remoteMethod('getCompose', {
        accepts: {arg: 'component', type: 'string', http: { source: 'path'}},
        returns: {arg: 'status', type: 'string', root: true },
        http: {path: "/compose/:component", verb: "get"},            
    });

/**
 * @method getComponent
 */
    Database.getComponent = function(component,cb){
        if( approved.includes(component) ){
            let ourData = globalFile.getData();
            cb(null,ourData.dbStack[component]);
        } else {
            cb({
                "statusCode": 404,
                "message":"error"
            },null);
        }
       
 
        
    };

    Database.remoteMethod('getComponent', {
        accepts: {arg: 'component', type: 'string', http: { source: 'path'}},
        returns: {arg: 'status', type: 'object', root: true },
        http: {path: "/:component", verb: "get"},            
    });
};
