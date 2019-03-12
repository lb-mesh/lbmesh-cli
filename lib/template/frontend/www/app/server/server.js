'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var bb = require('express-busboy');
var session = require('express-session');


var app = module.exports = loopback();

/**
 * Set View Engines
 * - Initially activating EJS, if both are active, must use extension
 * in render statements i.e. index.ejs or index.pug
 */
app.set('view engine', 'ejs');
//app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/**
 * Configure Body Parser
 */
bb.extend(app, {
  upload: true,
  path: './temp/',
  allowedPath: /./
});

/**
 * Set Express Session Settings
 * Reference URL: https://www.npmjs.com/package/express-session
 */
 
var sessData = {
  saveUninitialized: true,
  resave: true,
  secret: "62137da2-e672-4d16-9e31-c2255eda6538",
  cookie: { }
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy ( reverse proxy friendly )
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sessData));


/**
 * Setting some Local Variables to be Available in Views
 */
app.locals._ = require('underscore');
app.locals.moment = require('moment-timezone');
app.locals.inspect = require('util').inspect;

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    // if (app.get('loopback-component-explorer')) {
    //   var explorerPath = app.get('loopback-component-explorer').mountPath;
    //   console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    // }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});