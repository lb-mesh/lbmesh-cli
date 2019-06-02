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
const path      = require('path');
const machine   = require('lbmesh-os').profile();
const Projects     = require(path.join(machine.node.globalPath,'lbmesh-cli','classes','projects') );
const chalk     = require('chalk');
const jsonfile = require('jsonfile');
const availableApps = ['admin','databank','scheduler','messenger','www','api'];

const ask = require('inquirer');
const debug     = require('debug')('app:classes:decisions');
const LOG       = console.log;
const fs    = require('fs');
const sh    = require('shelljs');
const table     = require('markdown-table');
const _         = require('underscore');

class Decisions extends Projects{
    constructor(){
        super();
    }

    defaultQuestion(component){
        switch(component){
            case 'databank':

                ask
                .prompt([
                    {
                        "type": "list",
                        "default": "action",
                        "message": "Select your " + component.toUpperCase() + " Action?",
                        "name": "projaction",
                        "choices": [
                          {"name": "Exit", "value": "exit"},
                          new ask.Separator('-----  Model Options -----'),
                          {"name":"Create Persisted Model", "value":"create"},
                          {"name":"Create Non-Persisted Model", "value":"create-nopersist"},
                          {"name":"Remove Model", "value":"delete"},
                          new ask.Separator('-----  Remote Method Options -----'),
                          {"name":"Create Model Custom Path", "value":"create-path"},

                          new ask.Separator(),                 
                        ],
                        //"message": 'Create Project in Default Workspace $HOME/Workspace-lbmesh/ (Y) or Current Directory (n)?'
                      },
                ])
                .then(answers => {

                    switch(answers.projaction){
                        case 'create':
                        case 'delete':
                        case 'create-path':
                        case 'create-nopersist':
                            this.nextStep( component, answers.projaction );
                        break;
                    }
  
                });

            break;
            case 'messenger':
                ask
                .prompt([
                    {
                        "type": "list",
                        "default": "action",
                        "message": "Select your " + component.toUpperCase() + " Action?",
                        "name": "projaction",
                        "choices": [
                          {"name": "Exit", "value": "exit"},
                          new ask.Separator('------ Model Options ------'),
                          {"name":"Create Model", "value":"create"},
                          {"name":"Remove Model", "value":"delete"},
                          new ask.Separator('------ Remote Method Options ------'),
                          {"name":"Create Remote Method / Model Path", "value":"create-path"},
                          new ask.Separator('------ NPM Project Options ------'),
                          {"name":"Run NPM Install", "value":"system-npminstall"},
                          {"name":"Add NPM Package", "value":"system-addpackage"},
                          {"name":"Remove NPM Package", "value":"system-delpackage"},
                          new ask.Separator(),                 
                        ],
                        //"message": 'Create Project in Default Workspace $HOME/Workspace-lbmesh/ (Y) or Current Directory (n)?'
                      },
                ])
                .then(answers => {

                    switch(answers.projaction){
                        case 'create':
                        case 'delete':
                        case 'create-path':

                            this.nextStep( component, answers.projaction );
                        break;
                        case 'system-npminstall':
                        case 'system-addpackage':
                        case 'system-delpackage':
                            this.nextSystemStep( component, answers.projaction );
                        break;
                    }
  
                });
            break;
            case 'scheduler':

            break;
        }
    }

    startProcess(component){
        this.defaultQuestion(component);
    }

    nextStep(component, flow){
        switch(component){
            case 'databank':
                switch(flow){
                    case 'create':
                    LOG();
                    LOG("--- " + component.toUpperCase() + ": Create an Persisted Model")
                    LOG("");
                    ask.
                    prompt([
                      {
                        "type": "input",
                        "name": "modelname",
                        "message": 'Enter the model name ?'
                      }                   
                    ]).then( answers2 => {
                        LOG();
                        LOG("Request to create persisted model " + answers2.modelname.toLowerCase() );
                        LOG();

                                ask.
                                prompt([
                                    {
                                        "type": "confirm",
                                        "default": "Y",
                                        "name": "docreate",
                                        "message": 'Are you sure you want to create this persisted model? ' 
                                      },               
                                ]).then( answers3 => {
                                    //LOG( answers3 );
                                    LOG();
                                    if( answers3.docreate ){
                                        /**
                                         * Process Flow: databank-create-model
                                         */
                                        let projData = { 
                                            "profile": this.readProjectConfig( process.cwd() ),
                                            "create": {
                                                "app": component,
                                                "model": answers2.modelname.toLowerCase(),
                                                "modeltype": "PersistedModel"
                                            }};

                                        this.executeFlow('databank-create-persisted-model', projData);
                                       
                                    } else {
                                        this.startProcess( component );
                                    }
                                });
 
                    });

                    break;
                    case 'create-nopersist':
                        LOG();
                        LOG("--- " + component.toUpperCase() + " : Create an Model")
                        LOG("");
                        ask.
                        prompt([
                        {
                            "type": "input",
                            "name": "modelname",
                            "message": 'Enter the model name ?'
                        }                   
                        ]).then( answers2 => {
                            LOG();
                            LOG("Request to create model " + answers2.modelname.toLowerCase() );
                            LOG();

                                    ask.
                                    prompt([
                                        {
                                            "type": "confirm",
                                            "default": "Y",
                                            "name": "docreate",
                                            "message": 'Are you sure you want to create this model? ' 
                                        },               
                                    ]).then( answers3 => {
                                        //LOG( answers3 );
                                        LOG();
                                        if( answers3.docreate ){
                                            /**
                                             * Process Flow: databank-create-model
                                             */
                                            let projData = { 
                                                "profile": this.readProjectConfig( process.cwd() ),
                                                "create": {
                                                    "app": component,
                                                    "model": answers2.modelname.toLowerCase(),
                                                    "modeltype": "Model"
                                                }};

                                            this.executeFlow('databank-create-model', projData);
                                        
                                        } else {
                                            this.startProcess( component );
                                        }
                                    });
    
                        });

                    break;
                    case 'create-path':
                        LOG();
                        LOG("--- " + component.toUpperCase() + ": Create Model Path")
                        LOG("");
                            if( fs.existsSync(path.resolve('backend','databank','server','model-config.json')  ) ){
                                jsonfile.readFile(path.resolve('backend','databank','server','model-config.json'))
                                .then(obj => {
                                    let tempModels = Object.keys(obj);
                                    let tempArray = [
                                        new ask.Separator(),
                                        {"name": "CANCEL", "value": "exit"},
                                        new ask.Separator()
                                    ];
                                        tempModels.forEach( function(m){
                                            if( m !== '_meta' ){
                                                tempArray.push({
                                                    "name": m.toUpperCase(),
                                                    "value": m
                                                })
                                            }
                                        });

                                        
                                    ask.
                                    prompt([
                                    {
                                        "type": "list",
                                        "name": "modelname",
                                        "choices": tempArray,
                                        "message": 'Select ' + component.toUpperCase() + ' Model to Add Path ?'
                                    },
                                    {
                                        "type": "list",
                                        "name": "method",
                                        "choices": [
                                            {"name":"GET","value":"get"},
                                            {"name":"POST","value":"post"}
                                        ],
                                        "message": 'Select ' + component.toUpperCase() + ' Model Method Path ?'
                                    },
                                    {
                                        "type": "input",
                                        "name": "modelpath",
                                        "default": "path/name",
                                        "message": 'Enter ' + component.toUpperCase() + ' model Path ?'
                                      },
                                      {
                                        "type": "input",
                                        "name": "modelfunc",
                                        "default": "myname",
                                        "message": 'Enter keyword for function ?'
                                      }                    
                                    ]).then( answers2 => {
                                        LOG();
                                        LOG("Request to add custom path to " + answers2.modelname.toUpperCase() );
                                        LOG("   --- " + answers2.method + ": " + answers2.modelname + "/" + answers2.modelpath)
                                        LOG();
                                            ask.
                                            prompt([
                                                {
                                                    "type": "confirm",
                                                    "default": "Y",
                                                    "name": "docreate",
                                                    "message": 'Are you sure you want to create this model custom path? ' 
                                                },               
                                            ]).then( answers3 => {
                                                //LOG( answers3 );
                                                LOG();
                                                if( answers3.docreate ){
                                                    /**
                                                     * Process Flow: databank-remove-model
                                                     */
                                                    let projData = { 
                                                        "profile": this.readProjectConfig( process.cwd() ),
                                                        "create": {
                                                            "app": component,
                                                            "model": answers2.modelname,
                                                            "modelfunc": answers2.modelfunc,
                                                            "modelpath": answers2.modelpath,
                                                            "modelmethod": answers2.method
                                                        }};
            
                                                    this.executeFlow('databank-model-create-path', projData);
            
                                                } else {
                                                    this.startProcess( component );
                                                }
                                            });

                                    }); 
                                })
                                .catch()
                            } else {
                                LOG();
                                LOG("--- " + component.toUpperCase() + ": Problem reading Models List")
                                LOG("");                           
                            }

                    break;
                    case 'delete':
                        LOG();
                        LOG("--- " + component.toUpperCase() + ": Remove an Model")
                        LOG("");
                        if( fs.existsSync(path.resolve('backend','databank','server','model-config.json')  ) ){
                            jsonfile.readFile(path.resolve('backend','databank','server','model-config.json'))
                            .then(obj => {
                                let tempModels = Object.keys(obj);
                                let tempArray = [
                                    new ask.Separator(),
                                    {"name": "CANCEL", "value": "exit"},
                                    new ask.Separator()
                                ];
                                    tempModels.forEach( function(m){
                                        if( m !== '_meta' ){
                                            tempArray.push({
                                                "name": m.toUpperCase(),
                                                "value": m
                                            })
                                        }
                                    });

                                     
                                ask.
                                prompt([
                                {
                                    "type": "list",
                                    "name": "modelname",
                                    "choices": tempArray,
                                    "message": 'Select ' + component.toUpperCase() + ' Model to Remove ?'
                                }                   
                                ]).then( answers2 => {
                                    LOG();
                                    LOG("Request to remove model " + answers2.modelname );
                                    LOG();
                                        ask.
                                        prompt([
                                            {
                                                "type": "confirm",
                                                "default": "Y",
                                                "name": "doremove",
                                                "message": 'Are you sure you want to remove this model? ' 
                                            },               
                                        ]).then( answers3 => {
                                            //LOG( answers3 );
                                            LOG();
                                            if( answers3.doremove ){
                                                /**
                                                 * Process Flow: databank-remove-model
                                                 */
                                                let projData = { 
                                                    "profile": this.readProjectConfig( process.cwd() ),
                                                    "create": {
                                                        "app": component,
                                                        "model": answers2.modelname
                                                    }};
        
                                                this.executeFlow('databank-remove-model', projData);
        
                                            } else {
                                                this.startProcess( component );
                                            }
                                        });

                                }); 
                            })
                            .catch()
                        } else {
                            LOG();
                            LOG("--- " + component.toUpperCase() + ": Problem reading Models List")
                            LOG("");                           
                        }

                    break;
                }
            break;
            case 'messenger':

                switch(flow){
                    case 'create':

                    LOG();
                    LOG("--- " + component.toUpperCase() + ": Create an Model")
                    LOG("");
                    ask.
                    prompt([
                    {
                        "type": "input",
                        "name": "modelname",
                        "message": 'Enter the model name ?'
                    }                   
                    ]).then( answers2 => {
                        LOG();
                        LOG("Request to create model " + answers2.modelname );
                        LOG();

                                ask.
                                prompt([
                                    {
                                        "type": "confirm",
                                        "default": "Y",
                                        "name": "docreate",
                                        "message": 'Are you sure you want to create this model? ' 
                                    },               
                                ]).then( answers3 => {
                                    //LOG( answers3 );
                                    LOG();
                                    if( answers3.docreate ){
                                        /**
                                         * Process Flow: databank-create-model
                                         */
                                        let projData = { 
                                            "profile": this.readProjectConfig( process.cwd() ),
                                            "create": {
                                                "app": component,
                                                "model": answers2.modelname
                                            }};

                                        this.executeFlow('messenger-create-model', projData);

                                    } else {
                                        this.startProcess( component );
                                    }
                                });

                    });

                    break;
                    case 'delete':
                        LOG();
                        LOG("--- " + component.toUpperCase() + ": Remove an Model")
                        LOG("");
                        if( fs.existsSync(path.resolve('backend','messenger','server','model-config.json')  ) ){
                            jsonfile.readFile(path.resolve('backend','messenger','server','model-config.json'))
                            .then(obj => {
                                let tempModels = Object.keys(obj);
                                let tempArray = [
                                    new ask.Separator(),
                                    {"name": "CANCEL", "value": "exit"},
                                    new ask.Separator()
                                ];
                                    tempModels.forEach( function(m){
                                        if( m !== '_meta' ){
                                            tempArray.push({
                                                "name": m.toUpperCase(),
                                                "value": m
                                            })
                                        }
                                    });

                                    
                                ask.
                                prompt([
                                {
                                    "type": "list",
                                    "name": "modelname",
                                    "choices": tempArray,
                                    "message": 'Select ' + component.toUpperCase() + ' Model to Remove ?'
                                }                   
                                ]).then( answers2 => {
                                    LOG();
                                    LOG("Request to remove model " + answers2.modelname );
                                    LOG();
                                        ask.
                                        prompt([
                                            {
                                                "type": "confirm",
                                                "default": "Y",
                                                "name": "doremove",
                                                "message": 'Are you sure you want to remove this model? ' 
                                            },               
                                        ]).then( answers3 => {
                                            //LOG( answers3 );
                                            LOG();
                                            if( answers3.doremove ){
                                                /**
                                                 * Process Flow: databank-remove-model
                                                 */
                                                let projData = { 
                                                    "profile": this.readProjectConfig( process.cwd() ),
                                                    "create": {
                                                        "app": component,
                                                        "model": answers2.modelname
                                                    }};
        
                                                this.executeFlow('messenger-remove-model', projData);
        
                                            } else {
                                                this.startProcess( component );
                                            }
                                        });

                                }); 
                            })
                            .catch()
                        } else {
                            LOG();
                            LOG("--- " + component.toUpperCase() + ": Problem reading Models List")
                            LOG("");                           
                        }

                    break;
                }
            break;
        }// end switch compo
    }

    nextSystemStep(component, flow){
        let desiredFolder = 'frontend';
        switch( component ){
            case 'messenger':
            case 'scheduler':
            case 'databank':
                desiredFolder = 'backend';
            break;
        }
        switch(flow){
            case 'system-npminstall':

            LOG();
            LOG("--- " + component.toUpperCase() + ": Run NPM Install")
            LOG("");

            ask.
            prompt([
                {
                    "type": "confirm",
                    "default": "Y",
                    "name": "doinstall",
                    "message": 'Are you sure you want to run NPM Install? ' 
                },
                ]).then( answers2 => {
                    if( answers2.doinstall){
                        LOG();

                        sh.cd( path.join(process.cwd(), desiredFolder, component) );
                        sh.exec("npm install");

                        LOG();
                        LOG();

                    }  

                        this.startProcess( component );
                     
                });                         

        break;
        case 'system-delpackage':

            LOG();
            LOG("--- " + component.toUpperCase() + ": REMOVE NPM Package")
            LOG("");

                if( fs.existsSync(path.resolve(desiredFolder,component,'package.json')  ) ){
                    jsonfile.readFile(path.resolve(desiredFolder,component,'package.json'))
                    .then(obj => {
                        console.log( obj.dependencies )
                    });
                } else {
                    
                }
        break;
        case 'system-addpackage':

            LOG();
            LOG("--- " + component.toUpperCase() + ": Add NPM Package")
            LOG("");

                ask.
                prompt([
                    {
                        "type": "confirm",
                        "default": "Y",
                        "name": "docreate",
                        "message": 'Are you sure you want to create this model? ' 
                    },
                ]).then( answers2 => {
                    this.startProcess( component );
                });
        break;
        }
    }

    executeFlow(flowName, data){
        switch(flowName){
            case 'databank-create-persisted-model':
                 if( fs.existsSync(path.resolve('backend','databank','server','model-config.json')  ) ){
                    jsonfile.readFile(path.resolve('backend','databank','server','model-config.json'))
                        .then(obj => {
                            let tempModels = Object.keys(obj);
                         if( !tempModels.includes(data.create.model) ){
                                // 1) add to config.json
                                obj[data.create.model] = {
                                    dataSource: "datastore",
                                    public: true
                                };

                                 // 2) Write Files
                                jsonfile.writeFile( path.resolve('backend','databank','server','model-config.json') , obj, { spaces: 2 }, function (err) {
                                    if (err) console.error(err)
                                  });

                                  this.writeProjectModel( data.profile.path, data.create );

                                // 3) Restart Service 
                                LOG()
                                LOG('---- DATABANK Persisted Model: ' + data.create.model + ' Created Successfully')
                                LOG()
                                //sh.exec(" pm2 restart " + data.profile.name + "-databank");

                            } else {
                                LOG();
                                LOG(chalk.red('--- Model ' + data.create.model + ' already exists  ---'));
                                LOG();
                            }

                            // Return to List
                            this.startProcess('databank');
                            
                        
                        })
                        .catch(error => console.error(error))

                    
                 } else {
                     LOG()
                     LOG( chalk.red("---- PROJECT " + data.profile.name.toUpperCase() + " BACKEND DATABANK NOT FOUND!"));
                     LOG()
                 }
            break;
            case 'databank-create-model':
                 if( fs.existsSync(path.resolve('backend','databank','server','model-config.json')  ) ){
                    jsonfile.readFile(path.resolve('backend','databank','server','model-config.json'))
                        .then(obj => {
                            let tempModels = Object.keys(obj);
                         if( !tempModels.includes(data.create.model) ){
                                // 1) add to config.json
                                obj[data.create.model] = {
                                    dataSource: null,
                                    public: true
                                };

                                 // 2) Write Files
                                jsonfile.writeFile( path.resolve('backend','databank','server','model-config.json') , obj, { spaces: 2 }, function (err) {
                                    if (err) console.error(err)
                                  });

                                  this.writeProjectModel( data.profile.path, data.create );

                                // 3) Restart Service 
                                LOG()
                                LOG('---- DATABANK Model: ' + data.create.model + ' Created Successfully')
                                LOG()
                                //sh.exec(" pm2 restart " + data.profile.name + "-databank");

                            } else {
                                LOG();
                                LOG(chalk.red('--- Model ' + data.create.model + ' already exists  ---'));
                                LOG();
                            }

                            // Return to List
                            this.startProcess('databank');
                            
                        
                        })
                        .catch(error => console.error(error))

                    
                 } else {
                     LOG()
                     LOG( chalk.red("---- PROJECT " + data.profile.name.toUpperCase() + " BACKEND DATABANK NOT FOUND!"));
                     LOG()
                 }
            break;
            case 'databank-model-create-path':
                this.writeProjectModelMethod( data.profile.path, data.create );

                // Return to List
                this.startProcess('databank');

            break;
            case 'databank-remove-model':
            if( fs.existsSync(path.resolve('backend','databank','server','model-config.json')  ) ){
                jsonfile.readFile(path.resolve('backend','databank','server','model-config.json'))
                    .then(obj => {
                         
                        delete obj[data.create.model];

                        /**
                         * Write Model Config
                         */
                        jsonfile.writeFile( path.resolve('backend','databank','server','model-config.json') , obj, { spaces: 2 }, function (err) {
                            if (err) console.error(err)
                          });

                        /**
                         * Remove Model Files
                         */
                        sh.rm(path.resolve('backend','databank','server','models', data.create.model + '.js'));
                        sh.rm(path.resolve('backend','databank','server','models', data.create.model + '.json'));

                        LOG()
                        LOG('---- DATABANK: ' + data.create.model + ' removed successfully');
                        LOG();

                    })
                    .catch(error => console.error(error))
                } else {
                    LOG()
                    LOG( chalk.red("---- PROJECT " + data.profile.name.toUpperCase() + " BACKEND DATABANK NOT FOUND!"));
                    LOG()                   
                }


                // Return to List
                this.startProcess('databank');

            break;
            case 'messenger-remove-model':
            if( fs.existsSync(path.resolve('backend','messenger','server','model-config.json')  ) ){
                jsonfile.readFile(path.resolve('backend','messenger','server','model-config.json'))
                    .then(obj => {
                         
                        delete obj[data.create.model];

                        /**
                         * Write Model Config
                         */
                        jsonfile.writeFile( path.resolve('backend','messenger','server','model-config.json') , obj, { spaces: 2 }, function (err) {
                            if (err) console.error(err)
                          });

                        /**
                         * Remove Model Files
                         */
                        sh.rm(path.resolve('backend','messenger','server','models', data.create.model + '.js'));
                        sh.rm(path.resolve('backend','messenger','server','models', data.create.model + '.json'));

                        LOG()
                        LOG('---- MESSENGER: ' + data.create.model + ' removed successfully');
                        LOG();

                    })
                    .catch(error => console.error(error))
                } else {
                    LOG()
                    LOG( chalk.red("---- PROJECT " + data.profile.name.toUpperCase() + " BACKEND MESSENGER NOT FOUND!"));
                    LOG()                   
                }


                            // Return to List
                            this.startProcess('messenger');

            break;
        }
    }


}

module.exports = Decisions;