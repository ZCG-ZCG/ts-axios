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

router.post('/base/post', (req, res) => {
  res.json(req.body)
})

router.post('/base/buffer', (req, res) => {
  let msg = []
  req.on('data', chunk => {
    if (chunk) {
      msg.push(chunk)
    }
  })

  req.on('end', () => {
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})

router.get('/error/get', (req, res) => {
  if (Math.random() > 0.5) {
    res.json({
      msg: 'hello world'
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout', (req, res) => {
  setTimeout(() => {
    res.json({
      msg: 'hello world'
    })
  }, 3000)
})

app.use(router)

const port = process.env.PORT || 9355
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
