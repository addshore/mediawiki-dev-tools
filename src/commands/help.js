var
  fs = require('fs-extra'),
  clc = require('cli-color');

var error = clc.red.bold;

exports.run = function( argv ) {

  var helpFiles = fs.readdirSync( __dirname + '/../../help', 'utf8' );

  for (var i = 0; i < helpFiles.length; i++) {
    var helpFileName = helpFiles[i];
    if( argv.hasOwnProperty( helpFileName ) && helpFileName != 'help' ) {
      console.log('');
      console.log(fs.readFileSync(__dirname + '/../../help/' + helpFileName, 'utf8'));
      exit(0);
    }
  }

  if( Object.keys(argv).length > 3 ) {
    console.log(error('No command specific help available.'));
    console.log(error('Generic help provided below...'));
  }

  console.log('');
  console.log(fs.readFileSync(__dirname + '/../../help/help', 'utf8'));
};
