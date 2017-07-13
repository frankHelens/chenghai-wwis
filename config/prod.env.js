// var config = require('./' + process.argv[2])
// var API = require('./' + process.argv[2] + '/api')

var API = '"/wisdom-water-web-api/"'
var packageInfo = require('../package.json')

module.exports = {
  NODE_ENV: '"production"',
  URL: '""',
  API: API,
  TITLE: '"' + packageInfo.title + '"',
  VERSION: '"' + packageInfo.version + '"'
}
