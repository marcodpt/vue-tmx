<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxIcon from './icon.vue'
  import target from './target.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-icon': tmxIcon,
      'target': target
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
      }
    },
    data: function () {
      return {
        backup: T.copy(this.model),
        compact: !this.submit && !this.onChange,
        Fields: []
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
          var fields = []
          Object.keys(this.model).forEach(key => {
            if (this.model[key] != null) {
              fields.push({
                id: key,
                label: key,
                type: typeof this.model[key]
              })
            }
          })
          T.sync(this.$data.Fields, fields)
        } else {
          T.sync(this.$data.Fields, this.fields)
        }
      },
      getInput: function () {

      },
      submit: function () {

      }
    }
  }
</script>

<template>
  <form @submit.prevent="submit">
    <target v-for="field in Fields" :model="model" v-bind="field"></target>
  </form>
</template>
