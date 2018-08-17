/* global FormData, FileList */
var lang = require('./json/lang.json')
var validate = require('./json/validate.json')
var T = require('libt')

var _ = {}

Object.keys(validate).forEach(function (key) {
  _['is' + key] = function (value, all) {
    if (all) {
      return validate[key]
    } else {
      return validate[key].indexOf(value) !== -1
    }
  }
})

_.languages = function () {
  return Object.keys(lang)
}

_.listenClick = function (toogle) {
  document.body.addEventListener('click', (event) => {   
    var element = document.getElementById(this.id)
    if (element && element.contains(event.target)){
      if (toogle) {
        this.$data.isOpen = this.$data.isOpen ? false : true
      }
    } else {
      this.$data.isOpen = false
    }
  })
}

_.validateModel = function () {
  var valid = true
  this.fields.forEach((field, i) => {
    this.$set(this.fields[i], 'error', '')
    var error = false
    var empty = this.model[field.id] == null
    field.format = field.format || 'string'
    var label = field.label || field.placeholder || field.id
    if (field.static) {
      return
    }
    if (field.format === 'json' && this.model[field.id]) {
      try {
        var x = JSON.parse(this.model[field.id])
      } catch (err) {
        this.$set(this.fields[i], 'error', `${label} ${err.toString()}`)
        valid = false
        error = true
      }
    }
    if (!error && empty && field.required) {
      if (field.format.substr(0, 6) === 'string' && !field.options && !field.src) {
        this.$set(this.model, field.id, '')
      } else {
        var err = this.translate('required')
        this.$set(this.fields[i], 'error', `${label} ${err}`)
        valid = false
        error = true
      }
    }
    if (!error && !empty && field.min > this.model[field.id]) {
      var err = T.replaceAll('$min', this.formatData(field.min, field.format))(this.translate('min'))
      this.$set(this.fields[i], 'error', `${label} ${err}`)
      valid = false
      error = true
    }
    if (!error && !empty && field.max < this.model[field.id]) {
      var err = T.replaceAll('$max', this.formatData(field.max, field.format))(this.translate('max'))
      this.$set(this.fields[i], 'error', `${label} ${err}`)
      valid = false
      error = true
    }
    if (!error && !empty && field.minLen > String(this.model[field.id]).length) {
      var err = T.replaceAll('$minLen', field.minLen)(this.translate('minLen'))
      this.$set(this.fields[i], 'error', `${label} ${err}`)
      valid = false
      error = true
    }
    if (!error && !empty && field.maxLen < String(this.model[field.id]).length) {
      var err = T.replaceAll('$maxLen', field.maxLen)(this.translate('maxLen'))
      this.$set(this.fields[i], 'error', `${label} ${err}`)
      valid = false
      error = true
    }
    if (!error && !empty && field.validate instanceof Array) {
      field.validate.forEach(v => {
        if (!error && !T.evaluate(v.assert)(this.model)) {
          this.$set(this.fields[i], 'error', `${label} ${v.error}`)
          valid = false
          error = true
        }
      })
    }
    if (!error && field.watchlen && (String(this.model[field.id]).length < field.watchlen || empty)) {
      valid = false
    }
  })

  return valid
}

_.downloadFile = function (fileName, source, type) {
  if (type === 'text') {
    source = 'data:text/plain;charset=utf-8,' + encodeURI(source) 
  }

  var a = document.createElement('a')
  a.href = source
  a.target = '_blank'
  a.download = fileName

  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
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

_.translate = function (field) {
  var language = this.language
  if (this.language === undefined || lang[this.language] === undefined) {
    var language = 'en'
  }

  return lang[language][field]
}

_.syncObject = function (input, output) {
  Object.keys(output).forEach(key => {
    if (input[key] === undefined) {
      this.$set(output, key)
    }
  })
  Object.keys(input).forEach(key => {
    this.$set(output, key, input[key])
  })
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

_.populate = function (Input, Output) {
  while (Output.length > 0) {
    Output.pop()
  }
  Input.forEach(row => {
    Output.push(row)
  })
}

_.selectOptions = function (options) {
  return function (model, callback) {
    if (options == null) {
      callback([])
    } else {
      callback(options)
    }
  }
}

_.selectBool = function () {
  return [
    {
      id: 0,
      label: this.translate('falseLabel')
    }, {
      id: 1,
      label: this.translate('trueLabel')
    }
  ]
}

_.selectRange = function (label, begin, end, step) {
  label = label == null ? '$index' : label
  begin = T.parse('integer')(begin)
  begin = begin == null ? 1 : begin
  end = T.parse('integer')(end)
  end = end == null ? 1 : end
  step = T.parse('integer')(step)
  step = step ? step : 1
  step = ((end >= begin && step < 0) || (end < begin && step > 0)) ? (step * -1) : step

  var options = []
  for (var index = begin; (step > 0 && index <= end) || (step < 0 && index >= end); index += step) {
    options.push({
      id: index,
      label: T.compose(
        T.replaceAll('$end', end),
        T.replaceAll('$begin', begin),
        T.replaceAll('$step', step),
        T.replaceAll('$index', index),
      )(label)
    })
  }

  return options
}

module.exports = {
  methods: _
}
