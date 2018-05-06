var mysql = require('mysql');
var naviebayes = require('naivebayes');
var async = require('async');
var fs = require('fs');

var mysqlServerConfig = {
    host:'45.78.41.228',
    user: 'root',
    password: '1234',
    database: 'medical',
    useConnectionPooling: true
};

var serverConnection = mysql.createConnection(mysqlServerConfig);

serverConnection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        throw err;
    }

    var diseaseSymptoms = {};

    async.waterfall([
        function(callback){
            serverConnection.query("select * from disease", function(err, res){
                for(var diseaseIndex in res){
                    var diseaseId = res[diseaseIndex]['disease_id'];
                    var diseaseName = res[diseaseIndex]['disease_name'];
                    diseaseSymptoms[diseaseId] = {};
                    diseaseSymptoms[diseaseId]['diseaseName'] = diseaseName;
                    diseaseSymptoms[diseaseId]['symptoms'] = [];
                    diseaseSymptoms[diseaseId]['diseaseId'] = diseaseId;
                }
                callback(null, diseaseSymptoms);
            });
        },
        function(diseaseSymptoms, callback){
            async.eachSeries(diseaseSymptoms, function(disease, errCb){
                console.log(disease.diseaseId + "/" + 7780);
                serverConnection.query("select * from disease_symptom where disease_id = ?", [disease.diseaseId], function(err, res){
                    var symptomIds = [];
                    for(var symptomIndex in res){
                        symptomIds.push(res[symptomIndex]['symptom_id']);
                    }
                    async.eachSeries(symptomIds, function(symptomId, errCb1){
                        serverConnection.query("select * from symptom where symptom_id = ?", [symptomId], function(err, res1){
                            for(var symptomIndex in res1){
                                var symptom = res1[symptomIndex];
                                diseaseSymptoms[disease.diseaseId]['symptoms'].push(symptom['symptom_name']);
                            }
                            errCb1();
                        });
                    }, 
                    function(err){
                        errCb();
                    });
                });
            },
            function(err){
                if(err){
                    //throw err;
                }
                callback(null, diseaseSymptoms);
            });
        }
    ], function(err, res){
        if(err){
            throw err;
        }
        //start training
        var classifier = new naviebayes();
        for(var diseaseId in diseaseSymptoms){
            var disease = diseaseSymptoms[diseaseId];
            var diseaseName = disease['diseaseName'];
            for(var symptomIndex in disease['symptoms']){
                if(symptomIndex == 'length'){
                    continue;
                }
                var symptomName = disease['symptoms'][symptomIndex];
                classifier.learn(symptomName, diseaseName);
            }
        }
        //save learned model
        var modelJson = classifier.toJson();
        fs.writeFileSync("./model.json", JSON.stringify(modelJson));
    });
});