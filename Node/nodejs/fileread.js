var fs = require('fs'); // file system

// 파일 읽기

fs.readFile('sample.txt','utf-8',function (err,data) {
    console.log(data);
});