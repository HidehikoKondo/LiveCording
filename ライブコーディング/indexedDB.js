//indexedDBの名前などを設定
const dbName = "kakeiboDB";
const storeName = "kakeiboStore";
const dbVersion = 1;

let database = indexedDB.open(dbName, dbVersion);

database.onupgradeneeded = function (event) {
    let db = event.target.result;
    db.createObjectStore(storeName, { keyPath: "id" });
    console.log("データベースを新規作成しました");
}

//フォームの内容をDBに登録する。
function regist() {
    //フォームの入力チェック
    if (inputCheck() == false) {
        return;
    }

    //ラジオボタンの取得
    let radio = document.getElementsByName("balance");
    let balance;
    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked == true) {
            balance = radio[i].value;
            break;
        }
    }

    //フォームに入力された値を取得
    let date = document.getElementById("date").value;
    let amount = document.getElementById("amount").value;
    let memo = document.getElementById("memo").value;
    let cateogry = document.getElementById("category").value;

    //ラジオボタンが収入を選択時はカテゴリを収入とする
    if (balance == "収入") {
        cateogy = "収入";
    };

    //データベースにデータを登録する
    insertData(balance, date, category, amount, memo);

}

//データの挿入
function insertData(balance, date, category, amount, memo) {
    //一意のIDを現在の日時から作成
    let uniqueID = new Date().getTime().toString();
    console.log(uniqueID);

    //DBに登録するための連想配列のデータを作成
    let data = {
        id: uniqueID,
        balance: balance,
        data: String(date),
        amount: amount,
        memo: memo,
    }

    //データベースを開く
    let database = indexedDB.open(dbName, dbVersion);

    //データベースの開けなかった時の処理
    database.onerror = function (event) {
        console.log("データベースに接続できませんでした");
    }

    //データベースを開いたら出た登録を実行
    database.onsuccess = function (event) {
        //データベースを開いたらデータの登録を実行
        let db = event.target.result;
        let transaction = db.transaction(storeName, "readwrite");
        transaction.oncomplete = function (event) {
            console.log("トランザクション完了");
        }
        transaction.onerror = function (event) {
            console.log("トランザクションエラー");
        }

        let store = transaction.objectStore(storeName);
        let addData = store.add(data);
        addData.onsuccess = function () {
            console.log("データが登録できました")
            alert("登録しました");
        }

        addData.onerror = function () {
            console.log("データが登録できませんでした");
        }

        //データベースを閉じる
        db.close();
    }
}

function createList() {
    //データベースからデータを全件取得
    let database = indexedDB.open(dbName);
    database.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction(storeName, "readonly");
        let store = transaction.objectStore(storeName);

        store.getAll().onsuccess = function (data) {
            console.log(data.target.result);
            let rows = data.target.result;
        }
    }

}