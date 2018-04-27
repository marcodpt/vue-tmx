<script type="text/babel">
  import lib from '../lib.js'
  import tmxData from './data.vue'
  import tmxInput from './input.vue'
  import tmxText from './text.vue'
  import tmxFile from './file.vue'
  import tmxSelect from './select.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-data': tmxData,
      'tmx-input': tmxInput,
      'tmx-text': tmxText,
      'tmx-file': tmxFile,
      'tmx-select': tmxSelect
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
      language: {
        type: String,
        default: 'en'
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
      input: function () {
        var input = 'input'
        var F = this.format.split(':')

        if (this.static) {
          input = 'static'
        } else if (this.source) {
          input = 'select'
        } else if (F[0] === 'boolean') {
          input = 'select'
        } else if (F[0] === 'string') {
          if (F.indexOf('file') !== -1) {
            input = 'file'
          } else if (F.indexOf('text') !== -1) {
            input = 'text'
          }
        } else if (F[0] === 'json') {
          input = 'text'
        }

        return input
      },
      parseHref: function (href) {
        Object.keys(this.model).forEach(key => {
          while (href.indexOf(`:${key}`) !== -1 && this.model[key] !== undefined) {
            href = href.replace(`:${key}`, this.model[key])
          }
        })

        return href
      },
      getSource: function () {
        return this.format === 'boolean' ? this.selectOptions(this.selectBool()) : this.source
      }
    },
    data: function () {
      return {
        elem: {
          model: this.model,
          id: this.id,
          format: this.format,
          placeholder: this.placeholder,
          source: this.getSource(),
          dependencies: this.dependencies,
          language: this.language,
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
        this.$data.elem.source = this.getSource()
      },
      placeholder: function () {
        this.$data.elem.placeholder = this.placeholder
      },
      source: function () {
        this.$data.elem.source = this.getSource()
      },
      dependencies: function () {
        this.$data.elem.dependencies = this.dependencies
      },
      language: function () {
        this.$data.elem.language = this.language
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
      error ? 'has-error': '', 
      col > 0 ? ('col-xs-' + Math.floor(12 / col)) : ''
    ]"
  >
    <label
      v-if="label !== '' && col"
      :class="['control-label', 'col-xs-' + (2 * col)]"
      :style="{
        'font-size': (elem.size === 'lg' ? '130%' : (elem.size === 'sm' ? '80%' : null))
      }"
    >
      {{label || id}}:
    </label>
    <div :class="['col-xs-' + (12 - (label !== '' ? 2 * col : 0))]">
      <tmx-select v-if="input() === 'select'" v-bind="elem"></tmx-select>
      <tmx-file v-else-if="input() === 'file'" v-bind="elem"></tmx-file>
      <tmx-text v-else-if="input() === 'text'" v-bind="elem"></tmx-text>
      <tmx-input v-else-if="input() === 'input'" v-bind="elem"></tmx-input>
      <p v-else class="form-control-static">
        <tmx-data v-bind="elem"></tmx-data>
      </p>
      <span class="help-block" v-if="error">
        {{error}}
      </span>
    </div>
  </div>
</template>
