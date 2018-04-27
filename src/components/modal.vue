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
      icon: {
        type: String
      },
      label: {
        type: String
      },
      alert: {
        type: String
      },
      text: {
        type: String,
        default: ''
      },
      show: {
        type: Number,
        default: 1
      },
      language: {
        type: String,
        default: 'en'
      }
    },
    mounted: function () {
      this.listenClick()
      if (this.show) {
        this.open()
      }
    },
    watch: {
      show: function () {
        if (this.show) {
          this.open()
        } else {
          this.hide()
        }
      },
      isOpen: function () {
        if (this.$data.isOpen) {
          this.open()
        } else {
          this.hide()
        }
      }
    },
    data: function () {
      return {
        id: 'content_' + T.randomId()(),
        isOpen: false,
        fadeIn: false,
        size: 'sm',
        icon2: '',
        label2: '',
        alert2: ''
      }
    },
    methods: {
      hide: function () {
        this.$data.isOpen = false
        this.$data.fadeIn = false
        document.body.className = ''
      },
      open: function () {
        if (this.fields instanceof Array) {
          this.$data.size = this.fields.length ? 'lg' : 'sm'
        } else {
          this.$data.size = Object.keys(this.model).length ? 'lg' : 'sm'
        }

        if (this.isIcon(this.icon)) {
          this.$data.icon2 = this.icon
        } else if (this.submit) {
          this.$data.icon2 = 'question-sign'
        } else {
          this.$data.icon2 = 'exclamation-sign'
        }

        if (this.isAlert(this.alert)) {
          this.$data.alert2 = this.alert
        } else if (this.submit) {
          this.$data.alert2 = 'info'
        } else {
          this.$data.alert2 = 'danger'
        }

        if (this.label !== undefined) {
          this.$data.label2 = this.label
        } else if (this.submit) {
          this.$data.label2 = this.translate('confirm')
        } else if (this.$data.alert2 === 'danger') {
          this.$data.label2 = this.translate('error')
        } else {
          this.$data.label2 = this.translate('alert')
        }

        this.$data.isOpen = true
        setTimeout(() => this.$data.fadeIn = true, 0)
        document.body.className = 'modal-open'
      },
      run: function () {
        if (typeof this.submit === 'function' && this.validateModel()) {
          this.submit(this.model)
          this.hide()
        }
      }
    }
  }
</script>

<template>
  <div
    :class="['modal fade', fadeIn ? 'in' : '']"
    role="dialog"
    :style="{
      display: isOpen ? 'block' : 'none'
    }"
  >
    <div :class="['modal-dialog modal-' + size]">
      <div v-if="isOpen" :id="id" class="modal-content">
        <div v-if="icon2 || label2" class="modal-header">
          <h4 class="modal-title text-center">
            <tmx-icon :type="icon2"></tmx-icon>
            {{label2}}
          </h4>
        </div>
        <div v-if="size === 'lg' || text" class="modal-body">
          <tmx-fields
            v-if="size === 'lg'"
            :model="model"
            :fields="fields"
            :language="language"
            :compact="submit === undefined"
          ></tmx-fields>
          <div 
            v-if="text"
            :class="['alert', 'alert-' + alert2] " 
            style="white-space:pre-line;"
          ><big>{{text}}</big></div>
          <div style="clear: both;"></div>
        </div>
        <div class="modal-footer">
          <tmx-button v-if="submit" type="primary" icon="ok" :click="run" :label="translate('confirm')" />
          <tmx-button type="danger" icon="remove" :click="hide" :label="translate('close')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .modal {
    transition: all 0.3s ease;
  }
  .modal.in {
    background-color: rgba(0,0,0,0.5);
  }
</style>
