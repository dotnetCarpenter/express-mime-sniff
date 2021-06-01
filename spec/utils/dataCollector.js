'use strict'

module.exports = (data = '') => chunk => chunk
  ? data += chunk
  : data
