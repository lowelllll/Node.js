const express = require('express')
const app = express()
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var qs = require('querystring');
var bodyParser = require('body-parser');
var compression = require('compression');

// bodyparser middleware 사용
// 사용자가 요청할 때(main.js) 마다 미들웨어가 실행됨. 
// 사용자가 보낸 post 데이터를 내부적으로 분석함.
app.use(bodyParser.urlencoded({extended : false}));

// compression middleware 사용
// 데이터의 크기를 압축해줌.
app.use(compression());

// get 메소드를 받는 함수
app.get('/',function (request,response){ 
  fs.readdir('./data', function(error, filelist){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.send(html);
  });
});

// url parameter를 받음.
app.get('/page/:pageId',function(request,response){
  var pageId = request.params['pageId'];
  fs.readdir('./data', function(error, filelist){
    var filteredId = path.parse(pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = pageId;
      var sanitizedTitle = sanitizeHtml(title);
      var sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      var list = template.list(filelist);
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
    });
  });
})


app.get('/create',function(request,response){
  fs.readdir('./data', function(error, filelist){
    var title = 'WEB - create';
    var list = template.list(filelist);
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
  fs.readdir('./data', function(error, filelist){
    var filteredId = path.parse(pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = pageId;
      var list = template.list(filelist);
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



app.listen(3000,()=> console.log(`Example app listening on port 3000!`))
