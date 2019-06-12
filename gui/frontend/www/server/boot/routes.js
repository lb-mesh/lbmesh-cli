'use strict'
const machine = require('lbmesh-os').profile();
const path    = require('path');
const async   = require('async');

const meshDatabases = ['mongodb','mysql','redis','mssql','cloudant','postgres','elasticsearch','cassandra'];
const meshIntegrations = ['datapower','mq','mqlight','acemq','rabbitmq','iib','splunk','kafka'];

let meshData = require( path.join(machine.node.globalPath,'lbmesh-cli','gui','frontend','www','server','classes','globalfile.js') );
let DB = require( path.join(machine.node.globalPath,'lbmesh-cli','classes','db.js') );
let INTEG = require( path.join(machine.node.globalPath,'lbmesh-cli','classes','integ.js') );

module.exports = function(app) {

    app.get('/', function(req,res,next){
        res.redirect('/dashboard.html');
    });

	/**
     *  @method GET /dashboard.html
     */
    app.get('/dashboard.html',  function(req,res,next) {

        app.models.container.getList( function(err,data){
            res.render('index.ejs', {
                link: 'Dashboard',
                data: meshData.getData(),
                docker: data,
                services: {
                    "db": meshDatabases,
                    "integ": meshIntegrations
                }
            });
        })
                
    });

	/**
     *  @method GET /projects.html
     */
    app.get('/projects.html',  function(req,res,next) {
        res.render('projects.ejs', {
            link: 'Projects',
            data: meshData.getData(),
            services: {
                "db": meshDatabases,
                "integ": meshIntegrations
            }
        });
                
    });

	/**
     *  @method GET /integrations.html
     */
    app.get('/integrations.html',  function(req,res,next) {


        app.models.container.getList( function(err,data){
            res.render('integrations.ejs', {
                link: 'Integrations',
                data: meshData.getData(),
                detail: false,
                docker: { "integ": data.integ },
                //{"db": resultArray.container.db },
                services: {
                    "db": meshDatabases,
                    "integ": meshIntegrations
                }
            });
        });
                
    });

	/**
     *  @method GET /databases.html
     */
    app.get('/databases.html',  function(req,res,next) {

        app.models.container.getList( function(err,data){
            res.render('databases.ejs', {
                link: 'Databases',
                data: meshData.getData(),
                docker: {"db": data.db },
                detail: false,
                services: {
                    "db": meshDatabases,
                    "integ": meshIntegrations
                }
            });
        });
                
    });

    /**
     * @method POST /integrations/:name/manage.html
     */
    app.post('/integrations/:name/manage.html', function(req,res,next){
        switch( req.body.nextstep ){
            case 'settings':
                // res.json( req.body );
                let dbClass = new INTEG();
                    dbClass.retrievePorts();
                    dbClass.updateGuiPorts(req.body);

                meshData.refreshData();
                    
                res.redirect('/integrations/' + req.body.chosenDB + '/manage.html?status=success&action=update');
            break;
            case 'start':
                 //   res.json( req.body );
                app.models.compose.startService('integ', req.body.service, function(err, results){
                    if( err ){
                        res.redirect("/integrations/" + req.body.service + "/manage.html?status=error&action=start&reason="+err.reason);
                    } else {
                        res.redirect("/integrations/" + req.body.service + "/manage.html?status=success&action=start");
                    }
                });
            break;
            case 'stop':
                app.models.compose.stopService('integ', req.body.service, function(err, results){
                    if( err ){
                        res.redirect("/integrations/" + req.body.service + "/manage.html?status=error&action=stop");
                    } else {
                        res.redirect("/integrations/" + req.body.service + "/manage.html?status=success&action=stop");
                    }
                });
            break;
            // case 'pull':
            //     app.models.container.pullService(req.body.category, req.body.service, function(err, results){
            //         res.json(results);
            //     });
            // break;
            case 'remove':
                    app.models.compose.removeThisService('integ', req.body.service, function(err, results){
                        if( err ){
                            res.redirect("/integrations/" + req.body.service + "/manage.html?status=error&action=stop");
                        } else {
                            res.redirect("/integrations/" + req.body.service + "/manage.html?status=success&action=stop");
                        }
                    });
            break;
            case 'removeddd':

                async.series({
                    container: function(callback1){
                        app.models.container.removeService(req.body.containerId, function(err, results){
                            callback1(null, results);
                        });                        
                    },
                    image: function(callback2){
                        app.models.container.removeImage(req.body.service, req.body.image, function(err, results){
                            callback2(null, results);
                        }); 
                    }
                },
                function(err, resultArray){
                      res.redirect("/integrations/" + req.body.service + "/manage.html");
                });// end async                   
            break;
        }
    });



    app.post('/integrations/pull', function(req,res,next){
        if( req.body ){
            app.models.container.pullService(req.body.category, req.body.service, function(err, results){
                res.send(results);
            });
        }  

    });

    app.post('/databases/pull', function(req,res,next){
        if( req.body ){
            app.models.container.pullService(req.body.category, req.body.service, function(err, results){
                res.send(results);
            });
        }  

    });

    /**
     * @method POST /databases/:name/manage.html
     */
    app.post('/databases/:name/manage.html',  function(req,res,next) {
        
        switch( req.body.nextstep ){
            case 'settings':
                 
                let dbClass = new DB();
                    dbClass.retrievePorts();
                    dbClass.updateGuiPorts(req.body);

                meshData.refreshData();
                    
                res.redirect('/databases/' + req.body.chosenDB + '/manage.html?status=success&action=update');
            break;
            case 'start':
                app.models.compose.startService('db', req.body.service, function(err, results){
                    console.log( results );
                    if( err ){
                        res.redirect("/databases/" + req.body.service + "/manage.html?status=error&action=start");
                    } else {
                        res.redirect("/databases/" + req.body.service + "/manage.html?status=success&action=start");
                    }
                });
            break;
            case 'stop':
                app.models.compose.stopService('db', req.body.service, function(err, results){
                    console.log( results );
                    if( err ){
                        res.redirect("/databases/" + req.body.service + "/manage.html?status=error&action=stop");
                    } else {
                        res.redirect("/databases/" + req.body.service + "/manage.html?status=success&action=stop");
                    }
                });
            break;
            // case 'pull':
            //     app.models.container.pullService(req.body.category, req.body.service, function(err, results){
            //         res.json(results);
            //     });
            // break;
            case 'remove':
                    app.models.compose.removeThisService('db', req.body.service, function(err, results){
                        if( err ){
                            res.redirect("/databases/" + req.body.service + "/manage.html?status=error&action=stop");
                        } else {
                            res.redirect("/databases/" + req.body.service + "/manage.html?status=success&action=stop");
                        }
                    });
            break;
            case 'removeddd':

                async.series({
                    container: function(callback1){
                        app.models.compose.removeService(req.body.service, function(err, results){
                            callback1(null, results);
                        });                        
                    },
                    image: function(callback2){
                        app.models.container.removeImage(req.body.service, req.body.image, function(err, results){
                            callback2(null, results);
                        }); 
                    }
                },
                function(err, resultArray){
                      res.redirect("/databases/" + req.body.service + "/manage.html");
                });// end async                   
            break;
        }

    });
 
	/**
     *  @method GET /integrations/:name/manage.html
     */
    app.get('/integrations/:name/manage.html',  function(req,res,next) {

        async.series({
            container: function(callback1){
                app.models.container.getList( function(err,data){
                    callback1(null, data);
                });                        
            },
            logs: function(callback2){
                app.models.container.getOutput('integ', req.params.name, function(err, results){
                    let temp = results.split("\n");
                    callback2(null, temp);
                }); 
            }
        },
        function(err, resultArray){
            //console.log( resultArray );
        //app.models.container.getList( function(err,data){
            res.render('integrations.ejs', {
                link: 'Integrations',
                data: meshData.getData(),
                detail: true,
                docker: {"integ": resultArray.container.integ},
                services: {
                    "db": meshDatabases,
                    "integ": meshIntegrations,
                    "yaml": meshData.getIntegYAML(req.params.name),
                    "logs": resultArray.logs.reverse(),
                    "detail": req.params.name
                }
            });
        });
                
    });

	/**
     *  @method GET /databases/:name/manage.html
     */
    app.get('/databases/:name/manage.html',  function(req,res,next) {

            async.series({
                container: function(callback1){
                    app.models.container.getList( function(err,data){
                        callback1(null, data);
                    });                        
                },
                logs: function(callback2){
                    app.models.container.getOutput('db', req.params.name, function(err, results){
                        let temp = results.split("\n");
                        callback2(null, temp);
                    }); 
                }
            },
            function(err, resultArray){
                //console.log( resultArray );
                res.render('databases.ejs', {
                    link: 'Databases',
                    data: meshData.getData(),
                    docker: {"db": resultArray.container.db },
                    detail: true,
                    services: {
                        "db": meshDatabases,
                        "yaml": meshData.getDbYAML(req.params.name),
                        "logs": resultArray.logs.reverse(),
                        "integ": meshIntegrations,
                        "detail": req.params.name
                    }
                });

            });// end async

        });
                
     


};