<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxItem from './item.vue'

  module.exports = {
    mixins: [lib],
    components: {
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
      language: {
        type: String,
        default: 'en'
      },
      compact: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default: 'md',
        validator: lib.methods.isSize
      }
    },
    mounted: function () {
      this.load()
    },
    watch: {
      fields: function () {
        this.load()
      }
    },
    data: function () {
      return {
        fields2: []
      }
    },
    methods: {
      load: function () {
        if (!(this.fields instanceof Array)) {
          this.populate(this.setFields(this.model), this.$data.fields2)
        } else {
          this.populate(this.fields, this.$data.fields2)
        }
        this.$data.fields2.forEach(field => {
          this.$set(this.model, field.id, T.parse(field.format)(this.model[field.id]))
        })
      }
    }
  }
</script>

<template>
  <form class="form-horizontal" @submit.prevent="submit">
    <tmx-item
      v-for="(field, index) in fields2"
      :key="index"
      :model="model"
      v-bind="field"
      :static="field.static || compact"
      :language="language"
      :compact="compact"
      :size="field.size || size"
    >
    </tmx-item>
  </form>
</template>
