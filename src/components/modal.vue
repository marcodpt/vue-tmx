<script type="text/babel">
  import lib from '../lib.js'
  import tmxForm from './form.vue'
  import overBody from 'vue-over-body'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-form': tmxForm,
      'vue-over-body': overBody
    },
    watch: {
      '$root.$data.modal': function () {
        this.open(this.$root.$data.modal)
      }
    },
    data: function () {
      return {
        index: 99999,
        isOpen: 0,
        size: 0,
        buttons: []
      }
    },
    methods: {
      hide: function () {
        this.$data.isOpen = 0
        this.$root.$data.modal = null
      },
      open: function (x) {
        if (x == null) {
          return
        }

        if ((x.fields instanceof Array && x.fields.length) || Object.keys(x.model || {}).length) {
          this.$data.size = 900 
        } else {
          this.$data.size = 300
        }

        if (!x.icon || !this.isIcon(x.icon)) {
          if (x.submit) {
            x.icon = 'question-circle'
          } else {
            x.icon = 'exclamation-circle'
          }
        }

        if (!this.isAlert(x.alert)) {
          if (x.submit) {
            x.alert = 'info'
          } else {
            x.alert = 'danger'
          }
        } 

        if (x.label == null) {
          if (this.submit) {
            this.$data.label2 = this.translate('confirm')
          } else if (this.$data.alert2 === 'danger') {
            this.$data.label2 = this.translate('error')
          } else {
            this.$data.label2 = this.translate('alert')
          }
        } 

        x.buttons = x.buttons || []

        if (x.submit) {
          x.buttons.push({
            type: 'primary',
            icon: 'check',
            label: this.translate('confirm')
          })
        }
        x.buttons.push({
          type: 'danger',
          icon: 'times',
          label: this.translate('close'),
          click: this.hide
        })

        x.onClose = this.hide

        this.$data.isOpen = ++this.$data.index
      }
    }
  }
</script>

<template>
  <vue-over-body :open="isOpen" :dialog-style="{'width': size + 'px'}" before="before" after="after">
    <tmx-form v-bind="$root.$data.modal"/>
  </vue-over-body>
</template>

<style>
  .before {
    opacity: 0;
    top: -100px;
    max-width: 90%;
    margin: 30px auto;
  }
  .after {
    top: 0;
    opacity: 1;
  }
</style>
