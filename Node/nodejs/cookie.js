var http = require('http');
var cookie = require('cookie');

http.createServer(function(request,response){
    
    if(request.headers.cookie !== undefined){
        var cookies = cookie.parse(request.headers.cookie);
        console.log(cookies);
    }
    // create cookie
    response.writeHead(200,{
        'Set-Cookie':[
            'yummy-cookie=choco',
            'tasty-cookie=strawbarry',
            `permanent=cookies;Max-Age=${60*60*24*30}`,
            'secure=secure; Secure',
            'httponly=httponly; HttpOnly',
            'path=path; Path=/cookie',
            'domain=domain; Domain=yejin.com'
        ] 
        // permamnet cookie 계속 유지되는 쿠키(기간을 설정할 수 있음) 
        // session cookie 브라우저를 껐다 키면 사라짐

        // secure https 통신에서만 웹 브라우저가 웹 서버에 쿠키를 전송할 수 있음
        // httponly http로 요청할 때만 쿠키를 읽을 수 있음.(자바스크립트에서는 읽지 못함)
        // path path를 지정한 곳에서만 쿠키가 살아있도록 하는 설정
        // domain 어떤 domain에서 쿠키가 동작할 수 있는지 설정.
    }); 
    // 웹 브라우저는 쿠키를 저장하고 requst header에 쿠키를 같이 보냄.
    response.end('Cookie!!');
}).listen(3000);