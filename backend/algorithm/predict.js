var naviebayes = require('naivebayes');
var fs = require('fs');

var modelStr = fs.readFileSync("./model.json");
var modelJson = JSON.parse(modelStr);

var classifier = naviebayes.fromJson(modelJson);

var result = classifier.categorize('');