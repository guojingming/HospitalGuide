var http = require('http');
var url = require('url');

var predicter = require('../algorithm/predict');

//设置主机名
var hostName = '127.0.0.1';
//设置端口
var port = 8932;
//var port = 80;
//创建服务
var server = http.createServer(function(req,res){
    res.writeHeader(200, {'Content-Type':'text/javascript;charset=UTF-8'});  //状态码+响应头属性

    // 解析 url 参数
    var params = url.parse(req.url, true).query;  //parse将字符串转成对象,req.url="/?url=123&name=321"，true表示params是{url:"123",name:"321"}，false表示params是url=123&name=321
    var description = params.predict;
    predicter.predictDisease(description, function(disease){
        res.write('疾病名：');
        res.write(disease['disease_name'] + "\n");
        res.write('疾病别名：');
        res.write(disease['disease_nickname'] + "\n");
        res.write('疾病描述：');
        res.write(disease['disease_description'] + "\n");
        res.write('挂号科室：');
        res.write(disease['disease_department'] + "\n");
        res.end();
    });

    
});

server.listen(port,hostName,function(){
    console.log('服务器运行在http:' + hostName + ':' + port);
});
