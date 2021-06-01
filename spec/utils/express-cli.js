'use strict'

const express = require ('express')
const { middleware } = require ('../..')

const PORT = Number (process.argv[2])
const ROOT_PATH = process.argv[3]

const app = express ()
app.use (middleware (ROOT_PATH))
app.use (express.static (ROOT_PATH))


app.listen(PORT).on ('listening', console.log.bind (console, `READY`))
