const express = require('express');
const app = express(); // 애플리케이션 반환
var fs = require('fs');
var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic'); // 토픽 라우터를 가져옴
var indexRouter = require('./routes/index'); // 인덱스 라우터를 가져옴
var helmet = require('helmet');
app.use(helmet()); // 보안

/*
  익스프레스는 모든 것이 미들웨어라고 할 수 있음.
*/


// serving static files
// 정적인 파일 서비스하기.
// public 폴더 안에서 static 파일을 찾겠다.
app.use(express.static('public'));

// bodyparser middleware 사용
// 사용자가 요청할 때(main.js) 마다 미들웨어가 실행됨. 
// 사용자가 보낸 post 데이터를 내부적으로 분석함.
app.use(bodyParser.urlencoded({extended : false}));

// compression middleware 사용
// 데이터의 크기를 압축해줌.
app.use(compression());

// filelist middleware 생성
app.get('*',function(request,response,next){
  // get 방식으로 들어오는 요청만 파일 목록을 불러옴.
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next(); // 그 다음에 호출되어야 할 미들웨어가 있음.
  });
})

app.use('/',indexRouter); 
app.use('/topic',topicRouter); // '/topic' 토픽 라우터 미들웨어를 적용.

// 404
app.use(function(req,res,next){
  res.status(404).send(`Sorry can't not found page`);
});

// error를 핸들링하는 미들웨어
app.use(function(err,req,res,next){
  console.error(err.status);
  res.status(500).send(`Someting broke!`);
});

app.listen(3000,()=> console.log(`Example app listening on port 3000!`))
