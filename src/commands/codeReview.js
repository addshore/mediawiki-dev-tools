var
  Config = require('./../modules/Config'),
  Gerrit = require('./../modules/Gerrit');

exports.run = function( argv ) {

  var changeCallback;
  if( argv.count ) {
    changeCallback = function(changes){
      console.log(changes.length + ' changes.');
    }
  }

  if(changeCallback !== undefined) {
    Gerrit.getChanges( argv, changeCallback );
  } else {
    console.log('You are not using the command right!');
  }


};
