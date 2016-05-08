var
  fs = require('fs-extra'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  ComposerJson = require('./../modules/ComposerJson'),
  path = require('path'),
  clc = require('cli-color');

var error = clc.red.bold;

var updateRequirement = function (type, name, packageName, version, dryRun) {
  var jsonPath = path.resolve( MediaWikiDirectory.getAnnexPath(type, name) + '/composer.json' );
  if( ComposerJson.updateRequirement(jsonPath, packageName, version, dryRun) ){
    console.log(type + ' ' + name + ' requirements ' + packageName + ' : ' + version);
  }
};

exports.run = function (argv) {
  // Bail if stuff is missing
  if (
    (!argv.skin && !argv.extension && !argv.skins && !argv.extensions) ||
    argv.skin === true ||
    argv.extension === true
  ) {
    console.log(error("You must specify something to update."));
    return;
  }
  if (!argv.package || argv.package === true) {
    console.log(error("You must specify a package to update."));
    return;
  }
  if (!argv.version || argv.version === true) {
    console.log(error("You must specify a version to update to."));
    return;
  }
  if(argv.dry) {
    console.log('Doing dry run!');
  }

  var skins = [];
  var extensions = [];
  if(argv.skins) {
    skins = skins.concat( MediaWikiDirectory.getAnnexes('skin') );
  }
  if(argv.extensions) {
    extensions = extensions.concat( MediaWikiDirectory.getAnnexes('extension') );
  }
  if(!argv.skins && !argv.extensions) {
    if (argv.skin) {
      skins.push( argv.skin );
    }
    if (argv.extension) {
      extensions.push( argv.extension );
    }
  }

  for (var i = 0; i < skins.length; i++) {
    updateRequirement('skin', skins[i], argv.package, argv.version, argv.dry);
  }
  for (var j = 0; j < extensions.length; j++) {
    updateRequirement('extension', extensions[j], argv.package, argv.version, argv.dry);
  }

};
