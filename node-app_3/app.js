const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url'); // クライアントがどうやってアクセスしてきたかを知る
const qs = require('querystring')

const index_page = fs.readFileSync('./index.ejs', 'utf-8'); // 同期処理
const other_page = fs.readFileSync('./other.ejs', 'utf-8');
const style_css = fs.readFileSync('./style.css', 'utf-8');
var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');

/*
function getFromClient(request, response){

    var url_parts = url.parse(request.url, true); // trueでクエリもパースしてくれる
    switch (url_parts.pathname){
        case '/':
            var content = "これはIndexページです。"
            var query = url_parts.query;
            if (query.msg != undefined){
                content += 'あなたは、「' + query.msg + '」と送りました';
            }
            var content = ejs.render(index_page, {
                title: "Index",
                content: content,
            });
            response.writeHead(200, { 'Content-Type': 'text/html'});
            response.write(content);
            response.end();
            break;
        default:
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('no page...');
            break;
    }
}
*/

function getFromClient(request, response){
    var url_parts = url.parse(request.url, true);
    switch (url_parts.pathname){
        case '/':
            response_index(request, response);
            break;
        case '/other':
            response_other(request, response);
            break;
        case '/style.css':
            response.writeHead(200, {'Content-Type': 'text/css'});
            response.write(style_css);
            response.end();
            break;
        default:
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('no page...');
            break;
    }
}

var data = {
    'Taro': '090-999-999',
    'Hanako': '080-888-888',
    'Sachiko': '070-777-777',
    'Ichiro': '060-666-666'
}

function response_index(requst, response){
    var msg = "これはIndexページです";
    var content = ejs.render(index_page, {
        title: "Index",
        content: msg,
        data: data,
        filename: 'data_item'
    });
    response.writeHead(200, {'Content-Type':'text/html'});
    response.write(content);
    response.end();
}

function response_other(request, response){
    var msg = "これはOtherページです。";
    // 同じOtherページでもGETかPOSTかで内容が変わる
    if (request.method == 'POST'){
        var body = '';
        // dataはクエリ―テキストで送られてくる
        request.on('data', (data) => {
            body += data;
        });

        request.on('end', () => {
            var post_data = qs.parse(body);
            msg += 'あなたは、「' + post_data.msg + `」と書きました。`
            var content = ejs.render(other_page, {
                title: 'Other',
                content: msg
            });
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(content);
            response.end();
        });
    } else {
        var msg = "ページがありません。";
        var content = ejs.render(other_page, {
            title: "Other",
            content: msg
        });
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(content);
        response.end();
    }
}