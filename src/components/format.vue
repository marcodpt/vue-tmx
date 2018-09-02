<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxProgressbar from './progressbar.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-progressbar': tmxProgressbar
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
      format: {
        type: String,
        default: 'string',
        validator: function (value) {
          return !value || lib.methods.isType(value.split(':')[0])
        }
      },
      size: {
        type: String,
        default: 'md',
        validator: lib.methods.isSize
      },
      href: {
        type: String,
        default: ''
      }
    },
    methods: {
      getValue: function () {
        return T.format(this.model[this.id], this.format, this.translate)
      },
      getStyle: function () {
        return {
          'white-space': T.match('text')(this.model[this.id]) ? 'pre-wrap' : null,
          'font-size': (this.size === 'lg' ? '130%' : (this.size === 'sm' ? '80%' : null))
        }
      }
    }
  }
</script>

<template>
  <tmx-progressbar
    v-if="format === 'integer:pgb'"
    :value="model[id]"
  >
  </tmx-progressbar>
  <a v-else-if="href" :href="href" target="_blank">
    <span :style="getStyle()">{{getValue()}}</span>
  </a>
  <span v-else :style="getStyle()">{{getValue()}}</span>
</template>
