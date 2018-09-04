<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxInput from './input.vue'
  import tmxButton from './button.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-input': tmxInput,
      'tmx-button': tmxButton
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
        default: true
      },
      format: {
        type: String,
        default: 'string',
        validator: function (value) {
          if (value && !lib.methods.isType(value.split(':')[0])) {
            T.debug(value)
          }
          return !value || lib.methods.isType(value.split(':')[0])
        }
      },
      label: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      },
      button: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      click: {
        type: Function
      }
    },
    data: function () {
      return {
        elem: {
          id: this.id,
          format: this.format,
          placeholder: this.placeholder
        }
      }
    },
    watch: {
      id: function () {
        this.$data.elem.id = this.id
      },
      format: function () {
        this.$data.elem.format = this.format
      },
      placeholder: function () {
        this.$data.elem.placeholder = this.placeholder
      }
    },
    methods: {
      center: function () {
        return !T.match('text')(this.model[this.id])
      },
      bgcolor: function () {
        if (this.format.split(':').indexOf('rgb') > -1 && this.model[this.id]) {
          return `#${this.model[this.id]}`
        }
        return null
      },
      getFormatter: function () {
        return x => {
          return T.format(x, this.format, this.translate)
        }
      }, 
      getType: function () {
        if (this.static) {
          return this.format === 'integer:pgb' ? 'progressbar' : ''
        } else {
          return this.format === 'boolean' ? 'checkbox' : 'text'
        }
      },
      getClass: function () {
        return this.getType() === 'text' ? 'form-control' : ''
      },
      getLabel: function () {
        return T.format(this.model[id], this.format, this.translate)
      }
    }
  }
</script>

<template>
  <td :style="{
    'text-align': center() ? 'center' : null,
    'vertical-align': 'middle',
    'background-color': bgcolor()
  }">
    <tmx-button
      v-if="button && click"
      :type="button"
      :icon="icon"
      :click="click"
      :data="model"
      :label="label"
    />
    <tmx-button
      v-else-if="click"
      type="info"
      :icon="icon"
      :click="click"
      :data="model"
      :label="getLabel()"
    />
    <tmx-input
      v-else
      v-bind="elem"
      :type="getType()"
      :class="getClass()"
      :formatter="getFormatter()"
      :model="model"
    >
    </tmx-input>
  </td>
</template>
