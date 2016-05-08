require('shelljs/global');

exports.require = function( command ) {
  if (!which(command)) {
    throw 'Sorry, this script requires ' + command + ' to be in your path.';
  }
};
