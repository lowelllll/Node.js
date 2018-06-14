// 파일 목록 알아내기

var testFolder = './data';
var fs = require('fs');

fs.readdir(testFolder, function(err,filelist){
    console.log(filelist);
});