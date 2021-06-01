'use strict'

const get  = require ('./get.js')

const data = (data = '') => chunk => chunk
  ? data += chunk
  : data

module.exports = port => path => new Promise ((resolve, reject) => {
  const receiveData = data ()
  get
    (response => {
      response.on ('data', receiveData)
      response.on ('end', () => { resolve (receiveData ()) })
    })
    (port)
    (path).catch (reject)

}).catch (console.error)
