require('shelljs/global');

var
  shell = require('shelljs'),
  fs = require('fs-extra'),
  clc = require('cli-color'),
  path = require('path'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  CommandRequirer = require('./../modules/CommandRequirer');

var error = clc.red.bold;

exports.run = function( argv ) {
  CommandRequirer.require('git');

  // Bail if no extension was passed in
  if( argv.cloneExtension === true ) {
    console.log(error("You must specify an extension to clone."));
    return;
  }

  exports.cloneExtension(argv.cloneExtension);
};

exports.cloneExtension = function( extension ){
  CommandRequirer.require('git');

  if(MediaWikiDirectory.extensionExists(extension)){
    console.log(error('Specified extension is already cloned.'));
    return;
  }

  // Get the user.name registered in git and bail if there isn't one
  var gitUser = shell.exec('git config --get user.name',{silent:true}).stdout;
  if(!gitUser){
    console.log(error('You must have a user.name configured in git.'));
    return;
  }

  var extensionDir = MediaWikiDirectory.getExtensionPath(extension);
  var pwd = path.resolve('.');

  // Clone the extension from github, switch the remove and add the commit-msg hook for Gerrit
  shell.exec('git clone https://github.com/wikimedia/mediawiki-extensions-' + extension + '.git ' + extensionDir);
  cd(extensionDir);
  shell.exec('git remote set-url origin ssh://' + gitUser + '@gerrit.wikimedia.org:29418/mediawiki/extensions/' + extension);
  fs.copySync(__dirname + '/../../misc/commit-msg', extensionDir + '/.git/hooks/commit-msg');
  cd(pwd);
};
