#!/usr/bin/env node

const glob = require('glob')
const Koa = require('koa')
const serve = require('koa-static')
const mount = require('koa-mount')
const cors = require('@koa/cors')
const koaBody = require('koa-body')
const json = require('koa-json')
const Router = require('koa-router')
const open = require('open')
const portfinder = require('portfinder')

const rootPath = process.cwd()

let imgFiles = []

const app = new Koa()

const router = new Router()

function initServer(port) {
  router.get('/getImages', function (ctx) {
    ctx.body = JSON.stringify(imgFiles)
  })
  
  app.use(mount('/current', serve(rootPath)))
  
  app.use(mount('/process', serve(__dirname)))
  
  // app.use(koaBody())
  
  app.use(cors())
  
  app.use(json({pretty:false, param:'pretty'}))
  
  app.use(router.routes()).use(router.allowedMethods())

  app.on("error", (err, ctx) => {
    // console.error(err)
  })

  app.listen(port)
  
  glob('**/*.*(png|svg|jpg|jpeg|webp|gif|apng|mp4|pdf)',
    {
      ignore: '**/node_modules/**',
      cwd: rootPath,
    },
    (error, files) => {
      if (error) {
        console.log('glob error:', error)
        process.exit(0)
      } else if (files && files.length > 0) {
        imgFiles = files
        open(`http://localhost:${port}/process/dist/index.html`)
      } else if (!files || files.length <= 0) {
        console.log('glob can not find images')
        process.exit(0)
      }
    }
  )
}

portfinder.getPort({
  port: 7000,    // minimum port
  stopPort: 65535 // maximum port
}, (error, port) => {
  if (port) {
    console.log('current use port:', port)
    initServer(port)
  } else {
    console.log('can not find port', error)
  }
})
