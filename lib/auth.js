var db = require('./db');
var template = require('./template.js');

exports.home = function(request,response) {
    db.query(`SELECT * FROM topic`, function(error,result){
        db.query(`SELECT * FROM author`,function(error2,authors){
    
        var title = 'Auth';
        var list = template.list(result);
        var description = 'Hello, Node.js';
        
        var html = template.html(title,list,
        `
            ${template.authorList(authors)}
        `,
        ``
        );   

        response.writeHead(200);
        response.end(html);
        });
    });
}