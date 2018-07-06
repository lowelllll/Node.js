const express = require('express')
const app = express()
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');

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



// get 메소드를 받는 함수
// 두번째 인자인 콜백은 미들웨어.
app.get('/',function (request,response){ 
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `<h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width:300px; display:block;"> 
    `
    ,
    `<a href="/create">create</a>`
  );
  response.send(html);
});

// url parameter를 받음.
app.get('/page/:pageId',function(request,response,next){
  var pageId = request.params['pageId'];
  var filteredId = path.parse(pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    if(!err){
      var title = pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      var list = template.list(request.list);
      var html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
          <a href="/update/${sanitizedTitle}">update</a>
          <form action="/delete" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      response.send(html);
    }else{
      next(err);
      // 해당 파일이 없을 경우 맨 밑의 error 미들웨어로 넘어감
      // next(),next('route')외 미들웨어는 에러 미들웨어로 처리함. 
    }
    
  });
})

app.get('/create',function(request,response){
  var title = 'WEB - create';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `, '');
  response.send(html);

});

app.post('/create_process',function(request,response){
  var post = request.body; // bodyParser 사용
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(`/page/${title}`);
      });
  
  /*
  var body = '';
  request.on('data', function(data){ // 데이터가 추가될 때 마다 호출
      body = body + data;
  });
  request.on('end', function(){ // end 이벤트가 발생했을 때 
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(`/page/${title}`);
      })
  });
  */
});

app.get('/update/:pageId',function(request,response){
  var pageId = request.params['pageId'];
  var filteredId = path.parse(pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    var title = pageId;
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
      <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
      `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
    );
    response.send(html);
  });
})

app.post('/update_process',function(request,response){
  var post = request.body;
  var id = post.id;
  var title = post.title;
  var description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function(error){
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.redirect(`/page/${title}`);
    })
  });
      
})

app.post('/delete',function(request,response){
  var post = request.body;
  var id = post.id;
  var filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function(error){
    response.redirect('/');
  })
})

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
