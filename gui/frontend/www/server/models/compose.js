'use strict';

const dc = require('docker-compose');
const machine = require('lbmesh-os').profile();
const sh      = require('shelljs');
const path    = require('path');


module.exports = function(Compose) {

    Compose.startService = (service, cb) => {
 
        let cmdline = sh.exec("docker-compose -f " + path.join(machine.homedir,'.lbmesh.io',service,'lbmesh-db-' + service + '.yaml') + " start",{"silent":true} );
        if( cmdline.code > 0 ){
            cb(null, cmdline.stderr); 
 
        } else {
            cb(null, cmdline.stdout);
 
        } 
    };

    Compose.stopService = (service, cb) => {
        dc.stop({ cwd: path.join(machine.homedir,'.lbmesh.io',service), config: 'lbmesh-db-' + service + '.yaml', log: true })
        .then(
          () => { 
            //console.log('done')
            cb(null,'done') 
          },
          err => { 
              cb( null,err.message)
              //console.log('something went wrong:', err.message)
          }
        );
 
    };

    Compose.removeService = (cid, cb) => {
        dc.rm({ cwd: path.join(machine.homedir,'.lbmesh.io',service), config: 'lbmesh-db-' + service + '.yaml', log: true  })
        .then(
          () => { cb(null,'done')},
          err => {  cb( null,err.message)}
        );
 
    };

};
