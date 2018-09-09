<script type="text/babel">
  import T from 'libt'
  import form from './form.vue'

  module.exports = {
    components: {
      'tmx-form': form
    },
    props: {
      model: {
        type: Object,
        default: () => ({})
      },
      props: {
        type: Object,
        default: () => ({})
      },
      name: {
        type: String,
        default: ''
      },
      callback: {
        type: Function,
        required: true
      }
    },
    data: function () {
      var data = {
        form: {
          model: {},
          fields: []
        },
        compile: []
      }

      return data
    },
    mounted: function () {
      this.build()
    },
    methods: {
      build: function () {
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
        Object.keys(this.props).forEach(key => {
          var prop = this.props[key]
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
            options: this.getOptions(key === 'icon' ? this.isIcon : prop.validator),
            required: prop.required
          })
        })

        model = T.merge(model)(this.model)
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

        T.sync(this.$data.form.model, model, this.$set)
        T.sync(this.$data.form.fields, fields)
        this.submit()
      },
      submit: function () {
        var model = T.copy(this.$data.form.model)
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
        Object.keys(this.props).forEach(key => {
          if (this.props[key].type === Boolean && model[key] !== undefined) {
            model2[key] = model[key] ? true : false
          } 
        })
        T.sync(this.model, model2, this.$set)
        this.callback()
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
          return this.getType(types[0])
        } else {
          return this.getType(types)
        }
      },
      getOptions: function (validator) {
        if (validator) {
          var options = validator(T.identity)
          if (options instanceof Array) {
            return options
          }
        }
      }
    },
    watch: {
      name: function () {
        this.build()
      },
      props: function () {
        this.build()
      }
    }
  }
</script>

<template>
  <tmx-form
    v-bind="form" :submit="submit" icon="cog" :label="'Live Playground '+name"
    :buttons="[{
      type: 'primary',
      icon: 'cog',
      label: 'Rebuild'
    }]"
  />
</template>
