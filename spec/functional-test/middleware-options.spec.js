'use strict'

const { fork } = require ('child_process')
const path = require ('path')
const os = require('os')
const express = require ('express')
const { pipe } = require ('sanctuary')
const { middleware } = require ('../..')
const getContentType = require ('../utils/contentType.js')
const get = require ('../utils/get.js')
const receiveData = require ('../utils/dataCollector.js')

const ROOT_PATH = 'spec/fixtures/'

describe ('middleware with options', () => {

  it ('should be configured to only handle .txt files', () => {
    const app = express ()
    app.use (middleware (ROOT_PATH, { filters: [/\.txt$/, /\.png$/] }))
    app.use (express.static (ROOT_PATH))
    const server = app.listen (0)
    const request = getContentType (server.address().port)

    // fake.jpg is a png file but express.static thinks it's an jpeg'
    const urls = ['ascii.txt', 'ost.txt', 'fake.jpg'];
    const expected = ['text/plain; charset=us-ascii', 'text/plain; charset=utf-8', 'image/jpeg']

    return expectAsync (Promise.all (urls.map (request))).toBeResolvedTo (expected)
  })

  it ('should be noisy by default', () => {
    const wrongPath = 'nothing.gif'
    const expected  = `ERROR: cannot stat \`${path.resolve (__dirname, '..')}/fixtures/nothing.gif' (No such file or directory)${os.EOL}`
    const stderrData = receiveData ()

    return new Promise ((resolve, reject) => {
      const execute = ({port}) => {
        // request non-existing file
        get
          (() => {
            expect (stderrData ()).toBe (expected)
            childprocess.kill ()
            resolve ()
          })
          (port)
          (wrongPath).catch (pipe ([console.error, reject]))
      }

      // setup express
      const childprocess = fork (
        path.resolve (__dirname, '../utils/express-cli.js'),
        [ROOT_PATH],
        { stdio: ['ignore', 'ignore', 'pipe', 'ipc'] })

      childprocess.on ('message', execute)
      childprocess.stderr.on ('data', stderrData)
    })
  })

  it ('should be silent when asked', () => {
    const options = { silent: true }
    const wrongPath = 'nothing.gif'
    const expected  = ''
    const stderrData = receiveData ()

    return new Promise ((resolve, reject) => {
      const execute = ({port}) => {
        // request non-existing file
        get
          (() => {
            expect (stderrData ()).toBe (expected)
            childprocess.kill ()
            resolve ()
          })
          (port)
          (wrongPath).catch (pipe ([console.error, reject]))
      }

      // setup express
      const childprocess = fork (
        path.resolve (__dirname, '../utils/express-cli.js'),
        [ROOT_PATH, JSON.stringify (options)],
        { stdio: ['ignore', 'ignore', 'pipe', 'ipc'] })

      childprocess.on ('message', execute)
      childprocess.stderr.on ('data', stderrData)
    })
  })

  it ('should not fallthrough when asked (send error to express)', () => {
    const options = { silent: true, fallthrough: false }
    const wrongPath = 'nothing.gif'
    const expected  = ''
    const stderrData = receiveData ()

    return new Promise ((resolve, reject) => {
      const execute = ({port}) => {
        // request non-existing file
        get
          (() => {
            expect (stderrData ()).toBe (expected)
            childprocess.kill ()
            resolve ()
          })
          (port)
          (wrongPath).catch (pipe ([console.error, reject]))
      }

      // setup express
      const childprocess = fork (
        path.resolve (__dirname, '../utils/express-cli.js'),
        [ROOT_PATH, JSON.stringify (options)],
        { stdio: ['ignore', 'ignore', 'pipe', 'ipc'] })

      childprocess.on ('message', execute)
      childprocess.stderr.on ('data', stderrData)
    })
  })

})
