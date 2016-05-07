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

  // Bail if no skin was passed in
  if( argv.cloneSkin === true ) {
    console.log(error("You must specify an skin to clone."));
    return;
  }

  exports.cloneSkin(argv.cloneSkin);
};

exports.cloneSkin = function( skin ){
  CommandRequirer.require('git');

  if(MediaWikiDirectory.skinExists(skin)){
    console.log(error('Specified skin is already cloned.'));
    return;
  }

  // Get the user.name registered in git and bail if there isn't one
  var gitUser = shell.exec('git config --get user.name',{silent:true}).stdout;
  if(!gitUser){
    console.log(error('You must have a user.name configured in git.'));
    return;
  }

  var skinDir = MediaWikiDirectory.getSkinPath(skin);
  var pwd = path.resolve('.');

  // Clone the skin from github, switch the remove and add the commit-msg hook for Gerrit
  shell.exec('git clone https://github.com/wikimedia/mediawiki-skins-' + skin + '.git ' + skinDir);
  cd(skinDir);
  shell.exec('git remote set-url origin ssh://' + gitUser + '@gerrit.wikimedia.org:29418/mediawiki/skins/' + skin);
  fs.copySync(__dirname + '/../../misc/commit-msg', skinDir + '/.git/hooks/commit-msg');
  cd(pwd);
};
