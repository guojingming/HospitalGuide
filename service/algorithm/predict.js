var naviebayes = require('naivebayes');
var fs = require('fs');
var async = require('async');

exports.predictDisease = function(serverConnection, description, callback){
    //load model
    var modelStr = fs.readFileSync("./model.json");
    var modelJson = JSON.parse(modelStr);
    //create classifier
    var classifier = naviebayes.fromJson(modelJson);
    //get class result
    result = classifier.categorize(description);
    //get all information
    async.waterfall([
        function(callback){
            serverConnection.query("select * from disease where disease_name = ?", [result], function(err, res){
                callback(null, res[0]);
            });
        },
        function(data, callback){
            var id = data.disease_id;
            serverConnection.query("select * from disease_description where disease_id = ?", [id], function(err, res){
                res[0]['disease_name'] = result;
                callback(null, res[0]);
            });
        }
    ], function(err, res){
        callback(res);
    });
};

// exports.predictDisease("盗汗,淋巴肿胀", function(res){
//     console.log(JSON.stringify(res));
// });