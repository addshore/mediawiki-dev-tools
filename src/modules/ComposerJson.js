var
  fs = require('fs-extra');

exports.updateRequirement = function( jsonPath, packageName, newVersion, dryRun ) {
  try {
    fs.accessSync(jsonPath, fs.F_OK);
  }
  catch(err) {
    return false
  }
  var changes = false;
  var composerJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  if(
    composerJson.hasOwnProperty('require') &&
    composerJson['require'].hasOwnProperty(packageName) &&
    composerJson['require'][packageName] != newVersion
  ) {
    composerJson['require'][packageName] = newVersion;
    changes = true;
  }
  if(
    composerJson.hasOwnProperty('require-dev') &&
    composerJson['require-dev'].hasOwnProperty(packageName) &&
    composerJson['require-dev'][packageName] != newVersion
  ) {
    composerJson['require-dev'][packageName] = newVersion;
    changes = true;
  }
  if(changes && !dryRun) {
    fs.writeFileSync(jsonPath,JSON.stringify(composerJson, null, '\t'),'utf8')
  }
  return changes;
};
