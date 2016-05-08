var
  fs = require('fs-extra'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  ComposerJson = require('./../modules/ComposerJson'),
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

  ComposerJson.updateRequirement( path.resolve(dir + '/composer.json'), argv.package, argv.version );

};
