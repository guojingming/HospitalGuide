var XLSX = require('xlsx');
var mysql = require('mysql');

var workbook = XLSX.readFile('service/resources/data.xlsx');

// 获取 Excel 中所有表名
var sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']
// 根据表名获取对应某张表
var worksheet = workbook.Sheets[sheetNames[0]];

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

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
    for(var index = 4087;index<7784;index++){
        var a = "";
        var b = "";
        var c = "";
        var d = "";
        var e = "";
        var f = "";
        var g = "";
        var h = "";
        var i = "";
        var j = "";
        var k = "";
        var l = "";
        var m = "";
        var n = "";
        var o = "";
        var p = "";
        var q = "";
        var r = "";

        try {
            a = (String)(worksheet['A' + index ]['w']);
        } catch(e) {
            
        }
        try {
            b = (String)(worksheet['B' + index ]['w']); 
       
        } catch(e) {
            
        }
        try {
            c = (String)(worksheet['C' + index ]['w']); 
        
        } catch(e) {
            
        }
        try {
            d = (String)(worksheet['D' + index ]['w']); 
        
        } catch(e) {
            
        }
        try {
            e = (String)(worksheet['E' + index ]['w']); 
       
        } catch(e) {
            
        }
        try {
            f = (String)(worksheet['F' + index ]['w']); 
            
        } catch(e) {
            
        }
        try {
            g = (String)(worksheet['G' + index ]['w']); 
            
        } catch(e) {
            
        }
        try {
            h = (String)(worksheet['H' + index ]['w']); 
            
        } catch(e) {
            
        }
        try {
            i = (String)(worksheet['I' + index ]['w']); 
            
        } catch(e) {
            
        }
        try {
            j = (String)(worksheet['J' + index ]['w']); 
            
        } catch(e) {
            
        }
        try {
            k = (String)(worksheet['K' + index ]['w']);
            
        } catch(e) {
            
        }
        try {
            l = (String)(worksheet['L' + index ]['w']);
            
        } catch(e) {
            
        }
        try {
            m = (String)(worksheet['M' + index ]['w']);
           
        } catch(e) {
            
        }
        try {
            n = (String)(worksheet['N' + index ]['w']);
            
        } catch(e) {
            
        }
        try {
            o = (String)(worksheet['O' + index ]['w']);
            
        } catch(e) {
            
        }
        try {
            p = (String)(worksheet['P' + index ]['w']);
            
        } catch(e) {
            
        }
        try {
            q = (String)(worksheet['Q' + index ]['w']);
            
        } catch(e) {
            
        }
        try {
            r = (String)(worksheet['R' + index ]['w']);
            
        } catch(e) {
            
        }
        serverConnection.query("insert into ori_data values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r], function(err, res){
            console.log(a + " " + b + " " + c);
            
            if(err != null){
               console.log(err);
            }
        });
    }
}); 
