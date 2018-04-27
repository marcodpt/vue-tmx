<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'

  module.exports = {
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
      placeholder: {
        type: String,
        default: ''
      },
      format: {
        type: String,
        default: 'string'
      },
      size: {
        type: String,
        default: 'md',
        validator: lib.methods.isSize
      }
    },
    methods: {
      blur: function () {
        this.$set(this.model, this.id, T.parse(this.format)(this.model[this.id]))
      },
      getType: function () {
        if (this.format === 'date') {
          return 'date'
        } else if (this.format.indexOf(':pass') !== -1) {
          return 'password'
        } else {
          return 'input'
        }
      }
    }
  }
</script>

<template>
  <input 
    :class="['form-control', 'input-' + size]"
    :disabled="disabled"
    :placeholder="placeholder"
    :type="getType()"
    :id="id"
    v-model="model[id]"
    @blur="blur"
  />
</template>
