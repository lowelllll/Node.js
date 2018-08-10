var http = require('http');
var cookie = require('cookie');

http.createServer(function(request,response){
    
    if(request.headers.cookie !== undefined){
        var cookies = cookie.parse(request.headers.cookie);
        console.log(cookies);
    }
    // create cookie
    response.writeHead(200,{
        'Set-Cookie':['yummy-cookie=choco','tasty-cookie=strawbarry']
    }); 

    // 웹 브라우저는 쿠키를 저장하고 requst header에 쿠키를 같이 보냄.
    response.end('Cookie!!');
}).listen(3000);