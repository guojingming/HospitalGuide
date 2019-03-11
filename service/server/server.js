var express = require('express');
var app = express();
var mysql = require('mysql');
var path = require('path');

var predicter = require('../algorithm/predict');

var mysqlServerConfig = {
    host:'104.224.142.49',
    user: 'root',
    password: '1234',
    database: 'medical',
    useConnectionPooling: true
};

var serverConnection = mysql.createConnection(mysqlServerConfig);

var result = "";

serverConnection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        throw err;
    }
});

//设置主机名
var hostName = '127.0.0.1';
//设置端口
var port = 8932;
//var port = 80;
//创建服务

app.get('/', function(request, response) {
    var fatherPath = path.resolve(__dirname, "..");
    response.sendFile(fatherPath + "/view/index.html"); 
});
app.get('/predict', function(request, response) {
    var params = request.query.symptoms;
    predicter.predictDisease(serverConnection, params, function(disease){
        var str = "<p>疾病名称: " + disease.disease_name + "</p><p>疾病描述: " + disease.disease_description + "</p><p>典型症状:" + disease.symptoms + "</p><p>传染性: " + disease.disease_infectious + "</p><p>挂号科室: " + disease.disease_department + "</p><p>治疗费用: " + disease.disease_cost + "</p> <a href='http://127.0.0.1:8932/'>返回</a>";
        response.send(str);
    });
});
app.get("/return", function(request, response) {
    var fatherPath = path.resolve(__dirname, "..");
    response.sendFile(fatherPath + "/view/index.html"); 
});
app.get("*", function(request, response) {
    response.send("404 error!");
});
app.listen(port);