# Node.js
>  Node.js는 확장성 있는 네트워크 애플리케이션(특히 서버 사이드) 개발에 사용되는 소프트웨어 플랫폼이다. 작성 언어로 자바스크립트를 활용하며 Non-blocking I/O와 단일 스레드 이벤트 루프를 통한 높은 처리 성능을 가지고 있다.

- 웹 브라우저를 제어하는 자바스크립트를 이용해 웹 브라우저가 아닌 컴퓨터 자체를 제어함.
- 내장 HTTP 서버 라이브러리를 포함하고 있어 웹 서버 기능을 제어할 수 있음.  
    웹 서버는 아님.

### 예제
`hello world!`를 출력해봅시다.
```javascript   
var http = require('http');

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}).listen(8000);

console.log('Server running at http://localhost:8000/');
```