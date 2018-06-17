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
    }

}

