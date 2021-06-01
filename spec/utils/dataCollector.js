'use strict'

module.exports = (data = '') => chunk => {
  if (chunk != null) data += chunk
  else return data
}