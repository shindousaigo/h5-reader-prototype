var express = require('express')
var cors = require('cors')
var request = require('request')

// 'http://api.zhuishushenqi.com/book/by-categories?gender=male&type=hot&major=%E6%B8%B8%E6%88%8F&minor=&start=0&limit=20'

module.exports = {
  setup: () => {
    var app = express()
    app.use(cors())
    app.get('/', function (req, res, next) {
      var url = req.query.url
      var qs = req.query.qs


      var response = {
        "text": `You sent the message: "test". Now send me an attachment!`
      }

      const PAGE_ACCESS_TOKEN = 'EAACVZB4qS8HEBAENlUZAkdZArDuJrMDmkaGie8CZBgsdIxH8Y9QBaGRva87bmaSwZCoZCrjw5TZAKO4LVcrfwWdK3iubdaDFzx3KYcvyYZBGvoSqoguuqY0eMvPcOzd2i4ZAbg8GCPcZCdh6iwHGlOAiu1vfAEhAqJCJJcqF6VUvZC03l4HB9H3tvpTS6AheChhqbAZD'

      let request_body = {
        "recipient": {
          "id": 'test_id'
        },
        "message": response
      }

      // Send the HTTP request to the Messenger Platform
      request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": {
          "access_token": PAGE_ACCESS_TOKEN
        },
        "method": "POST",
        "json": request_body
      }, (err, res, body) => {
        if (!err) {
          console.log('message sent!')
          // console.log(res, body)
        } else {
          console.error("Unable to send message:" + err);
        }
      });


      // if (url) {
      //   var url = url.replace(/[\u4e00-\u9fa5]/g, function (str) {
      //     return encodeURIComponent(str)
      //   })
      //   console.log('URL : ' + url, urlaaa)
      //   request(url, function (error, response, body) {
      //     if (error) {
      //       console.log('error:', error);
      //     } else {
      //       if (response.statusCode === 200) {
      //         res.send(body);
      //       } else {
      //         console.log('statusCode : ' + response.statusCode)
      //       }
      //     }
      //   })
      // }
    })
    app.listen(3001, function () {
      console.log('CORS-enabled web server listening on port 3001')
    })
  }
}
