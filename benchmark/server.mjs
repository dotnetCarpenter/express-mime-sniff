#!/usr/bin/env node

// disable sanctuary type-checking and make express run faster too
process.env.NODE_ENV = 'production'

import path              from 'path'
import { fileURLToPath } from 'url'
import express           from 'express'
import { middleware }    from '../index.mjs'

const __dirname = path.dirname( fileURLToPath (import.meta.url))
const ROOT_PATH = path.resolve (__dirname, '../spec/fixtures/')
const PORT = 3100

const staticServer    = setupServer (PORT + 1, [express.static (ROOT_PATH)])
const mimeSniffServer = setupServer (PORT, [middleware (ROOT_PATH), express.static (ROOT_PATH)])

function setupServer (port, middlewares = []) {
	const app = express ()

	middlewares.forEach (m => app.use (m))

	return app.listen (port)
}


export {
	mimeSniffServer,
	staticServer
}
