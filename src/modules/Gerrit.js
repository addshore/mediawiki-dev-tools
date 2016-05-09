var
  Config = require('./../modules/Config'),
  request = require('request');

var config = new Config();

var getUsername = function() {
  var gerritUsername = config.get('gerritUsername');
  if( gerritUsername === undefined) {
    throw "Please run with --config to setup first!";
  }
  return gerritUsername;
};

var getPassword = function() {
  var gerritPassword = config.get('gerritPassword');
  if( gerritPassword === undefined) {
    throw "Please run with --config to setup first!";
  }
  return gerritPassword;
};

var get = function(url,callback) {
  request.get({
    url:url,
    heders:{'Accept': 'application/json'},
    auth:{
      user: getUsername(),
      pass: getPassword(),
      sendImmediately: false
    }
  }, function(err,response){
    callback(JSON.parse(response.body.replace(')]}\'','')))
  });
};

var getChangesQueryFromFilters = function(filters) {
  var queryParts = [];
  if(filters.status) {
    queryParts.push('status:' + filters.status)
  }
  if(filters.owner) {
    queryParts.push('owner:' + filters.owner)
  }
  if(filters.reviewer) {
    queryParts.push('reviewer:' + filters.reviewer)
  }
  if(filters.topic) {
    queryParts.push('topic:' + filters.topic)
  }
  if(filters.branch) {
    queryParts.push('branch:' + filters.branch)
  }
  return 'https://gerrit.wikimedia.org/r/a/changes/?q=' + queryParts.join('+');
};

exports.getChanges = function(argv, callback){
  get(getChangesQueryFromFilters(argv), callback)
};
