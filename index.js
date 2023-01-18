#!/usr/bin/env node

const glob = require('glob')
const Koa = require('koa')
const serve = require('koa-static')
const open = require('open')

const rootPath = process.cwd()

const app = new Koa()

app.use(serve(rootPath))

app.listen(7001)

glob('**/*.*(png|svg|jpg|jpeg|webp|gif|apng)',
  {
    ignore: '**/node_modules/**',
    cwd: rootPath,
  },
  (er, files) => {
    try {
      console.log('=====', files)
      open('http://localhost:7001/dist/index.html')
    } catch (error) {
    } finally {
    }
  }
)