var
  fs = require('fs-extra'),
  path = require('path');

exports.run = function (argv) {
  fs.access('./.git/hooks/', fs.F_OK, function (err) {
    if (!err) {
      fs.copySync(__dirname + '/../../misc/commit-msg', './.git/hooks/commit-msg');
      console.log('Added Gerrit commit-msg to this repo\'s hooks.')
    } else {
      console.log(error('Couldn\'t add hook as you are not in a git repo.'))
    }
  });
};
