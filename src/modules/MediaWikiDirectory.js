require('shelljs/global');

var
  shell = require('shelljs'),
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

exports.checkExtension = function (extension) {
  var extensionDirectory = path.resolve(exports.getPath() + '/extensions');
  try {
    fs.accessSync(path.resolve(extensionDirectory + '/' + extension + '/'), fs.F_OK)
  }
  catch(err) {
    console.log('Missing extension ' + extension);
  }
};
