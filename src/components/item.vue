<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxInput from './input.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-input': tmxInput
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
      static: {
        type: Boolean,
        default: false
      },
      col: {
        type: Number,
        default: 1,
        validator: function (value) {
          return [0, 1, 2, 3, 4].indexOf(value) === value
        }
      },
      format: {
        type: String,
        default: 'string',
        validator: function (value) {
          return !value || lib.methods.isType(value.split(':')[0])
        }
      },
      label: {
        type: String
      },
      placeholder: {
        type: String,
        default: ''
      },
      dependencies: {
        type: Array,
        default: function () {
          return []
        }
      },
      source: {
        type: Function
      },
      options: {
        type: Array
      },
      method: {
        type: Function
      },
      required: {
        type: Boolean,
        default: false
      },
      min: {},
      max: {},
      minLen: {
        type: [Number, String]
      },
      maxLen: {
        type: [Number, String]
      },
      watchlen: {
        type: [Number, String]
      },
      validate: {
        type: Array,
        default: function () {
          return []
        }
      },
      error: {
        type: String,
        default: ''
      },
      size: {
        type: String,
        default: 'md',
        validator: lib.methods.isSize
      },
      compact: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: false
      },
      href: {
        type: String,
        default: ''
      }
    },
    methods: {
      parseHref: function (href) {
        Object.keys(this.model).forEach(key => {
          while (href.indexOf(`:${key}`) !== -1 && this.model[key] !== undefined) {
            href = href.replace(`:${key}`, this.model[key])
          }
        })

        return href
      },
      getOptions: function () {
        return this.format === 'boolean' ? [
          {
            id: 0,
            label: this.translate('falseLabel')
          }, {
            id: 1,
            label: this.translate('trueLabel')
          }
        ] : this.options
      },
      getType: function () {
        var F = this.format.split(':')

        if (this.static) {
          return ''
        }

        if (this.options || this.source || F[0] === 'boolean') {
          return 'select'
        } else if (F[0] === 'date') {
          return 'date'
        } else if (F[0] === 'json') {
          return 'textarea'
        } else if (F.indexOf('pass') !== -1) {
          return 'password'
        } else if (F.indexOf('file') !== -1) {
          return 'file'
        } else if (F.indexOf('color') !== -1) {
          return 'color'
        } else if (F.indexOf('text') !== -1) {
          return 'textarea'
        } else if (F.indexOf('pgb') !== -1) {
          return this.static ? 'progressbar' : 'range'
        } else {
          return 'text'
        }
      },
      getClass: function () {
        if (['select', 'checkbox'].indexOf(this.$data.elem.type) === -1) {
          return 'form-control input-' + this.size
        } else {
          return ''
        }
      },
      getFormatter: function () {
        return x => {
          return T.format(x, this.format, this.translate)
        }
      }
    },
    data: function () {
      return {
        elem: {
          model: this.model,
          id: this.id,
          type: this.getType(),
          format: this.format,
          placeholder: this.placeholder,
          source: this.source,
          options: this.getOptions(),
          dependencies: this.dependencies,
          required: this.required,
          size: this.size,
          multiple: this.multiple,
          href: this.parseHref(this.href)
        }
      }
    },
    watch: {
      model: function () {
        this.$data.elem.model = this.model
        this.$data.elem.href = this.parseHref(this.href)
      },
      id: function () {
        this.$data.elem.id = this.id
      },
      format: function () {
        this.$data.elem.format = this.format
        this.$data.elem.type = this.getType()
        this.$data.elem.options = this.getOptions()
      },
      placeholder: function () {
        this.$data.elem.placeholder = this.placeholder
      },
      source: function () {
        this.$data.elem.source = this.source
        this.$data.elem.type = this.getType()
      },
      options: function () {
        this.$data.elem.options = this.getOptions()
        this.$data.elem.type = this.getType()
      },
      dependencies: function () {
        this.$data.elem.dependencies = this.dependencies
      },
      size: function () {
        this.$data.elem.size = this.size
      },
      href: function () {
        this.$data.elem.href = this.parseHref(this.href)
      }
    }
  }
</script>

<template>
  <div
    :class="[
      compact ? '' : 'form-group', 
      'form-group-' + elem.size,
      error ? 'has-error': '', 
      col > 0 ? ('col-xs-' + Math.floor(12 / col)) : ''
    ]"
  >
    <label
      v-if="label !== '' && col"
      :class="['control-label', 'col-xs-' + (2 * col)]"
    >
      {{label || id}}:
    </label>
    <div :class="['col-xs-' + (12 - (label !== '' ? 2 * col : 0))]">
      <tmx-input :class="getClass()" v-if="!static" v-bind="elem"></tmx-input>
      <p v-else class="form-control-static">
        <tmx-input v-bind="elem" :formatter="getFormatter()"></tmx-input>
      </p>
      <span class="help-block" v-if="error">
        {{error}}
      </span>
    </div>
  </div>
</template>
