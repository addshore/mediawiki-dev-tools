var
  fs = require('fs-extra'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  path = require('path'),
  clc = require('cli-color');

var error = clc.red.bold;

exports.run = function (argv) {
  // Bail if stuff is missing
  if((!argv.skin && !argv.extension) || argv.skin === true || argv.extension === true) {
    console.log(error("You must specify an skin or extension to update."));
    return;
  }
  if( !argv.package || argv.package === true ) {
    console.log(error("You must specify a package to update."));
    return;
  }
  if( !argv.version || argv.version === true ) {
    console.log(error("You must specify a version to update to."));
    return;
  }

  var dir = null;
  if(argv.skin) {
    dir = MediaWikiDirectory.getSkinPath(argv.skin);
  }
  if(argv.extension) {
    dir = MediaWikiDirectory.getExtensionPath(argv.extension);
  }

  exports.updateComposer( dir, argv.package, argv.version );

};

exports.updateComposer = function( directory, packageName, newVersion ) {
  var composerFile = path.resolve(directory + '/composer.json');
  try {
    fs.accessSync(composerFile, fs.F_OK);
  }
  catch(err) {
    console.log(error('composer.json not found'));
    return false
  }
  var composerJson = JSON.parse(fs.readFileSync(composerFile, 'utf8'));
  if(composerJson.hasOwnProperty('require')) {
    if(composerJson['require'].hasOwnProperty(packageName)) {
      composerJson['require'][packageName] = newVersion;
    }
  }
  if(composerJson.hasOwnProperty('require-dev')) {
    if(composerJson['require-dev'].hasOwnProperty(packageName)) {
      composerJson['require-dev'][packageName] = newVersion;
    }
  }
  fs.writeFileSync(composerFile,JSON.stringify(composerJson, null, '\t'),'utf8')
};
