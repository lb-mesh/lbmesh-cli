#!/usr/bin/env node
/*
 Copyright (c) Innovative Thinkrs LLC 2019. All Rights Reserved.
 This project is licensed under the MIT License, full text below.

Author: Jamil Spain  <jamilhassanspain@gmail.com> http://www.jamilspain.com

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
const machine       = require('lbmesh-os').profile();
const path          = require('path');
const chalk         = require('chalk');
const debug         = require('debug')('app:cli:postinstall');
const system        = require( path.join(machine.node.globalPath,"lbmesh-cli","lib","files" ) );
const fs            = require('fs');
const LOG           = console.log;

 
const sh            = require('shelljs');
const writeFile     = require('write');


LOG();
LOG( chalk.blue("STARTING POST INSTALLATION TASKS: ") );
LOG();

/**
 * Set Object for Install
 */
let objectData = machine;
objectData["workspace"] = path.join(objectData.homedir,'workspace-lbmesh');  
objectData["templatefolder"] = path.join(objectData.node.globalPath, 'lbmesh-cli','lib','template');
objectData["workspaceConfig"] = path.join(objectData.homedir, ".lbmesh.io","global-config");
objectData["projectApps"] = [];
objectData["projectAppsList"] = [];
objectData["projectData"] = {};
objectData["gui"] = {
  "installed": false
};
objectData["dbStack"] = {
  "mongodb": {
      "image": "mongo:3.6.1",
      "env": {
        "passwd": "", 
        "user":"" 
      },
      "admin": {
        "port": 8100,
        "image": "lbmesh/db-mongodb-web-admin:latest",
        "passwd": "",
        "user":"" 
      },
      "port": 27017
  },
  "mysql": {
    "image": "mysql:5.7",
    "env": {
      "passwd": "lbmesh-db-mysql",
      "user":"" 
    },
    "admin": {
      "image": "lbmesh/db-mysql-phpmyadmin:latest",
      "port": 8120,
      "passwd": "",
      "user":"" 
    },
    "port": 3306
  },
  "cloudant": {
    "image": "ibmcom/cloudant-developer:latest",
    "env": {
      "user": "admin",
      "passwd": "pass",  
    },
    "admin": {
      "port": 8880,
      "image":"",
      "passwd": "",
      "user":"" 
    },
    "port": 8880
  },
  "redis": {
    "image": "redis:latest",
    "env": {
      "passwd": "",
      "user":"" 
      
    },
    "admin": {
      "port": 8140,
      "image": "lbmesh/db-redis-web-admin:latest",
      "passwd": "",
      "user":"" 
    },
    "port": 6379         
  },
  "cassandra": {
    "image": "cassandra:3.11.2",
    "env": {
      "passwd": "",
      "user":"" 
      
    },
    "admin": {
      "port": 8130,
      "image": "lbmesh/db-cassandra-web-admin:latest",
      "passwd": "",
      "user":"" 
    }, 
    "port": 9042         
  },
  "elasticsearch": {
    "image": "lbmesh/elasticsearch:7.1.1",
    "env": {
      "passwd": "",
      "user":"" 
      
    },
    "admin": {
      "port": 8160,
      "image":"lbmesh/kibana:7.1.1",
      "passwd": "",
      "user":"" 
    },
    "port": 9200         
  },
  "postgres": {
    "image": "postgres:latest",
    "env": {
      "passwd": "lbmesh-db-postgres",
      "user": "",
      "email_passwd":"lbmesh"
    },
    "admin": {
      "port": 8150,
      "image":"lbmesh/db-postgres-web-admin:latest",
      "passwd": "lbmesh",
      "user":"pgadmin@lbmesh.io" 
    },
    "port": 5432         
  },
  "mssql": {
    "image": "mcr.microsoft.com/mssql/server:2017-latest-ubuntu",
    "env": {
      "passwd": "lbmesh-DB@mssql",
      "user":""
    },
    "admin": 0,
    "port": 1433      
  }
};
objectData["integStack"] = {
  "mqlight": {
    "image":"ibmcom/mqlight:1.0",
    "env": {},
    "port": {
      "admin": 9180,
      "data": 5672
    }  
  }, 
  "mq": {
    "image":"ibmcom/mq:latest",
    "env": {
      "admin_pass": "lbmesh-integ-mq",
      "app_pass" : "lbmesh-mq-app",
    },
    "port": {
      "admin": 9443,
      "metrics": 9157,
      "data": 1416
    }
  },
  "acemq": {
    "image":"ibmcom/ace-mq:latest",
    "env": {
      "ace": {

      },
      "mq": {
        "env": {
          "admin_pass": "lbmesh-integ-mq",
          "app_pass" : "lbmesh-mq-app",
        }        
      }
    },
    "port": {
      "ace": {
        "admin":7600,
        "data": 7800,
        "passwd": "",
      },
      "mq": {
        "admin":9444,
        "data": 1414
      }     
    }
  },
  "ace": {
    "image":"ibmcom/ace:latest",
    "env": {

    },
    "port": {
      "admin": 7600,
      "data": 7800      
    }
  },
  "iib": {
    "image":"ibmcom/iib:latest",
    "env": {

    },
    "port": {
      "admin": 4414,
      "data": 7800
    }   
  },
  "splunk": {
    "image":"splunk/splunk:latest",
    "env": {
      "user": "admin",
      "pass": "lbmesh-splunk"
    },
    "port": {
      "admin": 8080,
      "data": '8088-8089'
    }   
  },
  "rabbitmq": {
    "image":"rabbitmq:latest",
    "env": {
      "user": "admin",
      "pass": "rabbitmq"
    },
    "port": {
      "admin": 15674,
      "data": 5674
    }   
  },
  "kafka": {
    "image":"lbmesh/kafka:latest",
    "env": {
      "user": "",
      "pass": "",
    },
    "port": {
      "admin": 0,
      "data": 9092,
      "zookeeper":2181,
      "registry": 8300,
      "topics": 8301,
      "rest": 8302
    }   
  },
  "datapower":{
    "image":"ibmcom/datapower:latest",
    "env": {
      "passwd": "",
    },
    "port": {
      "admin": 9090,
      "rest": 5554,
      "ssh": 9022,
      "xml": 5550
    }
  }
};
objectData["portStackCount"] = 4000;
objectData["portStackExclude"] = [];
objectData["portAppCount"] = 3500;
objectData["portAppExclude"] = [];
delete objectData.cwd;


/**
 *  Check for Home Folder Existence
 */
if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io')) ){
    sh.mkdir(path.join(machine.homedir, ".lbmesh.io"));
    sh.touch(path.join(machine.homedir, ".lbmesh.io","global-config"));

    /**
     * Writing Docker Compose
     */
     // sh.cp('-r', path.join(objectData.templatefolder,'db','*.yaml'), path.join(objectData.homedir,'.lbmesh.io'));

    /**
     * Writing Global-Config 
     */
    writeFile.sync(path.join(machine.homedir,".lbmesh.io","global-config"), system.encryptGlobalObject(objectData));
    LOG('   -  Creating Global Preferences for CLI');

} else {

    /**
     * Writing Global-Config 
     */
    //sh.cp('-r', path.join(objectData.templatefolder,'db','*.yaml'), path.join(objectData.homedir,'.lbmesh.io'));
    writeFile.sync(path.join(machine.homedir,".lbmesh.io","global-config"), system.encryptGlobalObject(objectData));
    LOG('   -  Resetting Global Preferences for CLI');
}

/**
 * Create DB Directories
 * @param {*} directory 
 */
function checkDBDirectories(){

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','cassandra')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','cassandra')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','cassandra','data'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','cassandra','config'));
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','elasticsearch')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','elasticsearch')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','elasticsearch','data'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','elasticsearch','config'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','elasticsearch','kibana'));
  }


  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','mongodb')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mongodb')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mongodb','data'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mongodb','config'));
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','cloudant')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','cloudant')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','cloudant','data'));
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','mysql')) ){

    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mysql'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mysql','data'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mysql','config'));
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','postgres')) ){

    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','postgres'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','postgres','config'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','postgres','data'));
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','postgres','pgadmin'));
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','redis')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','redis')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','redis','data')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','redis','config')); 

  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','mssql')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mssql')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mssql','data')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mssql','config')); 
  }
}

checkDBDirectories();

/**
 * Check IntegrationDirectories()
 * @param {} directory 
 */
function checkIntegrationDirectories(){
  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','datapower')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','datapower')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','datapower','local')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','datapower','config')); 

    sh.cp('-r', path.join(objectData.templatefolder,'integ','*.cfg'), path.join(objectData.homedir,'.lbmesh.io','datapower','config'));
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','mqlight')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mqlight')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mqlight','data'));  
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','mq')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mq')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mq','data')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','mq','config')); 
    sh.touch( path.join(objectData.homedir,'.lbmesh.io','mq','mq-config.mqsc')) 
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','acemq')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','acemq')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','acemq','data'));  
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','acemq','config'));
    sh.cp('-r', path.join(objectData.templatefolder,'integ','initial-config'), path.join(objectData.homedir,'.lbmesh.io','acemq','config'));
    //sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','ace-mq','config','initial-config'));
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','iib')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','iib')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','iib','data'));  
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','iib','config')); 
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','splunk')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','splunk')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','splunk','data'));  
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','splunk','config')); 
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','kafka')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','kafka')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','kafka','data'));  
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','kafka','config')); 
  }

  if( !fs.existsSync(path.join(machine.homedir,'.lbmesh.io','rabbitmq')) ){
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','rabbitmq')); 
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','rabbitmq','data'));  
    sh.mkdir(path.join(objectData.homedir,'.lbmesh.io','rabbitmq','config')); 
    sh.cp('-r', path.join(objectData.templatefolder,'integ','rabbitmq.conf*'), path.join(objectData.homedir,'.lbmesh.io','rabbitmq'));
  }

}
checkIntegrationDirectories();


/**
 * Check DashboardDirectories()
 * @param {} directory 
 */
system.jumpstartDashboardApp(objectData);

/**
 * Regenerate DB Yaml
 */
system.jumpstartDbStack(objectData);

/**
 * Regenerate Integeration YAML
 */
system.jumpstartIntegStack(objectData);


/**
 * Create Workspace Folder for LB Mesh Projects
 */
function checkDirectorySync(directory) {  
    try {
      fs.statSync(directory);
    } catch(e) {
      LOG("   -  Creating Workspace for LB Mesh Projects: ");
      LOG("   -  " + directory)
      fs.mkdirSync(directory);
    }
}

checkDirectorySync(path.join(machine.homedir,"workspace-lbmesh"));

/**
 *  Check for Docker and PM2 Installs
 */
if( !sh.which('pm2') ){
    LOG("   -  PM2 not installed, running install now.")
    sh.exec("npm install -g pm2@3.2.4");
}

/**
 * Check for open-cli
 */
if( !sh.which('opn') ){
  LOG("   -  Open-CLI  not installed, running install now.")
  sh.exec("npm install -g opn-cli");
}

/**
 * Check for Password Encrypt CLI
 *  - More Information: https://www.npmjs.com/package/password-encrypt-cli
 */
if( !sh.which('pass') ){
  LOG("   -  Password Encrypt CLI not installed, running install now.")
  sh.exec("npm install -g password-encrypt-cli");
}

/**
 * check for Docker-Compose
 * https://docs.docker.com/compose/install/
 */
if( !sh.which('docker-compose') ){
  LOG("   -  Docker-Compose  not installed, please visit the following URL below on install.")
  LOG("      https://docs.docker.com/compose/install/");
}


//LOG( machine );
LOG();

