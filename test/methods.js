var test = require('tape')
var T = require('libt')
var lib = require('../src/lib.js').methods
var validate = require('../src/json/validate.json')
var data = require('../src/json/table.json')['data']

function stringify (X) {
  return JSON.stringify(X, undefined, 2)
}

test('#validate', function (t) {
  Object.keys(validate).forEach(function (key) {
    t.deepEqual(lib['is' + key]('noWayIsThere'), false)
    validate[key].forEach(function (valid) {
      t.deepEqual(lib['is' + key](valid), true)
    })
  })

  t.end()
})

test('#populate', function (t) {
  var X = [{x: 1}, {x: 2}, {x: 3}]
  var Y = []

  lib.populate(X, Y)

  t.deepEqual(stringify(X), stringify(Y))
  t.deepEqual(X[1].x, 2)

  Y[1].x = 5

  t.deepEqual(stringify(X), stringify(Y))
  t.deepEqual(X[1].x, 5)

  t.end()
})

test('#format/lang', function (t) {
  t.deepEqual(lib.languages().indexOf('en') > -1, true)
  t.deepEqual(lib.languages().indexOf('xxx'), -1)

  t.deepEqual(lib.formatData(), '')

  t.deepEqual(String('1'), lib.formatData(1))
  t.deepEqual(String('dog'), lib.formatData('dog'))
  t.deepEqual(String('3.14'), lib.formatData(3.14))
  t.deepEqual(String('true'), lib.formatData(true))
  t.deepEqual(String(''), lib.formatData(null))

  var X = ['integer', 'number', 'boolean', 'date', 'string']
  X.forEach(function (x) {
    t.deepEqual('', lib.formatData(undefined, x))
    t.deepEqual('', lib.formatData(null, x))
  })

  t.deepEqual(lib.formatData(true, 'boolean'), lib.translate('trueLabel'))
  t.deepEqual(lib.formatData(1, 'boolean'), lib.translate('trueLabel'))
  t.deepEqual(lib.formatData('1', 'boolean'), lib.translate('trueLabel'))
  t.deepEqual(lib.formatData('true', 'boolean'), lib.translate('trueLabel'))
  t.deepEqual(lib.formatData(false, 'boolean'), lib.translate('falseLabel'))
  t.deepEqual(lib.formatData(0, 'boolean'), lib.translate('falseLabel'))
  t.deepEqual(lib.formatData('0', 'boolean'), lib.translate('falseLabel'))
  t.deepEqual(lib.formatData('false', 'boolean'), lib.translate('falseLabel'))

  t.deepEqual('03', lib.formatData(3.1415, 'integer:2'))
  t.deepEqual('003', lib.formatData('3.1415,gh', 'integer:3'))
  t.deepEqual('3', lib.formatData('3.1415,gh', 'integer'))
  t.deepEqual('pi is a number', lib.formatData('pi is a number', 'integer'))
  t.deepEqual('12345678', lib.formatData('12345678.92345,pi', 'integer'))

  t.deepEqual('3.14', lib.formatData(3.1415, 'number:2'))
  t.deepEqual('3.142', lib.formatData('3.1415,gh', 'number:3'))
  t.deepEqual('3.1415', lib.formatData('3.1415,pi', 'number'))
  t.deepEqual('pi is a number', lib.formatData('pi is a number', 'number'))
  t.deepEqual(lib.formatData('12345678.12345,pi', 'number'), '12,345,678.12345')

  t.deepEqual(lib.formatData('false', 'date'), 'false')
  t.deepEqual(lib.formatData('2018-04-01Zabc', 'date'), '04/01/2018')
  t.deepEqual(lib.formatData('2018-13-01', 'date'), '13/01/2018')

  t.deepEqual(lib.formatData(235, 'string:3'), '235')
  t.deepEqual(lib.formatData(false, 'string:4'), 'fals')
  t.deepEqual(lib.formatData('prime numbers are cool', 'string:5'), 'prime')
  t.deepEqual(lib.formatData('prime numbers are cool', 'string'), 'prime numbers are cool')

  t.end()
})

test('#setFields', function (t) {
  var Format = [
    {
      'id': '$delete',
      'label': '$delete',
      'format': 'integer'
    }, {
      'id': '$put',
      'label': '$put',
      'format': 'integer'
    }, {
      'id': '_id',
      'label': '_id',
      'format': 'string'
    }, {
      'id': 'since',
      'label': 'since',
      'format': 'date'
    }, {
      'id': 'link',
      'label': 'link',
      'format': 'string'
    }, {
      'id': 'isActive',
      'label': 'isActive',
      'format': 'boolean'
    }, {
      'id': 'balance',
      'label': 'balance',
      'format': 'number'
    }, {
      'id': 'age',
      'label': 'age',
      'format': 'integer'
    }, {
      'id': 'eyeColor',
      'label': 'eyeColor',
      'format': 'string'
    }, {
      'id': 'name',
      'label': 'name',
      'format': 'string'
    }, {
      'id': 'gender',
      'label': 'gender',
      'format': 'string'
    }, {
      'id': 'tags',
      'label': 'tags',
      'format': 'string'
    }, {
      'id': 'friends',
      'label': 'friends',
      'format': 'string'
    }
  ]

  t.deepEqual(stringify(lib.setFields(data)), stringify(Format))
  t.deepEqual(stringify(lib.setFields(data[0])), stringify(Format))
  t.deepEqual(stringify(lib.setFields({})), stringify([]))
  t.deepEqual(stringify(lib.setFields(null)), stringify([]))
  t.deepEqual(stringify(lib.setFields(undefined)), stringify([]))
  t.deepEqual(stringify(lib.setFields('dog')), stringify([]))
  t.deepEqual(stringify(lib.setFields(['dog', 'bike', 'car'])), stringify([]))
  t.deepEqual(stringify(lib.setFields(13)), stringify([]))
  t.deepEqual(stringify(lib.setFields([2, 3, 5, 7, 11, 13])), stringify([]))

  t.end()
})

test('#select', function (assert) {
  lib.selectOptions()(null, opt => {
    assert.deepEqual(stringify(opt), stringify([]))
  })

  var opt = ['Einstein', 'Dirac', 'Gauss']
  var opt2 = T.copy(opt)
  lib.selectOptions(opt)(null, res => {
    assert.deepEqual(stringify(res), stringify(opt2))
    assert.deepEqual(stringify(opt), stringify(opt2))
  })

  lib.selectOptions(lib.selectBool())(null, res => {
    assert.deepEqual(stringify(res), stringify([
      {id: 0, label: lib.translate('falseLabel')},
      {id: 1, label: lib.translate('trueLabel')}
    ]))
  })

  lib.selectOptions(lib.selectRange('$index from $begin to $end jump $step', 3, 6, 2))(null, res => {
    assert.deepEqual(stringify(res), stringify([
      {id: 3, label: '3 from 3 to 6 jump 2'},
      {id: 5, label: '5 from 3 to 6 jump 2'}
    ]))
  })

  lib.selectOptions(lib.selectRange('$index from $begin to $end jump $step', 6, 3, 2))(null, res => {
    assert.deepEqual(stringify(res), stringify([
      {id: 6, label: '6 from 6 to 3 jump -2'},
      {id: 4, label: '4 from 6 to 3 jump -2'}
    ]))
  })

  assert.end()
})
