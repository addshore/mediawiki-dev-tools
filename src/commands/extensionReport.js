require('shelljs/global');

var
  shell = require('shelljs'),
  fs = require('fs-extra'),
  path = require('path'),
  getAll = require('get-all'),
  GitHubApi = require('github'),
  CommandRequirer = require('./../modules/CommandRequirer'),
  MediaWikiDirectory = require('./../modules/MediaWikiDirectory'),
  FileCacheSimple = require('file-cache-simple');

var github = new GitHubApi({
  // required
  version: "3.0.0",
  // optional
  debug: false,
  protocol: "https",
  host: "api.github.com", // should be api.github.com for GitHub
  //pathPrefix: "/api/v3", // for some GHEs; none for GitHub
  timeout: 5000,
  headers: {
    "user-agent": "mediawiki-dev-tools" // GitHub is happy with a unique user agent
  }
});

var cache = new FileCacheSimple({
  cacheDir: path.resolve(__dirname + '/../../cache/')
});

var repoRequest = function (page, perPage, callback) {
  github.repos.getFromOrg({
    org: 'wikimedia',
    page: page,
    per_page: perPage
  }, function (err, repos) {
    if (err) {
      callback(err);
    } else {
      callback(null, repos);
    }
  })
};

exports.run = function( argv ) {
  var getExtensionsFromRepos = function ( repos ) {
    var extensions = [];
    for (var i = 0; i < repos.length; i++) {
      var repo = repos[i];
      if(repo.name.substring(0,21) == 'mediawiki-extensions-') {
        extensions.push(repo.name.split('-')[2])
      }
    }
    return extensions;
  };

  var processRepos = function( repos ) {
    var extensions = getExtensionsFromRepos(repos);
    for (var i = 0; i < extensions.length; i++) {
      var extension = extensions[i];
      MediaWikiDirectory.checkExtension(extension);
    }
  };

  // Try and get the repos from a cache, fallback to the api if we don't have it
  cache.get('mwdev.wikimediaRepos')
    .then(function(data) {
      if(!data || data === null) {
        console.log('Repo list cache expired, getting from GitHub api.');
        getAll({
          startPage: 0,
          perPage: 100,
          request: repoRequest
        }, function (err, results) {
          if (err) {
            console.log(err);
          } else {
            // cache for 2 hours (in ms)
            cache.set('mwdev.wikimediaRepos', results, 3600 * 2000);
            processRepos( results );
          }
        })
      } else {
        processRepos( data );
      }
    });

};
