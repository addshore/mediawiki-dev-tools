require('shelljs/global');

var
  shell = require('shelljs'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  CommandRequirer = require('./../modules/CommandRequirer'),
  GitHub = require('./../modules/GitHub'),
  fs = require('fs-extra'),
  clc = require('cli-color');

var error = clc.red.bold;

var reportForType = function(type, argv) {
  var annexes = MediaWikiDirectory.getAnnexes(type);

  for (var i = 0; i < annexes.length; i++) {
    var name = annexes[i];

    if(argv.branch) {
      cd(MediaWikiDirectory.getAnnexPath(type,name));
      var gitBranch = shell.exec('git rev-parse --abbrev-ref HEAD',{silent:true});
      var gitBranchErr = gitBranch.stderr.trim();
      gitBranch = gitBranch.stdout.trim();

      if(gitBranchErr.indexOf('fatal: ambiguous argument') > -1) {
        console.log(type + ' ' + name + ' appears to be a totally empty git repo.');
      } else if( argv.branch != gitBranch ) {
        if(argv.fix) {
          shell.exec('git stash');
          shell.exec('git checkout master');
          console.log(type + ' ' + name + ' was on branch ' + gitBranch + ' now on ' + argv.branch);
        } else {
          console.log(type + ' ' + name + ' is on branch ' + gitBranch);
        }
      }
    }
  }

  console.log('Done ' + type + ' report');
};

exports.run = function( argv ){
  CommandRequirer.require('git');

  if( !argv.skins && !argv.extensions ) {
    throw '--report must be run with either --skins or --extensions (or both)';
  }

  if(argv.branch) {
    if(argv.branch === true){
      console.log(error('You must specify a branch to make sure extensions are on it'));
      return;
    }
  }

  if(argv.skins) {
    console.log('Running report for skins');
    reportForType('skin', argv);
  }

  if(argv.extensions) {
    console.log('Running report for extensions');
    reportForType('extension', argv);
  }

};
