#!/usr/bin/env node

import path              from 'path'
import { fileURLToPath } from 'url'
import heapdump          from 'heapdump'

const __dirname = path.dirname( fileURLToPath (import.meta.url))

import ('./server.mjs').then (() => {
	heapdump.writeSnapshot (__dirname + Date.now() + 'start.heapsnapshot')

	setTimeout (writeHeapDump, 11000)
})

function writeHeapDump () {
	heapdump.writeSnapshot (__dirname + Date.now() + 'end.heapsnapshot', (error, filename) => {
		console.log ('Wrote heap dump to', filename)
	})
}
