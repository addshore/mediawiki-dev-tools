var
  fs = require('fs-extra'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  path = require('path'),
  clc = require('cli-color');

var error = clc.red.bold;

exports.updateRequirement = function( jsonPath, packageName, newVersion ) {
  try {
    fs.accessSync(jsonPath, fs.F_OK);
  }
  catch(err) {
    console.log(error('composer.json not found'));
    return false
  }
  var composerJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  if(
    composerJson.hasOwnProperty('require') &&
    composerJson['require'].hasOwnProperty(packageName) &&
    composerJson['require'][packageName] != newVersion
  ) {
    console.log(jsonPath + ' require ' + packageName + ':' + newVersion);
    composerJson['require'][packageName] = newVersion;
  }
  if(
    composerJson.hasOwnProperty('require-dev') &&
    composerJson['require-dev'].hasOwnProperty(packageName) &&
    composerJson['require-dev'][packageName] != newVersion
  ) {
    console.log(jsonPath + ' require-dev ' + packageName + ':' + newVersion);
    composerJson['require-dev'][packageName] = newVersion;
  }
  fs.writeFileSync(jsonPath,JSON.stringify(composerJson, null, '\t'),'utf8')
};
