> Tourismap
# data-collection

## 使い方
1. 
```
git submodule init
git submodule update
git submodule foreach git pull origin master
```
を実行
1. `.envtemplate`を`.env`にリネーム
1. `.env`を書く
1. `npm run build`を実行
1. `npm run start`

> SQLiteの場合 DB_DIALECT=sqliteに，DB_STORAGEにファイルの保存場所を書く

> MySQLの場合 DB_DIALECT=mysqlに，DB_HOST, DB_PORT, DB_USER, DB_PASSを書く

## sshトンネルを使ってMySQLに繋ぐ場合
```javascript:config.js
// config.js

{
  ...
  useTunnel: true,
  tunnel: {
    username: '<ひ・み・つ>',
    host: '<ひ・み・つ>',
    port: <ひ・み・つ>,
    privateKey: fs.readFileSync('<秘密鍵>'),
    dstHost: 'mysql',
    dstPort: 3306,
    localPort: 13306,
    keepAlive: 2000,
  },
}
```

```text:.env
// .env

...
DB_HOST=localhost
DB_PORT=13306
DB_USER=<ユーザー名>
DB_PASS=<パスワード>
DB_DIALECT=mysql
```
のようにする
