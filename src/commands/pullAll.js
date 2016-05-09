require('shelljs/global');

var
  fs = require('fs-extra'),
  path = require('path'),
  async = require('async'),
  process = require('process'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  clc = require('cli-color');

var error = clc.red.bold;

var pullDirectory = function(task, callback) {
  var dir = task.dir;
  var useRemote = task.useRemote;
  cd(dir);
  console.log('Queuing ' + dir);
  exec('git stash save "mwdev --pull-all"',{silent:true,async:true}, function() {
    exec('git checkout master',{silent:true});
    if(useRemote) {
      var oldRemote = exec('git config --get remote.origin.url',{silent:true}).stdout.trim();
      exec('git remote set-url origin ' + useRemote,{silent:true});
    }
    exec('git reset --hard origin/master',{silent:true});
    exec('git pull &',{silent:true,async:true}, function() {
      if(useRemote) {
        exec('git remote set-url origin ' + oldRemote,{silent:true});
      }
      console.log('Done ' + dir);
      callback();
    });
  });
};

exports.run = function( argv ) {
  var root = MediaWikiDirectory.getPath();
  var i;

  var asyncLevel = 1;
  if(argv.async) {
    asyncLevel = 25;
    if(argv.async !== true) {
      asyncLevel = argv.async;
    }
  }
  var q = async.queue(pullDirectory, asyncLevel);

  q.drain = function() {
    console.log('All items have been processed');
  };

  //TODO factor this out to somewhere...
  // Get the user.name registered in git and bail if there isn't one
  var gitUser = exec('git config --get user.name',{silent:true}).stdout.trim();
  if(!gitUser){
    console.log(error('You must have a user.name configured in git.'));
    return;
  }

  if(argv.all){
    q.push({dir:root}, function(err){})
  }
  if(argv.skins||argv.all) {
    var skins = MediaWikiDirectory.getAnnexes('skin');
    for (i = 0; i < skins.length; i++) {
      q.push(
        {dir:path.resolve( root + '/skins/' + skins[i] ),useRemote:'ssh://' + gitUser + '@gerrit.wikimedia.org:29418/mediawiki/skins/' + skins[i]},
        function(err){}
      );
    }
  }
  if(argv.extensions||argv.all) {
    var annexes = MediaWikiDirectory.getAnnexes('extension');
    for (i = 0; i < annexes.length; i++) {
      q.push(
        {dir:path.resolve( root + '/extensions/' + annexes[i] ),useRemote:'ssh://' + gitUser + '@gerrit.wikimedia.org:29418/mediawiki/extensions/' + annexes[i]},
        function(err){}
      );
    }
  }

};
