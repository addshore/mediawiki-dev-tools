require('shelljs/global');

var
  fs = require('fs-extra'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  ComposerJson = require('./../modules/ComposerJson'),
  path = require('path'),
  clc = require('cli-color');

var error = clc.red.bold;

var updateRequirement = function (type, name, packageName, version, argv) {
  var annexPath = MediaWikiDirectory.getAnnexPath(type, name);
  var jsonPath = path.resolve( annexPath + '/composer.json' );
  if( ComposerJson.updateRequirement(jsonPath, packageName, version, argv.dry) ){
    console.log(type + ' ' + name + ' requirements ' + packageName + ' : ' + version);
    if(argv.push && !argv.dry) {
      cd(annexPath);
      exec( 'git add ./composer.json' );
      exec( 'git commit -m "composer.json ' + packageName + ' to ' + version + '"' );
      exec( 'git push origin HEAD:refs/drafts/master' );
      exec( 'git reset --hard origin/master');
    }
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
    updateRequirement('skin', skins[i], argv.package, argv.version, argv);
  }
  for (var j = 0; j < extensions.length; j++) {
    updateRequirement('extension', extensions[j], argv.package, argv.version, argv);
  }

};
