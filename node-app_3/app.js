const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const url = require('url'); // クライアントがどうやってアクセスしてきたかを知る
const qs = require('querystring')

const index_page = fs.readFileSync('./index.ejs', 'utf-8'); // 同期処理
const other_page = fs.readFileSync('./other.ejs', 'utf-8');
const other_page2 = fs.readFileSync('./other2.ejs', 'utf-8');
const style_css = fs.readFileSync('./style.css', 'utf-8');
var server = http.createServer(getFromClient);

server.listen(3000);
console.log('Server start!');
// switch('other'){
//     case 'other':
//         console.log('other');
//         break
//     case 'other2':
//         console.log('other2');
//         break;
//     default:
//         console.log('default')
// }
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
        case '/other2':
            response_other2(request, response);
            break
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
};

var data2 = {
    'Taro': ['taro@yamada', '090-999-999', 'Tokyo'],
    'Hanako': ['hanako@flower', '080-888-888', 'Yokohama'],
    'Sachiko': ['sachi@happy', '070-777-777', 'Nagoya'],
    'Ichiro': ['ichi@baseball', '060-666-666', 'USA'],
};

var data_ = {msg: 'no message...'};

function response_index_old(requst, response){
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

function response_index(request, response){
    if(request.method == "POST"){
        var body = "";
        request.on('data', (data)=>{
            body += data;
        });
        request.on('end', ()=>{
            console.log('body', body)
            data_ = qs.parse(body);
            // クッキーの保存
            console.log('data_.msg', data_.msg)
            setCookie('msg', data_.msg, response);
            write_index(request, response);
        });
    }else{
        write_index(request, response);
    }
}

function write_index(request, response){
    var msg = "※伝言を表示します。"
    var cookie_data = getCookie('msg', request);
    var content = ejs.render(index_page, {
        title: "Index",
        content: msg,
        data: data,
        data_: data_,
        filename: 'data_item',
        cookie_data: cookie_data
    });
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(content);
    response.end();
}

// クッキーの値を設定
function setCookie(key, value, response){
    var cookie = escape(value); // escapeでクッキーに保存できる形式に変換する
    response.setHeader('Set-Cookie', [key + '=' + cookie])
}

// クッキーの値を取得
function getCookie(key, request){
    // 三項演算子
    // 変数 = 条件 ? 値1 : 値2;
    // 条件がtrueなら値1, falseなら値2
    var cookie_data = request.headers.cookie != undefined ? request.headers.cookie : '';
    var data = cookie_data.split(';');
    console.log(data)
    for (var i in data){
        console.log(i);
        if (data[i].trim().startsWith(key + '=')){ // trim()で前後の空白を削除
            var result = data[i].trim().substring(key.length + 1); // key.length+1からとる
            console.log("1")
            return unescape(result);
        }
    }
    console.log("2")
    return '';
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

function response_other2(request, response){
    var msg = "これはOtherページ2です";
    var content = ejs.render(other_page2, {
        title: "Other2",
        content: msg,
        data: data2,
        filename: 'data_item'
    });
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(content);
    response.end();
}