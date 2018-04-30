var mysql = require("mysql");
var synonyms = require("node-synonyms");
var fs = require("fs");

var mysqlServerConfig = {
    host:'45.78.41.228',
    user: 'root',
    password: '1234',
    database: 'medical',
    useConnectionPooling: true
};


function writeProcessedDataToDatabase(){
    //get all data
    getAllSymptomsAndDisease(function(data){
        //construct 'disease' table -> [disease_id PK NN, disease_name UQ NN]
        //construct 'disease_description table'
        var diseaseTable = [];
        var diseaseDescriptionTable = [];
        var rowsNumber = 0;
        for(var diseaseIndex in data.disease){
            var diseaseName = data.disease[diseaseIndex]['disease_name'];
            diseaseTable.push({'disease_id':rowsNumber, 'disease_name':diseaseName});
            diseaseDescriptionTable.push({
                'disease_id':rowsNumber,
                'disease_nickname':"",
                'disease_description':""
                //////////////////////////////unfinished///////////////////
            });
        }
        

    });
}

function getAllSymptomsAndDisease(callback){
    var serverConnection = mysql.createConnection(mysqlServerConfig);
    serverConnection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            throw err;
        }
        console.log('Mysql connected as id ' + serverConnection.threadId);
        serverConnection.query("select * from ori_data", [], function(err, res){
            if(err != null){
                console.log(err);
            }
    
            //get all symptom
            var allSymptoms = {};
            var length = 0;
            for(var diseaseIndex in res){
                var symptoms = JSON.parse(res[diseaseIndex]['典型症状']);
                for(var symptomIndex in symptoms){
                    var symptom = symptoms[symptomIndex];
                    if (allSymptoms[symptom] == undefined){
                        allSymptoms[symptom] = [];
                        length++
                    }
                    allSymptoms[symptom].push(diseaseIndex);
                } 
            }
            console.log("Symptoms count : " + length);
            //Only run one time, used to provide original json data for compare.py
            //fs.writeFileSync("./backend/pre_process_scripts/symptoms.json", JSON.stringify(allSymptoms));
        
            //When confirm there are not similar symptoms, return symptoms and disease.
            var data = {};
            data.disease = res;
            data.symptoms = allSymptoms;
            callback(data);
        });
    }); 
}

