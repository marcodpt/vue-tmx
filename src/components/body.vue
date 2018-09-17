<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import inputag from 'vue-inputag'
  import tmxButton from './button.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'vue-inputag': inputag,
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
      click: {
        type: Function
      }
    },
    data: function () {
      return {
        elem: {
          id: this.id
        }
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
        return this.button ? this.label : this.$attrs.formatter(this.model[this.id])
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
      v-if="click"
      :type="button || 'info'"
      :icon="icon"
      :click="click"
      :data="model"
      :label="getLabel()"
    />
    <vue-inputag
      v-else
      v-bind="$attrs"
      :type="getType()"
      :class="getClass()"
      :model="model"
      :id="id"
    />
  </td>
</template>
