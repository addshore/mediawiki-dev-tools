var
  fs = require('fs-extra');

exports.run = function( argv ) {
  console.log(fs.readFileSync(__dirname + '/../../misc/help', 'utf8'));
};
