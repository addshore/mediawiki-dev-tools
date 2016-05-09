var
  Config = require('./../modules/Config'),
  prompt = require('prompt');

exports.run = function( argv ) {

  var config = new Config();

  var schema = {
    properties: {
      gerritUser: {
        required: true
      },
      gerritPassword: {
        required: true,
        hidden: true
      }
    }
  };

  prompt.start();

  prompt.get(schema, function (err, result) {
    config.set('gerritUsername', result.gerritUser);
    config.set('gerritPassword', result.gerritPassword);
    console.log('All saved!');
  });

};
