var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var URL = '"http://test3.gddxit.com:9080"'
// var URL = '"http://192.168.2.102:8080"'

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  URL
})
