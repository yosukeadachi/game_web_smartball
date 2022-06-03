# game_web_smartball
Webゲーム　スマートボール

---
# 開発時
## 準備
dockerをインストール

### 開発環境dockerを起動
```
$ cd tools/docker/develop
$ docker compose up -d
```

### 開発環境dockerへログイン
```
$ docker compose exec smartball-dev sh
```

### 初回環境インストール(最初だけ)
```
/prj # yarn
```

### 開発サーバー起動
```
/prj # yarn dev
```

### 開発サーバー確認方法
http://localhost:3000

### 開発サーバー停止
ctrl + c

### 開発環境dockerからログアウト
```
/prj # exit
```

### 開発環境dockerを停止
```
$ docker compose down
```

### 開発終了時
```
$ docker compose down --rmi all --volumes --remove-orphans
```
上記コマンドでimageなどもろもろ削除します