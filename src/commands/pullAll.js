require('shelljs/global');

var
  fs = require('fs-extra'),
  path = require('path'),
  process = require('process'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  clc = require('cli-color');

var error = clc.red.bold;

var pullDirectory = function(dir,useRemote) {
  cd(dir);
  console.log('Queuing ' + dir);
  exec('git stash save "mwdev --pull-all"',{silent:true});
  exec('git checkout master',{silent:true});
  if(useRemote) {
    var oldRemote = exec('git config --get remote.origin.url',{silent:true}).stdout.trim();
    exec('git remote set-url origin ' + useRemote,{silent:true});
  }
  exec('git reset --hard origin/master',{silent:true});
  exec('git pull &',{silent:true});
  if(useRemote) {
    exec('git remote set-url origin ' + oldRemote,{silent:true});
  }
  console.log('Done ' + dir);
};

exports.run = function( argv ) {
  var root = MediaWikiDirectory.getPath();
  var i;

  //TODO factor this out to somewhere...
  // Get the user.name registered in git and bail if there isn't one
  var gitUser = exec('git config --get user.name',{silent:true}).stdout.trim();
  if(!gitUser){
    console.log(error('You must have a user.name configured in git.'));
    return;
  }

  if(argv.all){
    pullDirectory(root);
  }
  if(argv.skins||argv.all) {
    var skins = MediaWikiDirectory.getAnnexes('skin');
    for (i = 0; i < skins.length; i++) {
      pullDirectory(
        path.resolve( root + '/skins/' + skins[i] ),
        'ssh://' + gitUser + '@gerrit.wikimedia.org:29418/mediawiki/skins/' + skins[i]
      );
    }
  }
  if(argv.extensions||argv.all) {
    var annexes = MediaWikiDirectory.getAnnexes('extension');
    for (i = 0; i < annexes.length; i++) {
      pullDirectory(
        path.resolve( root + '/extensions/' + annexes[i] ),
        'ssh://' + gitUser + '@gerrit.wikimedia.org:29418/mediawiki/extensions/' + annexes[i]
      );
    }
  }

};
