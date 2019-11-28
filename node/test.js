var express = require('express')
var cors = require('cors')
var request = require('request')

var app = express()
app.use(cors())
app.get('/', function (req, res, next) {

  res.send('Hello World!');

})
app.listen(30001, function () {
  console.log('CORS-enabled web server listening on port 30001')
})
