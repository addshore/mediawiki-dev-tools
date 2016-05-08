require('shelljs/global');

var
  shell = require('shelljs'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  CommandRequirer = require('./../modules/CommandRequirer'),
  GitHub = require('./../modules/GitHub'),
  cloneSkin = require('./../commands/cloneSkin'),
  fs = require('fs-extra'),
  clc = require('cli-color');

var error = clc.red.bold;

exports.run = function( argv ){
  CommandRequirer.require('git');

  if(argv.branch) {
    if(argv.branch === true){
      console.log(error('You must specify a branch to make sure extensions are on it'));
      return;
    }
  }

  var extensions = MediaWikiDirectory.getExtensions();

  for (var i = 0; i < extensions.length; i++) {
    var extension = extensions[i];

    if(argv.branch) {
      cd(MediaWikiDirectory.getExtensionPath(extension));
      var gitBranch = shell.exec('git rev-parse --abbrev-ref HEAD',{silent:true});
      var gitBranchErr = gitBranch.stderr.trim();
      gitBranch = gitBranch.stdout.trim();

      if(gitBranchErr.indexOf('fatal: ambiguous argument') > -1) {
        console.log(extension + ' appears to be a totally empty git repo.');
      } else if( argv.branch != gitBranch ) {
        if(argv.fix) {
          shell.exec('git stash');
          shell.exec('git checkout master');
          console.log(extension + ' was on branch ' + gitBranch + ' now on ' + argv.branch);
        } else {
          console.log(extension + ' is on branch ' + gitBranch);
        }
      }
    }
  }

};
