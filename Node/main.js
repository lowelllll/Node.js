var http = require('http');
var fs = require('fs');
var url = require('url');

var template = require('./lib/template.js');
var db = require('./lib/db');
var topic = require('./lib/topic');
var auth = require('./lib/auth');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;

    if(pathname === '/') {
        if(queryData.id === undefined){ // home
            topic.home(request, response);
        }else {
            topic.page(request, response);
        }
    }else if(pathname === '/create'){
        topic.create(request,response);
    } else if(pathname === '/create_process'){
        topic.create_process(request,response);
    }else if(pathname ==='/update'){
        topic.update(request,response);
    }else if(pathname === '/update_process'){
        topic.update_process(request,response);
    }else if(pathname === '/delete_process'){
        topic.delete_process(request,response);
    }else if(pathname === '/authors'){
        auth.home(request,response);
    }else if(pathname === '/author/create_process'){
        auth.create_process(request,response);
    }else if(pathname === '/author/update'){
        auth.update(request,response);
    }else if(pathname === '/author/update_process'){
        auth.update_process(request,response);
    }else if(pathname === '/author/delete_process'){
        auth.delete_process(request,response);
    }else {
        response.writeHead(404);
        response.end("Not found");
    }
});

app.listen(3000);
