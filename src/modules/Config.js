var
  nconf = require('nconf'),
  path = require('path'),
  Obfuscator = require('string-obfuscator');

var Config = module.exports = function(){
  this.location = path.resolve(__dirname + '/../../config.json');
  this.paddingObfuscator = new Obfuscator({
    algorithm: 'aes-256-ctr',
    // Yes this is just obfuscating not encrypting...
    password: '98jf3298j3fr32fr3232ytfsasahd34w',
    random_length:true
  });
  this.obfuscator = new Obfuscator({
    algorithm: 'aes-256-ctr',
    // Yes this is just obfuscating not encrypting...
    password: '9jew8s9j4w98tj4ew8jt98j4ewafdsfsa'
  });
  this.conf = nconf.file(this.location);
};

Config.prototype.set = function(key, value){
  key = this.obfuscator.encode(key);
  value = this.paddingObfuscator.encode(value);
  this.conf.set(key,value);
  this.conf.save(function (err) {
    if(err) {
      throw "Failed to save config";
    }
  });
};

Config.prototype.get = function(key){
  key = this.obfuscator.encode(key);
  var value = this.conf.get(key);
  if(value === undefined) {
    return value;
  }
  return this.paddingObfuscator.decode(value);
};
