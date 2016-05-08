var
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  GitHub = require('./../modules/GitHub'),
  clone = require('./../commands/clone');


exports.run = function( argv ) {
  if( !argv.skins && !argv.extensions ) {
    throw '--missing must be run with either --skins or --extensions (or both)';
  }

  if(argv.extensions) {
    console.log('Looking for missing extensions');
    GitHub.getMediawikiExtensions(function( extensions ) {
      var hadMissing = false;
      for (var i = 0; i < extensions.length; i++) {
        var extension = extensions[i];
        if(!MediaWikiDirectory.annexExitsts('extension',extension)) {
          hadMissing = true;
          if(argv.get) {
            clone.cloneExtension(extension);
          } else {
            console.log('Missing extension ' + extension);
          }
        }
      }
      if(!hadMissing) {
        console.log('No missing extensions!');
      }
    })
  }

  if(argv.skins) {
    console.log('Looking for missing skins');
    GitHub.getMediawikiSkins(function( skins ) {
      var hadMissing = false;
      for (var i = 0; i < skins.length; i++) {
        var skin = skins[i];
        if(!MediaWikiDirectory.annexExitsts('skin',skin)) {
          hadMissing = true;
          if(argv.get) {
            clone.cloneSkin(skin);
          } else {
            console.log('Missing skin ' + skin);
          }
        }
      }
      if(!hadMissing) {
        console.log('No missing skins!');
      }
    })
  }



};
