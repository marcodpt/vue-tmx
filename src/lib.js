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

_.formatData = function (value, format) {
  if (value === null || value === undefined) {
    return ''
  }
  if (!(typeof format === 'string')) {
    format = ''
  }

  var F = format.split(':')
  var type = F[0]
  var p1 = parseInt(F[1] || 0)
  var x, s

  if (type === 'boolean') {
    if (value && value !== '0' && value !== 'false') {
      return this.translate('trueLabel')
    } else {
      return this.translate('falseLabel')
    }
  } else if (type === 'integer') {
    x = parseInt(value)
    if (!isNaN(x)) {
      s = String(x)
      while (s.length < p1) {
        s = '0' + s
      }
      return s
    }
  } else if (type === 'number') {
    x = parseFloat(value)
    if (!isNaN(x)) {
      if (p1 > 0 || (p1 === 0 && F[1] === '0')) {
        s = String(x.toFixed(p1))
      } else {
        s = String(x)
      }
      var N = s.split('.')
      N[0] = N[0].replace(/(\d)(?=(\d{3})+$)/g, '$1' + this.translate('numberSeparator'))
      N[1] = N.length > 1 ? this.translate('decimalSeparator') + N[1] : ''
      return N[0] + N[1]
    }
  } else if (type === 'string') {
    s = String(value)
    if (F.indexOf('rgb') > -1) {
      return ''
    }
    if (p1) {
      return s.substr(0, p1)
    }
    return s
  } else if (type === 'date' && T.match('date')(value)) {
    s = String(value)
    var D = {
      yyyy: s.substr(0, 4),
      yy: s.substr(2, 2),
      MM: s.substr(5, 2),
      M: parseInt(s.substr(5, 2)),
      dd: s.substr(8, 2),
      d: parseInt(s.substr(8, 2))
    }
    x = this.translate('date')
    Object.keys(D).forEach(function (key) {
      x = x.replace(new RegExp(key, 'g'), D[key])
    })
    return x
  }

  return String(value)
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
