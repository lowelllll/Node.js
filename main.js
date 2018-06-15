var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;

    if(pathname === '/') {
        if(queryData.id === undefined){
            // home 

            fs.readdir('./data', function(err,filelist){
                var title = 'Welcome';
                // var list = templateList(filelist);
                var list = template.list(filelist);
                var description = 'Hello, Node.js';

                // var template = templateHTML(title,list,`<h2>${title}</h2>${description}`,
                // `<a href="/create">create</a>`
                // ) 

                var html = template.html(title,list,`<h2>${title}</h2>${description}`,
                `<a href="/create">create</a>`
                )   
        
                response.writeHead(200);
                response.end(html);  // 사용자가 접속한 url에 따라 파일을 읽어와줌.
                                
            });
        }else {
            // detail 

            fs.readdir('./data', function(err,filelist){
                var title = queryData.id;
                var list = template.list(filelist);

                fs.readFile(`data/${title}`,'utf-8',function (err,description) {
                    var html = template.html(title,list,`<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a> 
                     <a href="/update?id=${title}">update</a> 
                    <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="submit" value="delete">
                    </form>
                     `
                    );

                    response.writeHead(200);
                    response.end(html);  // 사용자가 접속한 url에 따라 파일을 읽어와줌.
                });    
            });
        }
    }else if(pathname === '/create'){
        // create 

        fs.readdir('./data', function(err,filelist){
            var title = 'WEB - create';
            var list = template.list(filelist);

            var html = template.html(title,list,`
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `, ``);
    
            response.writeHead(200);
            response.end(html);  // 사용자가 접속한 url에 따라 파일을 읽어와줌.
                            
        });
    } else if(pathname === '/create_process'){

        var body = '';

        // post 데이터 받아오기 

        // 정보가 조각 조각 들어옴. 
        // 조각의 양을 서버쪽에서 수신할 때 마다 콜백함수를 호출함.
        request.on('data',function(data){
            body += data;
        });

        // 정보 수신이 끝난 후 호출됨.
        request.on('end',function(){
            var post = qs.parse(body); // post로 받은 데이터를 객체화.
            var title = post.title;
            var description = post.description;
            
            // file create
            fs.writeFile(`data/${title}`,description, function(err){
                response.writeHead(302,{Location:`/?id=${title}`});
                response.end();     
            });
        });
    }else if(pathname ==='/update'){
        // update 

        fs.readdir('./data', function(err,filelist){
            var title = queryData.id;
            var list = template.list(filelist);

            fs.readFile(`data/${title}`,'utf-8',function (err,description) {
                var template = template.html(title,list,
                `
                    <form action="/update_process" method="post">
                    <input type ="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value=${title}></p>
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                    </form> 
                
                `,
                `<a href="/create">create</a>  <a href="/update?id=${title}">update</a>`);

                response.writeHead(200);
                response.end(html);  // 사용자가 접속한 url에 따라 파일을 읽어와줌.
            });    
        });
    }else if(pathname === '/update_process'){
        var body = '';

        request.on('data',function(data){
            body += data;
        });

        request.on('end',function(){
            var post = qs.parse(body); 
            var id = post.id;
            var title = post.title;
            var description = post.description;
            // file update
            fs.rename(`data/${id}`,`data/${title}`, function(error){
                fs.writeFile(`data/${title}`,description, function(err){
                    response.writeHead(302,{Location:`/?id=${title}`}); // redirection 
                    response.end();     
                });
            });
        });
    }else if(pathname === '/delete_process'){
        // file delete
        var body = '';

        request.on('data',function(data){
            body += data;
        });

        request.on('end',function(){
            var post = qs.parse(body); 
            var id = post.id;
            fs.unlink(`data/${id}`, function(error){
                response.writeHead(302,{Location:'/'});
                response.end()
            })
        });
    }else {
        response.writeHead(404);
        response.end("Not found");
    }
});

app.listen(3000);
