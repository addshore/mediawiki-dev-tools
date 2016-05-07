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

/**
 * @param extensionName
 * @returns {*}
 */
exports.getExtensionPath = function(extensionName) {
  return path.resolve(exports.getPath() + '/extensions/' + extensionName);
};

/**
 * @param skinName
 * @returns {*}
 */
exports.getSkinPath = function(skinName) {
  return path.resolve(exports.getPath() + '/skins/' + skinName);
};

/**
 * Checks to see if the given extension directory exists and it cloned / has a .git
 * @param extensionName
 * @returns {boolean}
 */
exports.extensionExists = function (extensionName) {
  var extensionPath = exports.getExtensionPath(extensionName);
  try {
    fs.accessSync(extensionPath, fs.F_OK);
    fs.accessSync(path.resolve(extensionPath + '/.git'), fs.F_OK);
    return true;
  }
  catch(err) {
    return false
  }
};


/**
 * Checks to see if the given skin directory exists and it cloned / has a .git
 * @param skinName
 * @returns {boolean}
 */
exports.skinExists = function (skinName) {
  var skinPath = exports.getSkinPath(skinName);
  try {
    fs.accessSync(skinPath, fs.F_OK);
    fs.accessSync(path.resolve(skinPath + '/.git'), fs.F_OK);
    return true;
  }
  catch(err) {
    return false
  }
};
