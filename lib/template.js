// moudle 

module.exports = {
    html:function (title,list,body,control){
        return `
        <!doctype html>
        <html>
            <head>
                <title>WEB1 - ${title} </title>
                <meta charset="utf-8">
            </head>
            <body>
                <h1><a href="/">WEB2</a></h1>
                <a href="/authors">authors</a>
                ${list}
                ${control}
                ${body}
            </body>
        </html>
        ` ;
    },
    list:function (topics){
        var list = '<ul>';           
        for (var i =0; i<topics.length;i++){
            list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;    
        }
        list = list +'</ul>';
        return list;
    },
    authorSelect:function (authors,author_id){ // 유저 목록 출력 템플릿
        var tag = '';
        for(var i=0; i<authors.length;i++){
            var selected = '';
            if(authors[i].id === author_id){
                selected = ' selected';
            }
            tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
        }
        
        return `
            <select name = "author">
                ${tag}
            </select>
            `;
    },
    authorList:function(authors){
        var tag = `<table border="1">`;

        for(var i =0; i<authors.length; i++){
            tag+=`
            <tr>
                <td>${authors[i].name}</td>
                <td>${authors[i].profile}</td>
                <td><a href="/author/update?id=${authors[i].id}">update</></td>
                <td>delete</td>
            </tr>
            `
        }
        tag += `</table>`;
        return tag;
    }

}

