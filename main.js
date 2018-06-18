var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var db = mysql.createConnection({ // db connect
    host:'localhost',
    user:'root',
    password:'',
    database:'opentutorials'
});

db.connect(); // db 접속

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname;

    if(pathname === '/') {
        if(queryData.id === undefined){ // home
            db.query(`SELECT * FROM topic`, function(error,result){
                var title = 'Welcome';
                var list = template.list(result);
                var description = 'Hello, Node.js';
                
                var html = template.html(title,list,`<h2>${title}</h2>${description}`,
                `<a href="/create">create</a>`
                )   
        
                response.writeHead(200);
                response.end(html);
            });
        }else {
            // detail 
            // fs.readdir('./data', function(err,filelist){
            //     var filterdId = path.parse(queryData.id).base; // 보안
            //     fs.readFile(`data/${filterdId}`,'utf-8',function (err,description) {
            //         var title = queryData.id;
                    
            //         // XSS 보안
            //         var sanitizeTitle = sanitizeHtml(title);
            //         var sanitizeDescription = sanitizeHtml(description);

            //         var list = template.list(filelist);
            //         var html = template.html(sanitizeTitle,list,`<h2>${sanitizeTitle}</h2>${sanitizeDescription}`,
            //         `<a href="/create">create</a> 
            //          <a href="/update?id=${sanitizeTitle}">update</a> 
            //         <form action="delete_process" method="post">
            //             <input type="hidden" name="id" value="${sanitizeTitle}">
            //             <input type="submit" value="delete">
            //         </form>
            //          `
            //         );

            //         response.writeHead(200);
            //         response.end(html);  // 사용자가 접속한 url에 따라 파일을 읽어와줌.
            //     });    
            // });
            db.query(`SELECT * FROM topic`, function(error,result){
                if(error){
                    throw error;
                }
               db.query(`SELECT * FROM topic WHERE id =?`,[queryData.id],function (error2,topic){
                if(error2){
                    throw error2;
                }
                var title = topic[0].title;
                var list = template.list(result);
                var description = topic[0].description;
                
                var html = template.html(title,list,`<h2>${title}</h2>${description}`,
                `<a href="/create">create</a> 
                <a href="/update?id=${queryData.id}">update</a> 
                <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
        </form>
    `
                )   
                
                response.writeHead(200);
                response.end(html);
               })
            });

        }
    }else if(pathname === '/create'){
        // create 
        db.query(`SELECT * FROM topic`, function(error,result){
            var title = 'CREATE';
            var list = template.list(result);            
            var html = template.html(title,list,
            `        
                <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `,
            ''
            )   
    
            response.writeHead(200);
            response.end(html);
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
            
            db.query(`INSERT INTO topic (title,description,created,author_id)
                VALUES (?, ?, NOW(), ?)`,
                [post.title,post.description,1],
                function(error,result){
                    if(error) {
                        throw error;
                    }
                    response.writeHead(302,{Location:`/?id=${result.insertId}`});
                    response.end();
                    
            });
        });
    }else if(pathname ==='/update'){
        // update 

        fs.readdir('./data', function(err,filelist){
            var filterdId = path.parse(queryData.id).base;
            fs.readFile(`data/${filterdId}`,'utf-8',function (err,description) {
                var title = queryData.id;
                var list = template.list(filelist);
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
            var filterId = path.parse(post.id).base;
            fs.unlink(`data/${filterdId}`, function(error){
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
