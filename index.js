// モジュールのインポート
const server = require("express")()
const line = require("@line/bot-sdk")
const request = require('request')

// パラメータ設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
}

// Webサーバー設定
server.listen(process.env.PORT || 3000)

// ルーター設定
server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS_TOKEN + '}',
  }

  // 送信データ作成
  const data = {
    'replyToken': req.body['events'][0]['replyToken'],
    'messages': [{
      'type': 'text',
      'text': 'test'
    }]
  }

  //オプションを定義
  const options = {
    url: 'https://api.line.me/v2/bot/message/reply',
    headers: headers,
    json: true,
    body: data
  }

  request.post(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.sendStatus(200)
    } else {
      console.log('error: ' + JSON.stringify(response))
    }
  })
})