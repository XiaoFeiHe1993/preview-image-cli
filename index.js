#!/usr/bin/env node

const glob = require('glob')
const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const cors = require('@koa/cors')
const koaBody = require('koa-body')
const json = require('koa-json')
const open = require('open')

const rootPath = process.cwd()

const imgFiles = []

const app = new Koa()

const router = new Router()

router.get('/getImages', function (ctx) {
  ctx.body = JSON.stringify(imgFiles)
})

app.use(mount('/current', serve(rootPath)))

app.use(mount('/process', serve(__dirname)))

app.use(koaBody())

app.use(cors())

app.use(json({pretty:false, param:'pretty'}))

app.use(router.routes()).use(router.allowedMethods())

app.listen(7001)

glob('**/*.*(png|svg|jpg|jpeg|webp|gif|apng)',
  {
    ignore: '**/node_modules/**',
    cwd: rootPath,
  },
  (er, files) => {
    try {
      if (files && files.length > 0) {
        imgFiles = files
        open('http://localhost:7001/process/dist/index.html')
      }
    } catch (error) {
    } finally {
    }
  }
)