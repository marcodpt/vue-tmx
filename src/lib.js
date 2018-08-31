/* global FormData, FileList */
var lang = require('./json/lang.json')
var validate = require('./json/validate.json')
var T = require('libt')

var _ = {}

Object.keys(validate).forEach(function (key) {
  _['is' + key] = T.contains(validate[key])
})

_.translate = function (field) {
  return lang['pt-br'][field]
}

_.setFields = function (Data) {
  var Fields = []

  if (!(Data instanceof Array)) {
    Data = [Data]
  }

  Data.forEach(row => {
    if (typeof row !== 'object' || row == null || row instanceof Array) {
      return
    }
    Object.keys(row).forEach(key => {
      if (row[key] != null) {
        var X = Fields.filter(f => T.compare({id: key})(f) === 0)[0]
        if (!X) {
          X = {
            id: key,
            label: key,
            formats: []
          }
          Fields.push(X)
        }

        var Types = [
          {label: 'date', method: T.match('date')},
          {label: 'boolean', method: X => typeof X === 'boolean'},
          {label: 'integer', method: T.match('integer')},
          {label: 'number', method: T.match('number')},
          {label: 'string', method: () => true}
        ]

        Types.forEach(type => {
          var index = X.formats.indexOf(type.label)
          if (type.method(row[key])) {
            if (index === -1) {
              X.formats.push(type.label)
            }
          } else if (index !== -1) {
            X.formats.splice(index, 1)
          }
        })
      }
    })
  })

  Fields.forEach(field => {
    field.format = field.formats[0]
    field.formats = undefined
  })

  return Fields
}

module.exports = {
  methods: _
}
