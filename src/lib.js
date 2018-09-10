var lang = require('./json/lang.json')
var validate = require('./json/validate.json')
var T = require('libt')

var _ = {}

Object.keys(validate).forEach(function (key) {
  _['is' + key] = T.contains(validate[key])
})

_.translate = function (field) {
  return lang[this.$root.$data.lang || 'en'][field]
}

module.exports = {
  methods: _
}
