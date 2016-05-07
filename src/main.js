#! /usr/bin/env node

require('shelljs/global');

var
  argv = require('yargs').argv,
  shell = require('shelljs'),
  fs = require('fs-extra'),
  path = require('path'),
  clc = require('cli-color');

var error = clc.red.bold;

if (!which('git')) {
  echo(error( 'Sorry, this script requires git' ));
  exit(1);
}

if (argv.cloneExtension) {
  if( argv.cloneExtension === true ) {
    console.log(error("You must specify an extension to clone."));
    return;
  }
  var gitUser = shell.exec('git config --get user.name',{silent:true}).stdout;
  if(!gitUser){
    console.log(error('You must have a user.name configured in git.'));
    return;
  }
  shell.exec('git clone https://github.com/wikimedia/mediawiki-extensions-' + argv.cloneExtension + '.git ' + argv.cloneExtension);
  cd(argv.cloneExtension);
  shell.exec('git remote set-url origin ssh://' + gitUser + '@gerrit.wikimedia.org:29418/mediawiki/extensions/' + argv.cloneExtension);
  cd('..');
  fs.copySync(__dirname + '/../misc/commit-msg', './' + argv.cloneExtension + '/.git/hooks/commit-msg');
  return;
}

if (argv.msgHook) {
  fs.access('./.git/hooks/', fs.F_OK, function (err) {
    if (!err) {
      fs.copySync(__dirname + '/../misc/commit-msg', './.git/hooks/commit-msg');
      console.log('Added Gerrit commit-msg to this repo\'s hooks.')
    } else {
      console.log(error('Couldn\'t add hook as you are not in a git repo.'))
    }
  } );
  return;
}

if (!argv.help) {
  console.log(error("Unknown command!"));
}
console.log(fs.readFileSync(__dirname + '/../misc/help', 'utf8'));
