require('shelljs/global');

var
  fs = require('fs-extra'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  ComposerJson = require('./../modules/ComposerJson'),
  path = require('path'),
  clc = require('cli-color');

var error = clc.red.bold;

var updateRequirement = function (type, name, argv) {
  var packageName = argv.package;
  var version = argv.version;
  var annexPath = MediaWikiDirectory.getAnnexPath(type, name);
  try{
    var annexComposerJson = new ComposerJson(annexPath);
  }
  catch(err){
    //No composer.json for this annex!
    return;
  }

  var currentVersion = annexComposerJson.requiresPackage(packageName) || annexComposerJson.requiresDevPackage(packageName);
  // If the package name is required somehow
  if(currentVersion) {
    if( argv.from && argv.from != currentVersion ) {
      return;
    }
    if( version == currentVersion ) {
      return;
    }
    annexComposerJson.require(packageName, version);
    annexComposerJson.requireDev(packageName, version);
  }

  if (annexComposerJson.hasChanges) {
    console.log(type + ' ' + name + ' requirements ' + packageName + ' : ' + version + ' from ' + currentVersion);
    if (argv.push) {

      cd(annexPath);
      exec('git stash', {silent: true});
      annexComposerJson.save();
      exec('git add ./composer.json', {silent: true});
      exec('git commit -m "composer.json ' + packageName + ' to ' + version + '"', {silent: true});
      exec('git push origin HEAD:refs/drafts/master');
      exec('git reset --hard HEAD@{1}');
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

  var skins = [];
  var extensions = [];
  if (argv.skins) {
    skins = skins.concat(MediaWikiDirectory.getAnnexes('skin'));
  }
  if (argv.extensions) {
    extensions = extensions.concat(MediaWikiDirectory.getAnnexes('extension'));
  }
  if (!argv.skins && !argv.extensions) {
    if (argv.skin) {
      skins.push(argv.skin);
    }
    if (argv.extension) {
      extensions.push(argv.extension);
    }
  }

  for (var i = 0; i < skins.length; i++) {
    updateRequirement('skin', skins[i], argv);
  }
  for (var j = 0; j < extensions.length; j++) {
    updateRequirement('extension', extensions[j], argv);
  }

};
