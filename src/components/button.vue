<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxIcon from './icon.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-icon': tmxIcon
    },
    props: {
      type: {
        type: String,
        default: 'default',
        validator: lib.methods.isButton
      },
      icon: {
        type: String,
        default: ''
      },
      click: {
        type: Function
      },
      src: {
        type: String,
        default: ''
      },
      block: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: 'md',
        validator: lib.methods.isSize
      },
      label: {
        type: String,
        default: ''
      },
      data: {}
    },
    methods: {
      clicked: function () {
        if (this.disabled) {
          return
        } else if (this.click) {
          this.click(this.data)
        } else if (this.src) {
          var X = this.src.split('/')
          T.download(document, X[X.length - 1], this.src)
        }
      }
    }
  }
</script>

<template>
  <button 
    @click="clicked"
    :class="[
      'btn', 
      'btn-' + size, 
      'btn-' + type, 
      block ? 'btn-block' : '', 
      disabled ? 'disabled' : '', 
    ]"
    type="button"
  >
    <tmx-icon :name="icon" />
    {{label}}
  </button>
</template>
