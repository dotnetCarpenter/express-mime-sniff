'use strict'

const http = require ('http')

module.exports = f => port => path => new Promise ((resolve, reject) => {
  http.get (`http://localhost:${port}/${path}`, response => {

    resolve (f (response))

  }).on ('error', reject)

}).catch (console.error)
