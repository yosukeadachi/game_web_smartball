# delaunator tool
path 文字列からドローネ三角分割頂点座標をもとめるツール

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
$ docker compose exec delaunator zsh
```

### 初回環境インストール(最初だけ)
```
/prj # npm install
```

### 起動
```
/prj # npm start
```

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