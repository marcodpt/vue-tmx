<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxFields from './fields.vue'
  import tmxIcon from './icon.vue'
  import tmxButton from './button.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-fields': tmxFields,
      'tmx-icon': tmxIcon,
      'tmx-button': tmxButton
    },
    props: {
      model: {
        type: Object,
        default: function () {
          return {}
        }
      },
      fields: {
        type: Array
      },
      submit: {
        type: Function
      },
      onChange: {
        type: Function
      },
      onClose: {
        type: Function
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
      label: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      },
      buttons: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data: function () {
      return {
        backup: T.copy(this.model)
      }
    },
    watch: {
      model: {
        deep: true,
        handler: function () {
          if (typeof this.onChange === 'function') {
            var diff = false
            Object.keys(this.model).forEach(key => {
              if (this.model[key] != this.$data.backup[key]) {
                diff = true
              }
            })
            if (diff && this.validateModel()) {
              this.$data.backup = T.copy(this.model)
              this.onChange(this.model)
            }
          }
        }
      }
    },
    methods: {
      run: function () {
        if (typeof this.submit === 'function' && this.validateModel()) {
          this.submit(this.model)
        }
      }
    }
  }
</script>

<template>
  <div class="thumbnail">
    <div v-if="onClose || label || icon" class="modal-header">
      <tmx-button
        v-if="onClose"
        type="danger"
        class="pull-left"
        icon="remove"
        :click="onClose"
        :size="size"
        :label="translate('close')"
      />
      <h4 v-if="label || icon" style="text-align:center" class="modal-title">
        <tmx-icon :name="convert(icon)" /> {{label}}
      </h4>
    </div>
    <div class="modal-body">
      <tmx-fields
        :model="model"
        :fields="fields"
        :language="language"
        :compact="submit === undefined && onChange === undefined"
        :size="size"
        :submit="run"
      ></tmx-fields>
      <div style="clear: both;"></div>
    </div>
    <div v-if="buttons.length" class="modal-footer">
      <tmx-button v-for="button in buttons" v-bind="button" :click="button.click || run" :size="size"/>
    </div>
  </div>
</template>
