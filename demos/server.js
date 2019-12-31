const express = require('express')
const bodyParser = require('body-parser')
// const cookieParser = require('cookie-parser')
// const multipart = require('content-multiparty')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config')
const path = require('path')

const app = express()
const complier = webpack(webpackConfig)

app.use(
  webpackDevMiddleware(complier, {
    publicPath: '/__build__/',
    stats: {
      colors: true,
      chunks: false
    }
  })
)

app.use(webpackHotMiddleware(complier))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const router = express.Router()
// registerSimpleRouter()
router.get('/simple/get', (req, res) => {
  res.json({
    msg: 'hello world'
  })
})

router.get('/base/get', (req, res) => {
  res.json(req.query)
})

app.use(router)

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port},Ctrl + C to stop`)
})

function registerSimpleRouter() {
  router.get('/simple/get', (req, res) => {
    res.json({
      msg: 'hello world'
    })
  })
}
