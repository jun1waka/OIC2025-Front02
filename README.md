# OIC2025-Front02
# 演習課題： JavaScriptで「神経衰弱」ゲームを作成しよう！

このドキュメントでは、HTML、CSS、JavaScriptを使い、パソコンのブラウザで遊べる「神経衰弱」ゲームを開発する手順を詳しく解説します。JavaScriptの基本から、DOM操作、イベント、アルゴリズムまで、段階的に学習していきましょう。

## 「神経衰弱」とはどんなゲーム？

神経衰弱（しんけいすいじゃく）は、記憶力を使うカードゲームです。英語では "Concentration" や "Memory" とも呼ばれます。

### 基本のルール
1.  全てのカードを、裏向きにしてテーブルに広げます。
2.  プレイヤーは、順番に2枚のカードを選んで、表にめくります。
3.  もし、2枚のカードの数字が同じだったら、ペア成功です。そのカードは表のままにします。
4.  もし、数字が違っていたら、カードはまた裏向きに戻ります。
5.  全てのカードのペアを見つけたら、ゲームクリアです。

---

## 準備：プロジェクトのセットアップ

まず、ゲームを作るためのファイルを準備しましょう。

### ファイルの構成
```
.
├── index.html
├── css/
│   └── style.css
└── js/
    └── app.js
```

### 1. index.html
このHTMLコードをコピーして、`index.html`ファイルに保存してください。

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="css/style.css">
<title>神経衰弱</title>
</head>
<body>
  <div id = 'message'>　</div>
  <!--メインとなるテーブル要素-->
  <table id="table" border="1"></table>
  <button type='button' id = 'help'>助けて</button>
<script src="js/app.js"></script>
</body>
</html>
```

### 2. css/style.css
このCSSコードをコピーして、`css/style.css`ファイルに保存してください。

```css
/* style.cssは何もなくても動きます */
td {
    cursor: pointer; /* マウスのカーソルを指のマークにします */
}
```

---

## Step 1: トランプの準備とシャッフル

**目標**: ゲームで使う52枚のカードのデータを作成し、ランダムに並び替える機能を作ります。

### 1. まず考えてみよう
* カード1枚のデータには、どんな情報が必要でしょうか？（例：模様、数字…）
* 52枚のカードデータを効率よく作るには、どういう方法がありますか？ `for`ループが使えそうですね。
* 配列に入れたカードをシャッフル（順番をバラバラに）するには、どんなアルゴリズムが必要だと思いますか？

### 2. プログラミングの考え方
* **カードのデータ構造**: 1枚のカードは「模様」や「数字」など、複数の情報を持っています。このような、関連するデータをまとめるには **オブジェクト** が便利です。`{}`を使い、その中に必要な情報を「キー」と「値」のペアで保存します。
* **カードの生成とシャッフル**: 52枚のカードを作るには、`for`ループを2つ使う（二重ループ）と効率的です。外側のループで「模様」を4回繰り返し、内側のループで「数字」を1から13まで繰り返します。カードをシャッフルするには、有名なアルゴリズムに「フィッシャー・イェーツのシャッフル」があります。

### 3. カードを作成して、シャッフルする（コード例）
`js/app.js`に以下のコードを記述します。

```javascript
// js/app.js

// カードのデータを保存する配列
const cards = [];
const card_type = ['&spades;', '&diams;', '&hearts;', '&clubs;'];

// forループを使って、52枚のカードを作成します
for (let i = 0; i < card_type.length; i++) {
  for (let j = 1; j <= 13; j++) {
    cards.push({
      type: card_type[i],
      num: j,
      isopen: false, // カードが表か裏か
      ispair: false  // カードがペアになったか
    });
  }
}

// カードをシャッフルする関数
function shuffle() {
  let i = cards.length;
  while (i) {
    let swap_idx = Math.floor(Math.random() * i--);
    // 配列の要素を交換
    let tmp = cards[i];
    cards[i] = cards[swap_idx];
    cards[swap_idx] = tmp;
  }
}

// シャッフルを実行します
shuffle();

// コンソールでデータを確認してみましょう
console.log(cards);
```

---

## Step 2: カードを画面に表示する

**目標**: 作成したカードのデータを元に、HTML要素をプログラムで作成し、画面に表示します。

### 1. まず考えてみよう
* JavaScriptでHTMLの要素（`<tr>`や`<td>`）を新しく作るには、どの命令を使いますか？
* 作成したHTML要素を、画面の`<table>`の中に追加するにはどうすればいいでしょうか？
* ゲームが始まったら、少し時間をおいてからカードを全部裏返すには、どういう命令が必要ですか？

### 2. プログラミングの考え方
* **HTML要素の動的な作成**: JavaScriptからHTMLを操作することを **DOM操作** と言います。`document.createElement('タグ名')` で新しいHTML要素を作成し、親要素に対して `appendChild()` を使って追加します。
* **カードを裏返すタイミング**: 「X秒後に処理を行う」というような時間差の処理には `setTimeout(実行したい関数, ミリ秒)` を使います。

### 3. カードを表示する（コード例）
`js/app.js`の続きに、以下のコードを追加します。

```javascript
// js/app.js （続き）

const table = document.getElementById('table');

// ループを使ってテーブルを作成し、カードを並べます
let count = 0;
for (let i = 0; i < card_type.length; i++) {
  let tr = document.createElement('tr');
  for (let j = 0; j < 13; j++) {
    let td = document.createElement('td');
    let d_card = cards[count];

    td.id = count;
    td.style.width = '1.5em';
    td.style.textAlign = 'center';
    td.innerHTML = d_card.type + '<br>' + d_card.num;
  
    // 模様で色を分けます
    if (d_card.type === '&spades;' || d_card.type === '&clubs;') {
      td.style.color = 'black';
    } else {
      td.style.color = 'red';
    }
    
    tr.appendChild(td);
    count++;
  }
  table.appendChild(tr);
}

// 5秒後に、全てのカードを裏にします
setTimeout(function() {
  for (let i = 0; i < 52; i++) {
    let td = document.getElementById(i);
    td.innerHTML = '**<br>**';
    td.style.color = 'green';
  }
}, 5000);
```

---

## Step 3: カードをクリックする機能を作る

**目標**: プレイヤーがカードをクリックした時の動作を作成します。

### 1. まず考えてみよう
* クリックしたカードを「表」から「裏」へ、またはその逆へ切り替えるには、どんな情報が必要ですか？ (カードの`isopen`プロパティが使えそうですね)
* HTMLの要素がクリックされたことを知るには、どういう命令を使いますか？

### 2. プログラミングの考え方
* **イベント処理**: ユーザーの操作（クリックなど）によって処理を開始する仕組みを **イベント処理** と言います。`要素.addEventListener('イベントの種類', 実行する関数)` を使います。
* **関数の役割**: カードをめくる処理は何度も使います。このような同じ処理は **関数** にまとめるとコードが整理され、分かりやすくなります。

### 3. カードをめくる機能を作る（コード例）
まず、カードをめくるための`flip`関数を`js/app.js`の始めの方に追加します。

```javascript
// js/app.js の始めの方に、flip関数を追加します

function flip(count) {
  let el = document.getElementById(count);
  let d_card = cards[count];

  if (d_card.isopen) { // もしカードが表なら、裏にします
    el.innerHTML = '**<br>**';
    el.style.color = 'green';
    d_card.isopen = false;
  } else { // もしカードが裏なら、表にします
    el.innerHTML = d_card.type + '<br>' + d_card.num;
    if (d_card.type === '&spades;' || d_card.type === '&clubs;') {
      el.style.color = 'black';
    } else {
      el.style.color = 'red';
    }
    d_card.isopen = true;
  }
}
```
次に、Step 2のテーブル作成ループの中（`tr.appendChild(td);` の前）に、クリックイベントを追加します。

```javascript
// Step 2のループ内
    td.addEventListener('click', function() {
      flip(this.id);
    });
    
    tr.appendChild(td);
// ...
```

---

## Step 4: ペアを判定する機能を作る

**目標**: 2枚のカードをめくった時、それがペアかどうかを調べるプログラムを完成させます。

### 1. まず考えてみよう
* 1枚目にめくったカードと、2枚目にめくったカードを、プログラムはどうやって区別すればいいでしょうか？ (1枚目の情報を一時的に保存しておく変数が必要ですね)
* ペアだった時と、ペアではなかった時で、処理を分けるにはどうしますか？
* ペアではなかった時、少し時間をおいてからカードを裏に戻すには、どの命令を使いますか？

### 2. プログラミングの考え方
* **状態を管理する変数**: 「1枚目のカードをめくった状態」を覚えておく必要があります。このようなプログラムの現在の状況を保存しておく変数を **状態変数** と呼びます。
* **ロジックの流れ**: クリックされたカードがめくって良いか確認し、1枚目か2枚目かを判断します。2枚目なら数字を比較し、結果に応じて処理を分け、最後に状態をリセットします。

### 3. ペア判定のロジックを作る（コード例）
`js/app.js`のグローバル領域に状態変数を定義し、Step 3で追加した`addEventListener`の中身を、以下のように全て書き換えます。

```javascript
// js/app.js のグローバル領域に、1枚目のカードを保存する変数を定義します
let firstid = -1;

// ペアかどうかをチェックする関数を作成します
function checkPair(firstid, secondid) {
  return cards[firstid].num === cards[secondid].num;
}

// Step 3で追加した addEventListener の中身を、以下のように全て書き換えます
td.addEventListener('click', function() {
  let count = this.id;

  // 既にペアになっているカードや、同じカードをクリックした場合は何もしない
  if (cards[count].ispair || count == firstid) {
    return;
  }
  
  flip(count); // カードをめくる

  if (firstid < 0) {
    // 1枚目のカードをクリックした時の処理
    firstid = count;
  } else {
    // 2枚目のカードをクリックした時の処理
    if (checkPair(firstid, count)) {
      // ペアだった時の処理
      document.getElementById('message').innerHTML = 'ペアができた';
      cards[firstid].ispair = true;
      cards[count].ispair = true;
    } else {
      // ペアじゃなかった時の処理
      document.getElementById('message').innerHTML = 'ペアじゃない';
      let wk_firstid = firstid;
      setTimeout(function() {
        flip(wk_firstid);
        flip(count);
        document.getElementById('message').innerHTML = '　';
      }, 1000); // 1秒後に裏に戻す
    }
    // 状態をリセット
    firstid = -1; 
  }
});
```

---

## Step 5: ヘルプ機能を作る

**目標**: プレイヤーを助ける「ヘルプボタン」を作成します。

### 1. まず考えてみよう
* 「助けて」ボタンが押されたら、どんな動作をさせたいですか？
* この機能を3回だけ使えるようにするには、どうやって回数を数えて、制限すればいいですか？

### 2. プログラミングの考え方
* **カウンター変数**: 「あと何回使えるか」を数えるには、 **カウンター変数** を使います。
* **既存の機能を再利用する**: 全てのカードをめくる処理は、すでにある`flip`関数を`for`ループの中で呼び出すことで実現できます。

### 3. ヘルプ機能を作る（コード例）
`js/app.js`の最後に、ヘルプボタンの動作を追加します。

```javascript
// js/app.js の最後に加えます

const help = document.getElementById('help');
let help_count = 3;

help.addEventListener('click', function() {
  if (help_count <= 0) {
    return;
  }

  // 裏を向いているカードを、一時的に全部表にします
  for (let i = 0; i < 52; i++) {
    if (!cards[i].isopen) {
      flip(i);
    }
  }

  // 3秒後に、元に戻します
  setTimeout(function() {
    for (let i = 0; i < 52; i++) {
      // ペアになっていなくて、今、表を向いているカードだけ裏にします
      if (!cards[i].ispair && cards[i].isopen) {
        flip(i);
      }
    }
  }, 3000);

  help_count--;
  help.innerHTML = '助けて：のこり' + help_count + '回';

  if (help_count <= 0) {
    help.style.display = 'none';
  }
});
```

---

お疲れ様でした！ これで神経衰弱ゲームは完成です。 プログラムがうまく動かなくて困った時は、`console.log`を使い、変数の中身がどうなっているか確認しながら進めると、分かりやすいですよ。頑張ってください！ 🚀
