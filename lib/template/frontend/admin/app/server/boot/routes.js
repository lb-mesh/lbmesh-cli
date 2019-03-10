/*
 Copyright (c) IBM Corp. 2013,2017. All Rights Reserved.
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
'use strict';

const _       = require('underscore');
const async   = require('async');
const debug   = require('debug')('app:router:paths');
const ejs     = require('ejs');
const fs      = require('fs');
const Guid    = require('guid');
const jwtoken = require('jsonwebtoken');
const moment  = require('moment');

 


module.exports = function(app) {
      debug( app.get('env') );
    /**
     * @method userAuthRequired
     * 
     * Middleware to ensure customers are logged in. 
     * 
     */
    function userAuthRequired( req, res, next) {      
      if (!req.session.admintoken) {
          return res.redirect('/login.html?error=ACCESS_DENIED');
      } else {
          // Check Idle Time - getLast Time  ( 18 is real value )
          if (app.models.authenticate.currentTime > 20) {
            debug('UserAuthRequired Idle Time Logout: ${app.models.authenticate.currentTime}');
            req.session.adminuser = null;
            req.session.admintoken = null;       
            app.models.authenticate.stopTimer();
            res.redirect('/login.html?error=SESSION_EXPIRED');
          } else {
            app.models.authenticate.pageClicked();
            next();
          }
      }
  };

  /**
   * @method POST /login
   * 
   * Login method for users.  This will hit the password token website and retrieve a jwt token from the API Manager.
   */
  app.post('/login.html', function(req, res) {
 
          app.models.administrator.login({
            email: req.body.email,
            password: req.body.password,
          }, 'user', function(err, token) {

            if (err) {
              debug("=====  ran Admin.login() =======");
              res.redirect("/login.html?error=LOGIN_FAILED");
              return;
            }
                //res.redirect('/');
              var sessionToken = token.toJSON();
              debug("---- Auth Successful: Token " + sessionToken);
              req.session.admintoken = sessionToken.id;
              req.session.adminuser = sessionToken.user;
              req.accessToken = sessionToken.id;
              //console.log( sessionToken );

              //res.session()
              res.redirect('/dashboard/home.html');

          });// end Admin.login()
      
  });


  /**
   * @method GET /
   * 
   * Call to the / of the application will check to see if there is already a token active.  if so, it will redirect to the homepage. 
   * 
   */
  app.get('/', function(req, res) {

      if(req.session.admintoken) {
        res.redirect('/dashboard/home.html');
      } else {
        res.redirect('/login.html'); 
      }

  });

  /**
   * @method GET /login.html
   * 
   * Show the login form
   */
    app.get('/login.html', function(req, res, next) {
 
      var alertError = false;
      var alertState = '';
      var alertSuccess = false;

      if( !req.session.admintoken ){

          if (req.query.error) {
            alertError = true;
            alertState = req.query.error;
          }

          if (req.query.success) {
            alertSuccess = true;
            alertState = req.query.success;
          }

            res.render('site-login', {
              email: '',
              alertError: alertError,
              alertSuccess: alertSuccess,
              alertMessage: alertState,
              content: false,
              password: ''
            });

      } else {
          res.redirect('/dashboard/home.html');          
      }
      
    });

  //log a user out
  app.get('/dashboard/logout', userAuthRequired, function(req, res, next) {
  
    //if (!req.session.admintoken) return res.sendStatus(401); //return 401:unauthorized if accessToken is not present

          async.series([
            function(callback) {

              app.models.administrator.logout(req.session.admintoken, function(err) {
                callback(null, err);
              });
                      
            },
            function(callback) {
                req.session.destroy(function(err2) {
                  // cannot access session here
                  callback(null,err2);
                })
            },
        ],
        // optional callback
        function(err, results) {
            // the results array will equal ['one','two'] even though
            // the second function had a shorter timeout.
            debug("Final Logout Messges");
            debug( results );

            app.models.authenticate.stopTimer();
            res.redirect('/login.html?success=loggedout');

        });

    

  });

 

/**
 * DASHBOARD HOME
 */

  /**
   * @method GET /dashboard/
   * 
   * CALL to the root of the dashboard URL will redirect to /home.html
   */
  app.get('/dashboard/', userAuthRequired, function(req, res, next) {
      res.redirect('/dashboard/home.html');
  });

  /**
   * @method GET /dashboard/home.html
   * 
   * Home page for the dashboard.  It will run a few calls async to gather data to display.
   */
  app.get('/dashboard/home.html', userAuthRequired, function(req, res, next) {

            async.series([
                // function(callback) {
                //   app.models.cron.nextRun('prepare', function(err, results) {
                //     callback(null, results);
                //   });
                          
                // },
                // function(callback) {
                //   app.models.cron.nextRun('messenger', function(err, results) {
                //     callback(null, results);
                //   });
                // },
            ],
            // optional callback
            function(err, results) {
                // the results array will equal ['one','two'] even though
                // the second function had a shorter timeout.
                
                  res.render('dashboard_home', {
                    link: 'Home',
                    homepage: [], //results, 
                    cron: CRONSTATUS,
                    currentUser: req.session.adminuser,
                  });
            });

  });



};
