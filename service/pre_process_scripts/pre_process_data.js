var mysql = require('mysql');
var synonyms = require("node-synonyms");

var mysqlServerConfig = {
    host:'104.224.142.49',
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
    console.log('Mysql connected as id ' + serverConnection.threadId);
    serverConnection.query("select * from ori_data limit 0,5", [], function(err, res){
        if(err != null){
            console.log(err);
        }

        //get all symptom
        var allSymptoms = {};
        for(var diseaseIndex in res){
            var symptoms = JSON.parse(res[diseaseIndex]['典型症状']);
            for(var symptomIndex in symptoms){
                var symptom = symptoms[symptomIndex];
                if (allSymptoms[symptom] == undefined){
                    allSymptoms[symptom] = [];
                }
                allSymptoms[symptom].push(diseaseIndex);
            } 
        }
        //combine symptoms
        for(var firstSymptomIndex in allSymptoms){
            for(secondSymptomIndex in allSymptoms){
                    
            }
        }
        //create symptom -> disease map
    });
}); 