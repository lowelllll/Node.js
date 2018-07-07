const express = require('express');
var router = express.Router();
var fs = require('fs');
var template = require('../lib/template.js');
var qs = require('querystring');

// get 메소드를 받는 함수
// 두번째 인자인 콜백은 미들웨어.
router.get('/',function (request,response){ 
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}
      <img src="/images/hello.jpg" style="width:300px; display:block;"> 
      `
      ,
      `<a href="/topic/create">create</a>`
    );
    response.send(html);
  });
  
  module.exports = router;