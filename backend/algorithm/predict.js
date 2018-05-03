var naviebayes = require('naivebayes');
var fs = require('fs');
var mysql = require('mysql');

var mysqlServerConfig = {
    host:'45.78.41.228',
    user: 'root',
    password: '1234',
    database: 'medical',
    useConnectionPooling: true
};

var serverConnection = mysql.createConnection(mysqlServerConfig);

var result = "";

exports.predictDisease = function(description, callback){
    //load model
    var modelStr = fs.readFileSync("./model.json");
    var modelJson = JSON.parse(modelStr);
    //create classifier
    var classifier = naviebayes.fromJson(modelJson);
    //get class result
    result = classifier.categorize(description);
    //get all information
    //console.log(result);
    serverConnection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            throw err;
        }
        serverConnection.query("select * from disease where disease_name = ?", [result], function(err, res){
            var id = res[0].disease_id;
            serverConnection.query("select * from disease_description where disease_id = ?", [id], function(err, res){
                res[0]['disease_name'] = result;
                callback(res[0]);
                //console.log(JSON.stringify(res[0].disease_description));
            });

            // serverConnection.query("select * from disease_symptom where disease_id = ?", [id], function(err, res){
            //     for(var index in res){
            //         var symptomId = res[index]['symptom_id'];
            //         serverConnection.query("select * from symptom where symptom_id = ?", [symptomId], function(err, res){
            //             console.log(JSON.stringify(res));
            //         });
            //     }
            // });
        });
    });
};

// exports.predictDisease("盗汗,淋巴肿胀", function(res){
//     console.log(JSON.stringify(res));
// });