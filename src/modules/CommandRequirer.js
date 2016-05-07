require('shelljs/global');

var
  shell = require('shelljs'),
  clc = require('cli-color');

var error = clc.red.bold;

exports.require = function( command ) {
  if (!which(command)) {
    console.log(error( 'Sorry, this script requires ' + command + ' to be in your path.' ));
    exit(1);
  }
};
