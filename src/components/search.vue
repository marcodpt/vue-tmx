<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxInput from './input.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-input': tmxInput
    },
    props: {
      model: {
        type: Object,
        default: function () {
          return {
            search: ''
          }
        }
      },
      input: {
        type: Array,
        default: function () {
          return []
        }
      },
      output: {
        type: Array,
        default: function () {
          return []
        }
      },
      language: {
        type: String,
        default: 'en'
      },
      onChange: {
        type: Function,
        default () {}
      }
    },
    mounted: function () {
      this.run(this.model.search)
    },
    methods: {
      run: function (newVal, oldVal) {
        var R = []
        var I

        newVal = newVal ? newVal.toLowerCase() : ''
        oldVal = oldVal ? oldVal.toLowerCase() : ''

        if (!oldVal || !newVal || newVal.indexOf(oldVal) === -1) {
          I = this.input
        } else {
          I = this.output
        }

        I.forEach(row => {
          var match = false
          Object.keys(row).forEach(key => {
            if (!match && String(row[key]).toLowerCase().indexOf(newVal) !== -1) {
              match = true
            }
          })
          if (match) {
            R.push(row)
          }
        })

        this.populate(R, this.output)

        this.onChange()
      }
    },
    watch: {
      input: function () {
        this.run(this.model.search)
      },
      'model.search': function (newVal, oldVal) {
        this.run(newVal, oldVal)
      }
    }
  }
</script>

<template>
  <tmx-input :model="model" id="search" :placeholder="translate('search')">
  </tmx-input>
</template>
