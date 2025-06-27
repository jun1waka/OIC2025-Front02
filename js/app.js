// --- グローバル変数の定義 ---
// プログラム全体で使う変数を、ここで準備します。

// 52枚全てのカードのデータを保存する配列
const cards = []; 
// カードの模様（スート）の種類
const card_type = ['&spades;', '&diams;', '&hearts;', '&clubs;'];
// ループなどで使う、汎用的なカウンター変数
let count = 0;
// ヘルプ機能を使える残り回数
let help_count = 3;
// 1枚目にめくったカードのIDを保存するための変数。-1は、まだ何もめくられていない状態を表します。
let firstid = -1;
// 2枚目をめくった状態を保存する変数。
let isTwoCardsOpen = false;

// --- カードの初期化 ---
// 4種類の模様と13個の数字を組み合わせて、52枚のカードオブジェクトを作成し、`cards`配列に入れます。
console.log('--- カードの生成を開始 ---');
for (let i = 0; i < card_type.length; i++) { // 模様のループ (4回)
  for (let j = 1; j <= 13; j++) { // 数字のループ (13回)
    // カードオブジェクトを作成
    cards[count] = {
      type: card_type[i], // 模様
      num: j,             // 数字
      isopen: false,      // 表になっているか (初期値: false)
      ispair: false       // ペアがそろっているか (初期値: false)
    };
    // console.log(count + ': type:' + cards[count].type + ' num:' + cards[count].num);
    count++; // 次のインデックスへ
  }
}
console.log('--- カードの生成が完了 ---');


// --- カードをシャッフルする関数 ---
function shuffle() {
  let i = cards.length; // i にカードの枚数(52)をセット
  // フィッシャー・イェーツのシャッフルアルゴリズム
  while (i) {
    // 0からi-1までのランダムなインデックスを生成
    let swap_idx = Math.floor(Math.random() * i--);
    // i番目の要素と、ランダムに選んだswap_idx番目の要素を交換する
    let tmp = cards[i];
    cards[i] = cards[swap_idx];
    cards[swap_idx] = tmp;
  }
}

// ゲーム開始前に、カードをシャッフルする
shuffle();
console.log('--- カードをシャッフルしました ---');


// --- HTML要素の取得 ---
// JavaScriptからHTMLを操作するために、IDを指定して要素を取得します。
const message = document.getElementById('message'); // メッセージ表示用のdiv要素
const table = document.getElementById('table');     // カードを並べるためのtable要素


// --- カードを画面に表示 ---
// `cards`配列のデータを元に、`<td>`要素を動的に作成し、テーブルに並べます。
count = 0; // カウンターをリセット
for (let i = 0; i < card_type.length; i++) { // 行のループ (4回)
  let tr = document.createElement('tr'); // <tr>要素（テーブルの行）を作成
  for (let j = 1; j <= 13; j++) { // 列のループ (13回)
    let td = document.createElement('td'); // <td>要素（テーブルのセル/カード）を作成
    let d_card = cards[count]; // 表示するカードのデータを取得
    
    // td要素に属性やスタイルを設定
    td.className = 'card';          // CSSのためのクラス名
    td.id = count;                  // どのカードか識別するためのID
    td.innerHTML = d_card.type + '<br>' + d_card.num; // カードの模様と数字を表示
    td.style.width = '1.5em';
    td.style.textAlign = 'center';
    
    // 模様によって文字の色を変える
    switch (d_card.type) {
      case '&spades;':
      case '&clubs;':
        td.style.color = 'black';
        break;
      case '&diams;':
      case '&hearts;':
        td.style.color = 'red';
    }

    // --- クリックイベントの設定 ---
    // 各カード（td要素）がクリックされた時の処理を登録します。
    td.addEventListener('click', function() {
      let clicked_id = this.id; // クリックされたカードのIDを取得
      
      // もし既にペアが成立しているカードなら、何もしないで処理を終了
      if (cards[clicked_id].ispair || 
          clicked_id == firstid    ||
          isTwoCardsOpen) {
        return;
      }
      
      // カードをめくる
      flip(clicked_id);
      
      if (firstid < 0) {
        // 【1枚目のカードをめくった時の処理】
        // firstidに、めくったカードのIDを保存
        firstid = clicked_id;
      } else {
        // 【2枚目のカードをめくった時の処理】
        isTwoCardsOpen = true;
        if (checkPair(firstid, clicked_id)) {
          // ** ペアだった時の処理 **
          message.innerHTML = 'ペアができた';
          cards[firstid].ispair = true;
          cards[clicked_id].ispair = true;
          isTwoCardsOpen = false;
        } else {
          // ** ペアではなかった時の処理 **
          message.innerHTML = 'ペアじゃない';
          let wk_firstid = firstid; // setTimeoutの中で使うために、一時的にIDを保存
          setTimeout(function() {
            // 1秒後に、2枚のカードを裏に戻す
            flip(wk_firstid);
            flip(clicked_id);
            message.innerHTML = '　'; // メッセージを消す
            isTwoCardsOpen = false;
          }, 1000);
        }
        // 次のペア探しの為に、firstidをリセットする
        firstid = -1;
      }
    });

    tr.appendChild(td); // 行(tr)にセル(td)を追加
    count++; // カウンターを増やす
  }
  table.appendChild(tr); // テーブルに作った行(tr)を追加
}

// --- ゲーム開始の演出 ---
// 5秒後に、全てのカードを裏向きにします。プレイヤーがカードの場所を覚えるための時間です。
setTimeout(function() {
  count = 0;
  for (let i = 0; i < card_type.length; i++) {
    for (let j = 1; j <= 13; j++) {
      let el = document.getElementById(count);
      el.innerHTML = '**<br>**';
      el.style.color = 'green';
      count++;
    }
  }
}, 5000);


// --- カードをめくる関数 ---
// 引数で受け取ったIDのカードを、表から裏、または裏から表へ変更します。
function flip(count) {
  let el = document.getElementById(count);
  let d_card = cards[count];

  if (d_card.isopen) {
    // もしカードが「表」なら、「裏」にする
    el.innerHTML = '**<br>**';
    el.style.color = 'green';
    d_card.isopen = false;
  } else {
    // もしカードが「裏」なら、「表」にする
    el.innerHTML = d_card.type + '<br>' + d_card.num;
    // 模様によって色を再設定
    switch (d_card.type) {
      case '&spades;':
      case '&clubs;':
        el.style.color = 'black';
        break;
      case '&diams;':
      case '&hearts;':
        el.style.color = 'red';
    }
    d_card.isopen = true;
  }
}


// --- ペアをチェックする関数 ---
// 2枚のカードのIDを引数で受け取り、数字が同じかどうかを判定します。
function checkPair(firstid, secondid) {
  let a_card = cards[firstid];
  let b_card = cards[secondid];
  
  // 2枚のカードの数字(`num`)が同じならtrue、違うならfalseを返す
  if (a_card.num == b_card.num) {
    return true;
  } else {
    return false;
  }
}


// --- ヘルプボタンの処理 ---
const help = document.getElementById('help');
help.addEventListener('click', function() {
  // 残り回数が0なら何もしない
  if(help_count <= 0){
    return;
  }

  // 裏向きのカードを全て一時的に表にする
  for (let i = 0; i < cards.length; i++) {
    if (!cards[i].isopen) {
      flip(i);
    }
  }

  // 3秒後に、ペアになっていないカードを全て裏に戻す
  setTimeout(function() {
    for (let i = 0; i < cards.length; i++) {
      if (!cards[i].ispair && cards[i].isopen) {
        flip(i);
      }
    }
  }, 3000);
  
  // ヘルプの残り回数を減らし、表示を更新する
  help_count--;
  help.innerHTML = '助けて：のこり' + help_count + '回';
  
  // もし残り回数が0になったら、ボタンを非表示にする
  if (help_count <= 0) {
    help.style.display = 'none';
  }
});
