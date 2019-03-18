'use strict';

var aguid = require('aguid');
var loopback = require('loopback');
var boot = require('loopback-boot');
const cookieParser = require('cookie-parser');
const path = require('path');
var bb = require('express-busboy');
var uniqid = require('uniqid')

const health = require('@cloudnative/health-connect');
let healthcheck = new health.HealthChecker();
//var prometheus = require('appmetrics-prometheus').attach();

var session = require('express-session');
var MongoStore = require('connect-mongodb-session')(session)

var app = module.exports = loopback();

/**
 * Configure Body Parser
 */
bb.extend(app, {
  upload: true,
  path: './temp/',
  allowedPath: /./
});

/**
 * Set View Engines
 * - Initially activating EJS, if both are active, must use extension
 * in render statements i.e. index.ejs or index.pug
 */
app.set('view engine', 'ejs');
//app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

/**
 * Set Express Session Settings
 * Reference URL: https://www.npmjs.com/package/express-session
 *                https://www.npmjs.com/package/express-mongo-session
 *                https://www.npmjs.com/package/express-mysql-session
 */
 
var sessData = {
  saveUninitialized: true,
  resave: true,
  name: uniqid(process.env.APPNAME),
  store: new MongoStore({
    uri: process.env.DB_URL,
    collection: 'AdministratorWebSessions'
  }),
  secret: aguid(process.env.APPNAME),
  cookie: { 
    
    path: '/', httpOnly: true, secure: false, maxAge: null
  }
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy ( reverse proxy friendly )
  sess.cookie.secure = true // serve secure cookies
}

app.use(cookieParser());
app.use(session(sessData));


/**
 * Activating CloudNativeJS Health Check URLs
 * https://github.com/CloudNativeJS/cloud-health-connect/blob/master/README.md#cloud-health-connect
 */
app.use('/health', health.LivenessEndpoint(healthcheck))
app.use('/ready', health.ReadinessEndpoint(healthcheck))


/**
 * Setting some Local Variables to be Available in Views
 */
app.locals._ = require('underscore');
app.locals.moment = require('moment-timezone');
app.locals.inspect = require('util').inspect;
app.locals.siteTitle = process.env.SITETITLE;

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
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
