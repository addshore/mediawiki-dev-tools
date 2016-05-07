var
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  GitHub = require('./../modules/GitHub'),
  cloneSkin = require('./../commands/cloneSkin');


exports.run = function( argv ) {
  GitHub.getMediawikiSkins(function( skins ) {
    var hadMissing = false;
    for (var i = 0; i < skins.length; i++) {
      var skin = skins[i];
      if(!MediaWikiDirectory.skinExists(skin)) {
        hadMissing = true;
        if(argv.clone) {
          cloneSkin.cloneSkin(skin);
        } else {
          console.log('Missing skin ' + skin);
        }
      }
    }
    if(!hadMissing) {
      console.log('No missing skins!');
    }
  })

};
