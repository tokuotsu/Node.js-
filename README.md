# practice_Node.js

## Chapter 1

インストール

`https://nodejs.org/ja/`

## Chapter 2

* `require('モジュール名')`でインポート

* 関数の書き方

  ```js
  function(a, b){
    処理
  }
  //　と
  (a, b)=>{
    処理
  }
  //  はやっていること一緒
  ```

* http.ServerResponseメソッド

  ```javascript
  // ヘッダ情報を設定する
  response.setHeader(名前, 値)
  // ヘッダ情報を得る
  response.getHeader(名前)
  // ヘッダ情報を設定する
  response.writeHeader(コード番号, メッセージ)
  ```

* 同期処理と非同期処理

  * 同期処理

    命令が終わってから次の処理をする

  * 非同期処理

    重いものは後で処理。コールバック関数が必要

* npm(node package manager)

  ```bash
  npm install パッケージ名
  ```

  