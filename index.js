// モジュールのインポート
const server = require("express")()
const line = require("@line/bot-sdk")

// パラメータ設定
const line_config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
}

// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config)

console.log(bot)

// Webサーバー設定
server.listen(process.env.PORT || 3000)

// ルーター設定
server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
  // すべてのイベント処理のプロミスを格納する配列。
  const events_processed = []

  // イベントオブジェクトを順次処理。
  req.body.events.forEach((event) => {
    // replyMessage()で返信し、そのプロミスをevents_processedに追加。
    events_processed.push(bot.replyMessage(event.replyToken, {
        type: "text",
        text: "test"
    }))
  })

  // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
  Promise.all(events_processed).then(
    () => {
      res.sendStatus(200)
    }
  )
})