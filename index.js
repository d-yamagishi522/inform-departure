// モジュールのインポート
const server = require("express")()
const line = require("@line/bot-sdk")

// パラメータ設定
const line_config = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'nc7q0GhLfnasFOHgsPnt4JasGkCPLd75OPu6dwUbsWezsP4hippd5ykkV+9u7n+msJcwN9eRQ4DbQnf/H15VaBl9E6J6o7HMx7++B4720o9DGGXBymJA1kGSTCMiS5XvejYbqy2nGbHEQj2qjohEgQdB04t89/1O/w1cDnyilFU=',
    channelSecret: process.env.LINE_CHANNEL_SECRET || 'ecdf030e1c35d6cca5ac7098e916e93d'
}

// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config)

console.log(bot)

// Webサーバー設定
server.listen(process.env.PORT || 3000)

// ルーター設定
server.post('/bot/webhook', (req, res, next) => {
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