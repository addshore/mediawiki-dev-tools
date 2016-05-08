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
  if( (argv.skin && argv.skin === true) || (argv.extension && argv.extension === true) ) {
    console.log(error("You must specify an skin or extension to clone."));
    return;
  }

  if(argv.skin) {
    exports.cloneSkin(argv.skin);
  }
  if(argv.extension) {
    exports.cloneExtension(argv.extension);
  }
};

exports.cloneAnnex = function( type, name ){
  CommandRequirer.require('git');

  if( type !== 'skin' && type !== 'extension' ) {
    throw 'cloneThing type must be skin or extension';
  }

  if(MediaWikiDirectory.annexExitsts('extension',extension)){
    console.log(error('Specified extension is already cloned.'));
    return;
  }

  // Get the user.name registered in git and bail if there isn't one
  var gitUser = shell.exec('git config --get user.name',{silent:true}).stdout;
  if(!gitUser){
    console.log(error('You must have a user.name configured in git.'));
    return;
  }

  var extensionDir = MediaWikiDirectory.getAnnexPath('extension',extension);
  var pwd = path.resolve('.');

  // Clone the extension from github, switch the remove and add the commit-msg hook for Gerrit
  shell.exec('git clone https://github.com/wikimedia/mediawiki-extensions-' + extension + '.git ' + extensionDir);
  cd(extensionDir);
  shell.exec('git remote set-url origin ssh://' + gitUser + '@gerrit.wikimedia.org:29418/mediawiki/extensions/' + extension);
  fs.copySync(__dirname + '/../../misc/commit-msg', extensionDir + '/.git/hooks/commit-msg');
  cd(pwd);
};


exports.cloneExtension = function( name ){
  exports.cloneAnnex( 'extension', name );
};

exports.cloneSkin = function( name ){
  exports.cloneAnnex( 'skin', name );
};
