const express = require('express');
var router = express.Router(); // router를 반환해야함.
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');

// path = /topic/create
router.get('/create',function(request,response){
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <form action="/topic/create_process" method="post">
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
  
router.post('/create_process',function(request,response){
    var post = request.body; // bodyParser 사용
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.redirect(`/topic/${title}`);
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
  
router.get('/update/:pageId',function(request,response){
    var pageId = request.params['pageId'];
    var filteredId = path.parse(pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      var title = pageId;
      var list = template.list(request.list);
      var html = template.HTML(title, list,
        `
        <form action="/topic/update_process" method="post">
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
        `<a href="/create">create</a>`
      );
      response.send(html);
    });
  });
  
router.post('/update_process',function(request,response){
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.redirect(`/topic/${title}`);
      })
    });
        
  })
  
router.post('/delete',function(request,response){
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function(error){
      response.redirect('/');
    })
  })
  
  // url parameter를 받음.
router.get('/:pageId',function(request,response,next){
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
          ` <a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete" method="post">
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
  });

  module.exports = router; 