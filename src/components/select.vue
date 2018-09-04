<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import vueSelect from 'vue-select'
  import icon from './icon.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'vue-select': vueSelect,
      'tmx-icon': icon
    },
    props: {
      model: {
        type: Object,
        required: true
      },
      id: {
        type: String,
        required: true
      },
      disabled: {
        type: Boolean,
        default: false
      },
      dependencies: {
        type: Array,
        default: () => []
      },
      options: {
        type: Array,
        default: () => []
      },
      source: {
        type: Function,
        default: function (model, callback) {
          callback(this.options)
        }
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    mounted: function () {
      this.setOptions()
    },
    data: function () {
      return {
        values: [],
        value: null,
        enabled: true,
        oldModel: {}
      }
    },
    methods: {
      setOptions: function () {
        var options = []

        this.$data.enabled = true
        this.dependencies.forEach (key => {
          if (!this.model[key]) {
            this.$data.enabled = false
          }
        })

        if (this.$data.enabled) {
          this.$data.enabled = false
          this.source(this.model, options => {
            this.syncValues(options)
            this.$data.enabled = true
          })
        } else {
          this.syncValue()
        }
      },
      syncValues: function (options) {
        var values = []
        if (options instanceof Array) {
          options.forEach(option => {
            values.push({
              id: this.anyOf(option.id, option.label, option),
              label: String(this.anyOf(option.label, option.id, option) || '_')
            })
          })
        }
        T.sync(this.$data.values, values)
        this.syncValue (true)
      },
      anyOf: function (x, y, z) {
        if (x != null) {
          return x
        } else if (y != null) {
          return y
        } else {
          return z
        }
      },
      syncValue: function (force) {
        this.$data.oldModel = T.copy(this.model)

        if (!(this.$data.values instanceof Array) || this.model[this.id] == null) {
          this.$set(this.$data, 'value', null)
          return
        }
        if (this.$data.value && this.$data.value.id == this.model[this.id] && !force) {
          return
        }

        var set = false
        this.$data.values.forEach(value => {
          if (!set && value.id == this.model[this.id] && value.id !== undefined) {
            var v = this.$data.value
            if (typeof v !== 'object' || v == null || v instanceof Array) {
              this.$data.value = {}
            } 
            T.sync(this.$data.value, value, this.$set)
            set = true
          }
        })
        if (!set && force) {
          this.$set(this.$data, 'value', null)
        }
      }
    },
    watch: {
      model: {
        deep: true,
        handler: function () {
          var reset = false
          this.dependencies.forEach (key => {
            if (this.model[key] !== this.$data.oldModel[key]) {
              reset = true
            } 
          })
          if (
            this.model[this.id] !== this.$data.oldModel[this.id] ||
            this.$data.oldModel[this.id] === undefined 
          ) {
            this.syncValue()
          }
          if (reset) {
            this.model[this.id] = undefined
            this.setOptions ()
          }
        }
      },
      value: function () {
        if (this.$data.value) {
          this.$set(this.model, this.id, this.$data.value.id) 
        } else if (!this.required) {
          this.model[this.id] = undefined
        } else {
          this.syncValue()
        }
      },
      source: function () {
        this.setOptions()
      },
      options: function () {
        this.setOptions()
      }
    }
  }
</script>

<template>
  <vue-select
    v-model="value"
    :options="values"
    :disabled="disabled || !enabled"
    :id="id"
    v-bind="$attrs"
  >
    <span slot="no-options">
      <tmx-icon name="question"></tmx-icon>
    </span>
  </vue-select>
</template>
