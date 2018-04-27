<script type="text/babel">
import Vue from '../node_modules/vue/dist/vue.js'
import tmx from '../src/index.vue'
import test from 'tape'
import T from 'libt'

function getEl (propsData) {
  return Component => {
    const Constructor = Vue.extend(Component)
    const vm = new Constructor({propsData: propsData}).$mount()
    return vm.$el
  }
}

function getInfo (Attributes) {
  Attributes = Attributes ? Attributes : []

  return el => {
    var R = {}

    R.tagName = el.tagName.toLowerCase()
    R.innerHTML = el.innerHTML
    R.textContent = el.textContent
    Attributes.forEach(attribute => {
      R[attribute] = el.getAttribute(attribute)
    })

    return R
  }
}

test('#icon', assert => {
  var e

  e = getEl()(tmx.icon)
  assert.deepEqual(e.tagName)

  e = T.compose(getInfo(['class']), getEl({type: 'ok'}))(tmx.icon)
  assert.deepEqual(e.tagName, 'span')
  assert.deepEqual(e.innerHTML, '')
  assert.deepEqual(e.textContent, '')
  assert.deepEqual(e.class, 'glyphicon glyphicon-ok')

  e = T.compose(getInfo(['class']), getEl({type: 'remove', spin: true}))(tmx.icon)
  assert.deepEqual(e.tagName, 'span')
  assert.deepEqual(e.innerHTML, '')
  assert.deepEqual(e.textContent, '')
  assert.deepEqual(e.class, 'glyphicon glyphicon-remove spinning')

  assert.end()
})

test('#barcode', assert => {
  var e, s

  e = T.compose(getInfo(['id', 'style']), getEl({value: 12345}))(tmx.barcode)
  s = T.replaceAll(' ')(e.style).split(';')
  assert.deepEqual(e.tagName, 'img')
  assert.deepEqual(e.innerHTML, '')
  assert.deepEqual(e.textContent, '')
  assert.deepEqual(T.match(/^barcode_[a-z0-9]{20}$/)(e.id), true)
  assert.notEqual(s.indexOf('height:100%'), -1)
  assert.deepEqual(s.indexOf('height:auto'), -1)
  assert.notEqual(s.indexOf('width:auto'), -1)
  assert.deepEqual(s.indexOf('width:100%'), -1)

  e = T.compose(getInfo(['id', 'style']), getEl({
    id: 'bar1234',
    value: 12345,
    vertical: false
  }))(tmx.barcode)
  s = T.replaceAll(' ')(e.style).split(';')
  assert.deepEqual(e.tagName, 'img')
  assert.deepEqual(e.innerHTML, '')
  assert.deepEqual(e.textContent, '')
  assert.deepEqual(e.id, 'bar1234')
  assert.deepEqual(s.indexOf('height:100%'), -1)
  assert.notEqual(s.indexOf('height:auto'), -1)
  assert.deepEqual(s.indexOf('width:auto'), -1)
  assert.notEqual(s.indexOf('width:100%'), -1)

  assert.end()
})

window.close()

</script>
