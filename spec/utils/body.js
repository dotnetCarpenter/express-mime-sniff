'use strict'

const get  = require ('./get.js')
const receiveData = require ('./dataCollector.js')

module.exports = port => path => new Promise ((resolve, reject) => {
  const data = receiveData ()

  get
    (response => {
      response.on ('data', data)
      response.on ('end', () => { resolve (data ()) })
    })
    (port)
    (path).catch (reject)

}).catch (console.error)
