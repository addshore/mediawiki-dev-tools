#! /usr/bin/env node

require('shelljs/global');

var
  argv = require('yargs').argv,
  fs = require('fs-extra'),
  path = require('path'),
  clc = require('cli-color');

var error = clc.red.bold;

var commands = [,
  "help",
  "cloneExtension",
  "msgHook"
];

for (var i = 0; i < commands.length; i++) {
  var command = commands[i];
  if( argv.hasOwnProperty( command ) ) {
    require('./commands/' + command + '.js').run(argv);
    exit(0);
  }
}

require('./commands/help.js').run(argv);
