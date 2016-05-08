var
  fs = require('fs-extra'),
  path = require('path');

var ComposerJson = module.exports = function(directory){
  this.path = path.resolve(directory + '/composer.json');
  this._throwOnNotComposerJson();
  this._load();
  this.hasChanges = false;
};

ComposerJson.prototype._throwOnNotComposerJson = function() {
  try {
    fs.accessSync(this.path, fs.F_OK);
  }
  catch(err) {
    throw 'No composer.json file found: ' . this.path;
  }
};

ComposerJson.prototype._load = function() {
  var rawData = fs.readFileSync(this.path, 'utf8');
  this.content = JSON.parse(rawData);
};

/**
 * @param packageName
 * @param atVersion Optional
 * @returns {boolean|String} or the version
 */
ComposerJson.prototype.requiresPackage = function(packageName, atVersion) {
  try{
    var version = this.content['require'][packageName];
    if( version === undefined ) {
      return false;
    }
    if( atVersion === undefined || version == atVersion ) {
      return version;
    }
  }catch(err){
    return false;
  }
};

/**
 * @param packageName
 * @param atVersion Optional
 * @returns {boolean|String} or the version
 */
ComposerJson.prototype.requiresDevPackage = function(packageName, atVersion) {
  try{
    var version = this.content['require-dev'][packageName];
    if( version === undefined ) {
      return false;
    }
    if( atVersion === undefined || version == atVersion ) {
      return version;
    }
  }catch(err){
    return false;
  }
};

ComposerJson.prototype.save = function() {
  fs.writeFileSync(this.path,JSON.stringify(this.content, null, '\t') + "\n",'utf8')
};

ComposerJson.prototype.require = function(packageName, version) {
  if( this.requiresPackage(packageName) ) {
    this.content['require'][packageName] = version;
    this.hasChanges = true;
  }
};

ComposerJson.prototype.requireDev = function(packageName, version) {
  if( this.requiresDevPackage(packageName) ) {
    this.content['require-dev'][packageName] = version;
    this.hasChanges = true;
  }
};
