#!/usr/bin/env node

const program = require('commander');
const shellExec = require('shell-exec')

console.log("----");

program
  .version('0.0.2', '-v, --version')
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook');
 
program
  .command('app [action]')
  .description('Wrapper around lb commands')  
  .option("-n, --folder_name [projname]", "Which setup mode to use")
  .action(function(action, options){
    var mode = options.folder_name || "project";
    //env = env || 'all';
   // exec_mode("lb " + action);
    shellExec('lb ' + action).then(console.log).catch(console.log)
   // console.log('setup for %s env(s) with %s mode', env, mode);
  });

program
  .command('setup [env]')
  .description('run setup commands for all envs')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(env, options){
    var mode = options.setup_mode || "normal";
    env = env || 'all';
    console.log('setup for %s env(s) with %s mode', env, mode);
  });
 
program
  .command('exec <cmd>')
  .alias('ex')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function(cmd, options){
    console.log('exec "%s" using %s mode', cmd, options.exec_mode);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ deploy exec sequential');
    console.log('    $ deploy exec async');
    console.log();
  });
 
program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });
 
program.parse(process.argv);