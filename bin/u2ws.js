#!/usr/bin/env node

var Unix2WS = require('../lib/unix2ws');

var yargs = require('yargs');

var argv = yargs
  .usage('Forward data to connected websockets\nUsage: $0')
  .example('$0 -s 10001 --ws-port 10000', '')
  .example('$0 -s unix.sock --ws-port 10000', '')
  .example('$0 -f fifo --ws-port 10000', '')
  .alias('d', 'debug')
  .alias('j', 'json')
  .alias('s', 'from-socket')
  .alias('f', 'from-fifo')
  .alias('p', 'ws-port')
  
  .default('d', false)
  .default('j', true)
  .default('p', 10000)
  
  .boolean(['d', 'j'])
  .string(['f', 's'])

  .describe('d', "Prints debugging information")
  .describe('j', "Try to JSON.parse input lines")
  .describe('p', "Port to open for socket.io")
  .describe('s', "Opens TCP/UNIX socket for input")
  .describe('f', "Creates named pipe for input")

  .check(function(argv) {
    if (argv['from-socket'] == null && argv['from-fifo'] == null){
      throw "One of '-s' or '-f' must be used";
    }
    var chosen = (argv['from-socket'] ? argv['from-socket'] : argv['from-fifo']);
    if (chosen == "" || typeof(chosen) !== "string"){
      throw "One of '-s' or '-f' must be used"; 
    }
  }).argv;

var options = {
  port: argv['ws-port'],
  socket: argv['from-socket'],
  fifo: argv['from-fifo'],
  debug: argv['debug'],
  json: argv['json']
};

var tool = new Unix2WS(options);

tool.start();

process.on('SIGINT', function() {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  tool.stop();
  return process.kill();
});
