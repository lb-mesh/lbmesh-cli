'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var bb = require('express-busboy');
const health = require('@cloudnative/health-connect');
let healthcheck = new health.HealthChecker();
var prometheus = require('appmetrics-prometheus').attach();


var app = module.exports = loopback();

bb.extend(app, {
  upload: true,
  path: './temp/',
  allowedPath: /./
});

/**
 * Activating CloudNativeJS Health Check URLs
 * https://github.com/CloudNativeJS/cloud-health-connect/blob/master/README.md#cloud-health-connect
 */
app.use('/health', health.LivenessEndpoint(healthcheck))
app.use('/ready', health.ReadinessEndpoint(healthcheck))


app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer') && process.env.NODE_ENV !== 'production') {
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
