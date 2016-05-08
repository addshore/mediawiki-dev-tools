require('shelljs/global');

var
  path = require('path'),
  fs = require('fs-extra'),
  clc = require('cli-color');

var error = clc.red.bold;

/**
 * Tries to get the path of the current mediawiki install.
 * Looks for the mediawiki composer.json in this directory and all parent directories.
 * @returns {*}
 */
exports.getPath = function () {
  var isMediaWikiDirectory = function (dir) {
    try {
      var composerFile = fs.readJsonSync(path.resolve(dir + '/composer.json'));
      return composerFile.name == 'mediawiki/core'
    }
    catch (err) {
      return false;
    }
  };

  var getParentDirectory = function (dir) {
    return path.resolve(dir + '/..')
  };

  var dir = path.resolve('.');
  var lastDir = null;
  //HAHAHA while true.....
  while (true) {
    if (!isMediaWikiDirectory(dir)) {
      lastDir = dir;
      dir = getParentDirectory(dir);
      if (lastDir == dir) {
        console.log(error('Can\'t find mediawiki root.'));
        exit(1);
      }
    } else {
      return dir;
    }
  }

};

exports.getAnnexes = function( type ) {
  if( type !== 'skin' && type !== 'extension' ) {
    throw 'getAnnexes type must be skin or extension';
  }
  var srcpath = path.resolve( exports.getPath() + '/' + type + 's' );
  return fs.readdirSync(srcpath).filter(function(file) {
    if(file == '.git') {
      return false;
    }
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};


exports.getAnnexPath = function(type, name){
  if( type !== 'skin' && type !== 'extension' ) {
    throw 'getAnnexPath type must be skin or extension';
  }
  return path.resolve(exports.getPath() + '/' + type + 's/' + name);
};

/**
 * Checks to see if the given extension directory exists and it cloned / has a .git
 * @param type
 * @param name
 * @returns {boolean}
 */
exports.annexExitsts = function(type, name) {
  if( type !== 'skin' && type !== 'extension' ) {
    throw 'annexExitsts type must be skin or extension';
  }
  var annexPath = exports.getAnnexPath( type, name );
  try {
    fs.accessSync(annexPath, fs.F_OK);
    fs.accessSync(path.resolve(annexPath + '/.git'), fs.F_OK);
    return true;
  }
  catch(err) {
    return false
  }
};
