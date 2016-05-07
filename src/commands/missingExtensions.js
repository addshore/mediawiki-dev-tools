var
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  GitHub = require('./../modules/GitHub'),
  cloneExtension = require('./../commands/cloneExtension');


exports.run = function( argv ) {
  GitHub.getMediawikiExtensions(function( extensions ) {
    var hadMissing = false;
    for (var i = 0; i < extensions.length; i++) {
      var extension = extensions[i];
      if(!MediaWikiDirectory.extensionExists(extension)) {
        hadMissing = true;
        if(argv.clone) {
          cloneExtension.cloneExtension(extension);
        } else {
          console.log('Missing extension ' + extension);
        }
      }
    }
    if(!hadMissing) {
      console.log('No missing skins!');
    }
  })

};
