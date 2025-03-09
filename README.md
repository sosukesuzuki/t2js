# t2js

test262のテストを実行可能なJavaScriptに変換するCLIツール。

## インストール

```bash
npm install -g t2js
```

## 使い方

環境変数 `LOCAL_TEST262_DIR` でtest262のディレクトリを指定し、テストファイルを変換します：

```bash
export LOCAL_TEST262_DIR=/path/to/test262
t2js test/built-ins/Array/prototype/sort/S15.4.4.11_A1.1_T1.js
```

### 出力

変換されたJavaScriptが標準出力に出力されます。このJavaScriptには以下のファイルが含まれます：

1. デフォルトで含まれるharnessファイル
   - `assert.js`
   - `sta.js`
2. テストファイルのメタデータで指定された追加のharnessファイル
3. テストファイルの本体（メタデータを除く）

## 開発

```bash
# 依存関係のインストール
npm install

# 開発用にリンク
npm link
```

## ライセンス

ISC 