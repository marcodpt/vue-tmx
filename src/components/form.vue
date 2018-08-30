<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxIcon from './icon.vue'
  import tmxButton from './button.vue'
  import tmxItem from './item.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-icon': tmxIcon,
      'tmx-button': tmxButton,
      'tmx-item': tmxItem
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
      size: {
        type: String,
        default: 'md',
        validator: lib.methods.isSize
      },
      icon: {
        type: String,
        default: '',
        validator: lib.methods.isIcon
      },
      label: {
        type: String,
        default: ''
      },
      alert: {
        type: String,
        default: 'danger',
        validator: lib.methods.isAlert
      },
      text: {
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
        backup: T.copy(this.model),
        compact: !this.submit && !this.onChange,
        fields2: []
      }
    },
    mounted: function () {
      this.load()
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
      },
      fields: function () {
        this.load()
      }
    },
    methods: {
      run: function () {
        if (typeof this.submit === 'function' && this.validateModel()) {
          this.submit(this.model)
          if (this.onClose) {
            this.onClose()
          }
        }
      },
      hasFields: function () {
        return (this.fields && this.fields.length) || Object.keys(this.model).length
      },
      load: function () {
        if (!(this.fields instanceof Array)) {
          T.sync(this.$data.fields2, this.setFields(this.model))
        } else {
          T.sync(this.$data.fields2, this.fields)
        }
        this.$data.fields2.forEach(field => {
          this.$set(this.model, field.id, T.parse(field.format)(this.model[field.id]))
        })
      },
      validateModel: function () {
        var valid = true
        this.fields.forEach((field, i) => {
          this.$set(this.fields[i], 'error', '')
          var error = false
          var empty = this.model[field.id] == null
          field.format = field.format || 'string'
          var label = field.label || field.placeholder || field.id
          if (field.static) {
            return
          }
          if (field.format === 'json' && this.model[field.id]) {
            try {
              var x = JSON.parse(this.model[field.id])
            } catch (err) {
              this.$set(this.fields[i], 'error', `${label} ${err.toString()}`)
              valid = false
              error = true
            }
          }
          if (!error && empty && field.required) {
            if (field.format.substr(0, 6) === 'string' && !field.options && !field.src) {
              this.$set(this.model, field.id, '')
            } else {
              var err = this.translate('required')
              this.$set(this.fields[i], 'error', `${label} ${err}`)
              valid = false
              error = true
            }
          }
          if (!error && !empty && field.min > this.model[field.id]) {
            var err = T.replaceAll('$min', this.formatData(field.min, field.format))(this.translate('min'))
            this.$set(this.fields[i], 'error', `${label} ${err}`)
            valid = false
            error = true
          }
          if (!error && !empty && field.max < this.model[field.id]) {
            var err = T.replaceAll('$max', this.formatData(field.max, field.format))(this.translate('max'))
            this.$set(this.fields[i], 'error', `${label} ${err}`)
            valid = false
            error = true
          }
          if (!error && !empty && field.minLen > String(this.model[field.id]).length) {
            var err = T.replaceAll('$minLen', field.minLen)(this.translate('minLen'))
            this.$set(this.fields[i], 'error', `${label} ${err}`)
            valid = false
            error = true
          }
          if (!error && !empty && field.maxLen < String(this.model[field.id]).length) {
            var err = T.replaceAll('$maxLen', field.maxLen)(this.translate('maxLen'))
            this.$set(this.fields[i], 'error', `${label} ${err}`)
            valid = false
            error = true
          }
          if (!error && !empty && field.validate instanceof Array) {
            field.validate.forEach(v => {
              if (!error && !T.evaluate(v.assert)(this.model)) {
                this.$set(this.fields[i], 'error', `${label} ${v.error}`)
                valid = false
                error = true
              }
            })
          }
          if (!error && field.watchlen && (String(this.model[field.id]).length < field.watchlen || empty)) {
            valid = false
          }
        })

        return valid
      }
    }
  }
</script>

<template>
  <div class="thumbnail">
    <div v-if="onClose || label || icon" class="modal-header">
      <button v-if="onClose" type="button" class="close" @click="onClose">
        <tmx-icon name="times"/>
      </button>
      <h4 v-if="label || icon" style="text-align:center" class="modal-title">
        <tmx-icon :name="icon" /> {{label}}
      </h4>
    </div>
    <div v-if="hasFields() || text" class="modal-body">
      <form class="form-horizontal" @submit.prevent="submit">
        <tmx-item
          v-for="(field, index) in fields2"
          :key="index"
          :model="model"
          v-bind="field"
          :static="field.static || compact"
          :compact="compact"
          :size="field.size || size"
        >
        </tmx-item>
      </form>
      <div 
        v-if="text"
        :class="['alert', 'alert-' + alert] " 
        style="white-space:pre-line;"
      ><big>{{text}}</big></div>
      <div style="clear: both;"></div>
    </div>
    <div v-if="buttons.length" class="modal-footer">
      <tmx-button
        v-for="button in buttons"
        v-bind="button"
        :click="button.click || run"
        :size="button.size || size"
      />
    </div>
  </div>
</template>
