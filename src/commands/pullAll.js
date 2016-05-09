require('shelljs/global');

var
  fs = require('fs-extra'),
  path = require('path'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  clc = require('cli-color');

var error = clc.red.bold;

var pullDirectory = function(dir) {
  cd(dir);
  console.log('Stashing, checking out master for, resetting and pulling ' . dir);
  exec('git stash save "mwdev --pull-all"',{silent:true});
  exec('git checkout master',{silent:true});
  exec('git reset --hard origin/master',{silent:true});
  exec('git pull &',{silent:true})
};

exports.run = function( argv ) {
  var root = MediaWikiDirectory.getPath();
  var i;
  if(argv.all){
    pullDirectory(root)
  }
  if(argv.skins||argv.all) {
    var skins = MediaWikiDirectory.getAnnexes('skin');
    for (i = 0; i < skins.length; i++) {
      pullDirectory(path.resolve( root + '/skins/' + skins[i] ));
    }
  }
  if(argv.extensions||argv.all) {
    var annexes = MediaWikiDirectory.getAnnexes('extension');
    for (i = 0; i < annexes.length; i++) {
      pullDirectory(path.resolve( root + '/extensions/' + annexes[i] ));
    }
  }

};
