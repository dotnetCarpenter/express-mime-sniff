'use strict'

const get  = require ('./get.js')

module.exports = port => path => new Promise ((resolve, reject) => {

  get
    (response => {
      resolve (response.headers['content-type'])
    })
    (port)
    (path).catch (reject)

}).catch (console.error)
