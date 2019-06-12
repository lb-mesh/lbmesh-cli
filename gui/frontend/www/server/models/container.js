'use strict';
const Docker = require('dockerode');
const sh      = require('shelljs');
const dockerengine = new Docker();


let allServices = [];
let servicesInteg = [];
let servicesDB = [];
let dbServicesExist = [];
let integServicesExist = [];

module.exports = function(Container) {

    Container.startService = (cid, cb) => {
        dockerengine.getContainer(cid).start( (err, data) => {
             
            cb(err,data);
        });
    };

    Container.stopService = (cid, cb) => {
        dockerengine.getContainer(cid).stop( (err, data) => {
            cb(err,data);
        });
    };

    Container.removeService = (cid, cb) => {
        dockerengine.getContainer(cid).remove( (err, data) => {
            cb(err,data);
        });
    };

    Container.getLogs = (cid, cb) => {
        // dockerengine.getContainer('09f62c22e2eeb71dc036339b79523781f9e550cb077d108c5386c920e15ab1a2').logs( (err, data) => {
        //     cb(err,data);
        // });
    };

    Container.getOutput = (category, service, cb) => {
        let cmdline = sh.exec("docker logs lbmesh-" + category + "-" + service ,{"silent":true} );
        if( cmdline.code > 0 ){
            cb(null, cmdline.stderr); 
 
        } else {
            cb(null, cmdline.stdout);
 
        }  
    };

    Container.removeImage = (service, image, cb) => {
        let cmdline = sh.exec("docker rmi " + image + " --force",{"silent":true} );
        if( cmdline.code > 0 ){
            cb(null, {
                "result": "error",
                "service": service,
                 
                "message": cmdline.stderr
            });
        } else {
            cb(null, {
                "result": "success",
                "service": service,
                 
                "message": cmdline.stdout
            });
        }        
    };

    Container.pullService = (category, service, cb) => {
        let cmdline = sh.exec("lbmesh " + category + " pull " + service + " hide",{"silent":true} );
        if( cmdline.code > 0 ){
           // console.log( cmdline.stderr );
            cb(null, {
                "result": "error",
                "service": service,
                "category": category,
                "message": cmdline.stderr
            });
        } else {
            //console.log( cmdline.stdout );
            cb(null, {
                "result": "success",
                "service": service,
                "category": category,
                "message": cmdline.stdout
            });
        }

    };

    Container.getList = (cb) => {

        servicesInteg = [];
        servicesDB = [];
        dbServicesExist = [];
        integServicesExist = [];

        dockerengine.listContainers({all: true}, function(err, containers) {

            containers.forEach(function(item){
                if( item.Labels['com.docker.compose.project'] ){

                    allServices.push( item );
                    
                    if( Container.app.models.database.services.includes(item.Labels['com.docker.compose.project']) && Container.app.models.database.services.includes(item.Labels['com.docker.compose.service']) ){
                        servicesDB.push({
                            id: item.Id,
                            service: item.Labels['com.docker.compose.project'],
                            name: "lbmesh-db-" + item.Labels['com.docker.compose.project'],
                            state: item.State,
                            status: item.Status   
                        });
                        dbServicesExist.push( item.Labels['com.docker.compose.project'] )
                    }

                    if( Container.app.models.integ.services.includes(item.Labels['com.docker.compose.project']) && Container.app.models.integ.services.includes(item.Labels['com.docker.compose.service'])){
                        servicesInteg.push({
                            id: item.Id,
                            service: item.Labels['com.docker.compose.project'],
                            name: "lbmesh-integ-" + item.Labels['com.docker.compose.project'],
                            state: item.State,
                            status: item.Status   
                        });

                        integServicesExist.push( item.Labels['com.docker.compose.project'] )
                    }
                }

            });

            cb(null,{
                "db": servicesDB,
                "integ": servicesInteg
            });
            //console.log( containers );
            //console.log('ALL: ' + containers.length);
          });
    };

};
