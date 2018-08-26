<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxForm from './form.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-form': tmxForm
    },
    props: {
      model: {
        type: Object,
        default: () => {return {}}
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
        buttons: [],
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
          this.$data.icon2 = 'question-circle'
        } else {
          this.$data.icon2 = 'exclamation-circle'
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

        var buttons = []

        if (this.submit) {
          buttons.push({
            type: 'primary',
            icon: 'check',
            label: this.translate('confirm')
          })
        }
        buttons.push({
          type: 'danger',
          icon: 'times',
          label: this.translate('close'),
          click: this.hide
        })
        this.populate(buttons, this.$data.buttons)

        this.$data.isOpen = true
        setTimeout(() => this.$data.fadeIn = true, 0)
        document.body.className = 'modal-open'
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
      <tmx-form
        :id="id"
        v-if="isOpen"
        :model="model"
        :fields="fields"
        :submit="submit"
        :icon="icon2"
        :label="label2"
        :alert="alert2"
        :text="text"
        :language="language"
        :buttons="buttons"
        :onClose="hide"
      />
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
