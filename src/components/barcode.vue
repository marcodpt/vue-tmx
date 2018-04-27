<script type="text/babel">
  import T from 'libt'
  import JsBarcode from 'jsbarcode'

  module.exports = {
    props: {
      id: {
        type: String,
        default: function () {
          return 'barcode_' + T.randomId()()
        }
      },
      value: {
        type: [Number, String],
        required: true
      },
      displayValue: {
        type: Boolean,
        default: true
      },
      vertical: {
        type: Boolean,
        default: true
      }
    }, 
    methods: {
      build: function () {
        if (this.value) {
          JsBarcode(`#${this.id}`, this.value, {
            displayValue: this.displayValue
          })
        }
      }
    },
    mounted: function () {
      this.build()
    },
    watch: {
      value: function () {
        this.build()
      },
      displayValue: function () {
        this.build()
      }
    }
  }
</script>

<template>
  <img :id="id" :style="{
    display: 'block',
    margin: 'auto',
    height: vertical ? '100%' : 'auto',
    width: vertical ? 'auto' : '100%'
  }"/>
</template>
