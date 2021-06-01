'use strict'

const express = require ('express')
const { middleware } = require ('../..')

const ROOT_PATH = process.argv[2]
const OPTIONS = JSON.parse (process.argv[3] || '{}')

const app = express ()
app.use (middleware (ROOT_PATH, OPTIONS))
app.use (express.static (ROOT_PATH))

const server = app.listen (0)
server.on ('listening', () => {
	process.send ({port:server.address().port})
})
