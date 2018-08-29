<script type="text/babel">
  module.exports = {
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
      actions: {
        type: Array,
        default: function () {
          return []
        }
      }
    }
  }
</script>

<template>
</template>
