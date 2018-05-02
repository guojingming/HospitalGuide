var mysql = require("mysql");
//Only run one time, used to provide original json data for compare.py
//var synonyms = require("node-synonyms");
var fs = require("fs");
var async = require("async");

var mysqlServerConfig = {
    host:'45.78.41.228',
    user: 'root',
    password: '1234',
    database: 'medical',
    useConnectionPooling: true
};

var serverConnection = mysql.createConnection(mysqlServerConfig);

writeProcessedDataToDatabase();

function writeProcessedDataToDatabase(){
    //get all data
    getAllSymptomsAndDisease(function(data){
        //construct 'disease' table -> [disease_id PK NN, disease_name UQ NN]
        //construct 'disease_description table'
        var diseaseTable = [];
        var diseaseDescriptionTable = [];
        var diseaseSymptomTable = [];
        var symptomTable = [];

        var rowsNumber = 0;
        for(var diseaseIndex in data.disease){
            var diseaseName = data.disease[diseaseIndex]['disease_name'];
            //console.log(diseaseName);
            diseaseTable.push({'disease_id':rowsNumber, 'disease_name':diseaseName});
            diseaseDescriptionTable.push({
                'disease_id':rowsNumber,
                'disease_nickname':data.disease[diseaseIndex]['disease_nickname'],
                'disease_description':data.disease[diseaseIndex]['disease_description'],
                'disease_department':data.disease[diseaseIndex]['disease_department'],
                "disease_age":"",
                "disease_location":data.disease[diseaseIndex]['disease_location'],
                "disease_infectious":data.disease[diseaseIndex]['disease_infectious'],
                "disease_group":data.disease[diseaseIndex]['disease_group'],
                "disease_cost":data.disease[diseaseIndex]['disease_cost'],
                "disease_complication":data.disease[diseaseIndex]['disease_complication']
            });
            rowsNumber++;
        }
        rowsNumber = 0;
        for(var symptom in data.symptoms){
            symptomTable.push({'symptom_id':rowsNumber, 'symptom_name':symptom});
            for(var diseaseIdIndex in data.symptoms[symptom]){
                diseaseSymptomTable.push({'disease_id':data.symptoms[symptom][diseaseIdIndex], 'symptom_id':rowsNumber});
            }
            rowsNumber++;            
        }

        //write to database
        async.eachSeries(diseaseTable, function(disease, errCb){
            serverConnection.query("insert into disease values (?,?)", [disease.disease_id, disease.disease_name], function(err, res){
                errCb();
            });
        }, function(err){
            if(err){
                throw err;
            }
        });

        async.eachSeries(diseaseDescriptionTable, function(diseaseDescription, errCb){
            serverConnection.query("insert into disease values (?,?,?,?,?,?,?,?,?,?)", [diseaseDescription.disease_id, diseaseDescription.disease_nickname, diseaseDescription.disease_description, diseaseDescription.disease_department, diseaseDescription.disease_age, diseaseDescription.disease_location, diseaseDescription.disease_infectious, diseaseDescription.disease_group, diseaseDescription.disease_cost, diseaseDescription.disease_complication], function(err, res){
                errCb();
            });
        }, function(err){
            if(err){
                throw err;
            }
        });

        async.eachSeries(diseaseSymptomTable, function(diseaseSymptom, errCb){
            serverConnection.query("insert into disease values (?,?)", [diseaseSymptom.disease_id, diseaseSymptom.symptom_id], function(err, res){
                errCb();
            });
        }, function(err){
            if(err){
                throw err;
            }
        });

        async.eachSeries(symptomTable, function(symptom, errCb){
            serverConnection.query("insert into disease values (?,?)", [symptom.symptom_id, symptom.symptom_name], function(err, res){
                errCb();
            });
        }, function(err){
            if(err){
                throw err;
            }
        });
        
    });
}

function getAllSymptomsAndDisease(callback){
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
                var symptoms = JSON.parse(res[diseaseIndex]['disease_symptoms']);
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

