'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  // BASE_API: '"https://www.vlawyer.net/server/"'
  BASE_API: '"http://192.168.1.125:8099"'
  // BASE_API: '"http://49.4.68.8:80"'
})
