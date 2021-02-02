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

// Webサーバー設定
server.listen(process.env.PORT || 3000)

// ルーター設定
server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
  const list = []

  req.body.events.forEach((event) => {
    list.push(bot.replyMessage(event.replyToken, {
        type: "text",
        text: event.message.text
    }))
  })

  // 全ての処理が終了したら成功ステータス返す
  Promise.all(list).then(
    () => {
      res.sendStatus(200)
    }
  )
})