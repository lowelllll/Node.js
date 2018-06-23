var db = require('./db');
var template = require('./template.js');
var qs = require('querystring');


exports.home = function(request,response) {
    db.query(`SELECT * FROM topic`, function(error,result){
        db.query(`SELECT * FROM author`,function(error2,authors){
    
        var title = 'Auth';
        var list = template.list(result);
        var description = 'Hello, Node.js';
        
        var html = template.html(title,list,
        `
            ${template.authorList(authors)}

            <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description"></textarea>
                </p>
                <p>
                <input type="submit">
                </p>
            </form>
        `,
        ``
        );   

        response.writeHead(200);
        response.end(html);
        });
    });
}

exports.create_process = function(request,response){
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
        
        db.query(`INSERT INTO author (name,profile)
            VALUES (?, ?)`,
            [post.name,post.profile],
            function(error,result){
                if(error) {
                    throw error;
                }
                response.writeHead(302,{Location:`/authors`});
                response.end();
        });
    });
}