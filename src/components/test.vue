<script type="text/babel">
  import T from 'libt'
  import table from '../json/table.json'
  import form from '../json/form.json'
  import tmx from '../index.vue'

  var components = {}
  Object.keys(tmx).forEach(key => {
    components[`tmx-${key === 'buttonSplit' ? 'button-split' : key}`] = tmx[key]
  })

  module.exports = {
    mixins: [tmx.lib],
    components: components,
    props: {
      component: {
        type: String,
        default: 'icon'
      },
      tests: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data: function () {
      var data = {
        form: {
          model: {},
          fields: []
        },
        model: {},
        compile: [],
        ready: false,
        show: 0,
        modal: null
      }

      return data
    },
    mounted: function () {
      this.build()
    },
    methods: {
      build: function () {
        this.$data.ready = false
        var fields = [
          {
            id: 'style',
            format: 'string'
          }, {
            id: 'class',
            format: 'string'
          }
        ]
        var model = {}
        
        this.$data.compile = []
        Object.keys(components[`tmx-${this.component}`].props).forEach(key => {
          var prop = components[`tmx-${this.component}`].props[key]
          if (prop.default !== undefined) {
            if (typeof prop.default === 'function' && prop.type !== Function) {
              model[key] = prop.default()
            } else {
              model[key] = prop.default
            }
          }

          var type = this.getTypes(prop.type)

          var format = 'string'
          if (type === 'Boolean') {
            format = 'boolean'
          } else if (type === 'Number') {
            format = 'number'
          } else if (type === 'Array' || type === 'Object' || type === 'Function') {
            format = 'string:text'
            this.$data.compile.push(key)
          }

          fields.push({
            id: key,
            label: `${key} (${type})`,
            format: format,
            source: this.getSource(key === 'icon' ? this.isIcon : prop.validator),
            required: prop.required
          })
        })

        model = T.merge(model)(this.tests)
        var F = []
        model = T.iterate(value => {
          if (typeof value === 'function') {
            F.push(String(value))
            return `&&F:${F.length - 1}`
          } else {
            return value
          }
        })(model)
        Object.keys(model).forEach(key => {
          if (typeof model[key] === 'object' && model[key] != null) {
            model[key] = JSON.stringify(model[key], undefined, 2)
            F.forEach((f, i) => {
              model[key] = T.replaceAll(`"&&F:${i}"`, f)(model[key])
            })
          } else if (typeof model[key] === 'string' && model[key].substr(0, 4) === `&&F:`) {
            F.forEach((f, i) => {
              model[key] = model[key] === `&&F:${i}` ? f : model[key]
            })
          }
        })

        this.syncObject(model, this.$data.form.model)
        this.populate(fields, this.$data.form.fields)
        this.submit()
        this.$data.ready = true
      },
      submit: function () {
        var model = T.copy(this.$data.form.model)
        model.icon = this.convert(model.icon)
        if (this.component === 'icon') {
          model.name = this.convert(model.name)
        }
        this.$data.compile.forEach(key => {
          if (model[key] !== '') {
            try {
              eval(`model[key] = ${model[key]}`)
            } catch (err) {
              T.debug('Eval error', key, model[key], err.toString())
              model[key] = undefined
            }
          } else {
            model[key] = undefined
          }
        })

        var model2 = T.copy(model)
        var p = components[`tmx-${this.component}`].props
        Object.keys(p).forEach(key => {
          if (p[key].type === Boolean && model[key] !== undefined) {
            model2[key] = model[key] ? true : false
          } 
        })
        this.syncObject(model2, this.$data.model)
      },
      getType: function (type) {
        var ret = ''
        if (type === String) {
          ret = 'String'
        } else if (type === Number) {
          ret = 'Number'
        } else if (type === Boolean) {
          ret = 'Boolean'
        } else if (type === Object) {
          ret = 'Object'
        } else if (type === Array) {
          ret = 'Array'
        } else if (type === Function) {
          ret = 'Function'
        } else {
          ret = 'Object'
        }

        return ret
      },
      getTypes: function (types) {
        if (types instanceof Array) {
          var str = ''
          types.forEach(type => {
            if (str.length) {
              str += ', '
            }
            str += this.getType(type)
          })
          return str
        } else {
          return this.getType(types)
        }
      },
      getSource: function (validator) {
        if (validator) {
          var options = validator(null, true)
          if (options instanceof Array) {
            return this.selectOptions(options)
          }
        }
      }
    },
    watch: {
      $route: function () {
        this.build()
      },
      '$root.$data.modal': function () {
        this.$data.modal = this.$root.$data.modal
        this.$data.show += 1
      }
    }
  }
</script>

<template>
  <div>
    <tmx-modal v-bind="modal" :show="show" />
    <div v-if="ready">
      <tmx-block v-if="component === 'block'" v-bind="model" />
      <tmx-body v-if="component === 'body'" v-bind="model" />
      <tmx-button-split v-if="component === 'button-split'" v-bind="model">
        <a v-on:click="model.click(scope.index)" style="cursor:pointer;" slot-scope="scope">
          <tmx-icon name="remove" />
          {{scope.item}}
        </a>
      </tmx-button-split>
      <tmx-button v-if="component === 'button'" v-bind="model" />
      <tmx-carousel v-if="component === 'carousel'" v-bind="model" />
      <tmx-chart v-if="component === 'chart'" v-bind="model" />
      <tmx-checkbox v-if="component === 'checkbox'" v-bind="model" />
      <tmx-data v-if="component === 'data'" v-bind="model" />
      <tmx-download v-if="component === 'download'" v-bind="model" />
      <tmx-dropdown v-if="component === 'dropdown'" v-bind="model" />
        <tmx-fields v-if="component === 'fields'" v-bind="model" /> 
      <tmx-file v-if="component === 'file'" v-bind="model" />
      <tmx-filter v-if="component === 'filter'" v-bind="model" />
      <tmx-form v-if="component === 'form'" v-bind="model" />
      <tmx-group v-if="component === 'group'" v-bind="model" />
      <tmx-header v-if="component === 'header'" v-bind="model" />
      <tmx-head v-if="component === 'head'" v-bind="model" />
      <tmx-icon v-if="component === 'icon'" v-bind="model" />
      <tmx-input v-if="component === 'input'" v-bind="model" />
      <tmx-item v-if="component === 'item'" v-bind="model" />
      <tmx-modal v-if="component === 'modal'" v-bind="model" />
      <tmx-navbar v-if="component === 'navbar'" v-bind="model"></tmx-navbar>
      <tmx-pager v-if="component === 'pager'" v-bind="model" />
      <tmx-panel v-if="component === 'panel'" v-bind="model" />
      <tmx-progressbar v-if="component === 'progressbar'" v-bind="model" />
      <tmx-search v-if="component === 'search'" v-bind="model" />
      <tmx-select v-if="component === 'select'" v-bind="model" />
      <tmx-table v-if="component === 'table'" v-bind="model" />
      <tmx-text v-if="component === 'text'" v-bind="model" />
      <div style="margin:auto;width:100px">
        <tmx-barcode v-if="component === 'barcode'" v-bind="model" />
        <tmx-image v-if="component === 'image'" v-bind="model" />
      </div>
    </div>
    <tmx-form
      v-bind="form" :submit="submit" icon="cog" :label="component"
      :buttons="[{
        type: 'primary',
        icon: 'cog',
        label: 'Rebuild'
      }]"
    />
  </div>
</template>
