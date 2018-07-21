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
