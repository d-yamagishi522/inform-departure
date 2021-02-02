const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const request = require('request')
const crypto = require('crypto')
const async = require('async')

app.set('port', (process.env.PORT || 8000))
// JSONの送信を許可
app.use(bodyParser.urlencoded({
  extended: true
}))
// JSONのパースを楽に（受信時）
app.use(bodyParser.json())

app.post('/callback', function(req, res) {
  console.log('koko')
    async.waterfall([
      function(callback) {
        if (!validate_signature(req.headers['x-line-signature'], req.body)) {
          return
        }
        callback()
      }
    ],
    function(displayName) {
      //ヘッダーを定義
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
        proxy: process.env.FIXIE_URL,
        headers: headers,
        json: true,
        body: data
      }

      request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body)
        } else {
          console.log('error: ' + JSON.stringify(response))
        }
      })
    }
  )
})

app.listen(app.get('port'), function() {
  console.log('Node app is running')
})

// 署名検証
function validate_signature(signature, body) {
  return signature == crypto.createHmac('sha256', process.env.LINE_CHANNEL_SECRET).update(new Buffer(JSON.stringify(body), 'utf8')).digest('base64')
}