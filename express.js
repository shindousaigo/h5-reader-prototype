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
      request(url, function (error, response, body) {
        if (error) {
          console.log('error:', error);
        } else {
          if (response.statusCode === 200) {
            res.json(body);
          }
        }
      })
    })
    app.listen(3001, function () {
      console.log('CORS-enabled web server listening on port 3001')
    })
  }
}




