require('shelljs/global');

var
  shell = require('shelljs'),
  fs = require('fs-extra'),
  path = require('path'),
  CommandRequirer = require('./../modules/CommandRequirer');

exports.run = function( argv ) {
  CommandRequirer.require('git');
  
  // Bail if no extension was passed in
  if( argv.cloneExtension === true ) {
    console.log(error("You must specify an extension to clone."));
    return;
  }
  
  // Get the user.name registeredin git and baiul if there isn't one
  var gitUser = shell.exec('git config --get user.name',{silent:true}).stdout;
  if(!gitUser){
    console.log(error('You must have a user.name configured in git.'));
    return;
  }
  
  // Clone the extension from github, switch the remove and add the commit-msg hook for Gerrit
  shell.exec('git clone https://github.com/wikimedia/mediawiki-extensions-' + argv.cloneExtension + '.git ' + argv.cloneExtension);
  cd(argv.cloneExtension);
  shell.exec('git remote set-url origin ssh://' + gitUser + '@gerrit.wikimedia.org:29418/mediawiki/extensions/' + argv.cloneExtension);
  cd('..');
  fs.copySync(__dirname + '/../../misc/commit-msg', './' + argv.cloneExtension + '/.git/hooks/commit-msg');
};
