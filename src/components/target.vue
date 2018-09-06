<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxIcon from './icon.vue'
  import inputag from 'vue-inputag'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-icon': tmxIcon,
      'vue-inputag': inputag
    },
    props: {
      model: {
        type: Object,
        default: null
      },
      id: {
        type: String
      },
      label: {
        type: String
      },
      input: {
        type: Object
      },
      click: {
        type: Function
      },
      parse: {
        type: Function,
        default: x => x
      },
      validator: {
        type: Function,
        default: x => ''
      }
    },
    methods: {
      center: function () {
        return !T.match('text')(this.model[this.id])
      },
      run: function () {
        if (typeof this.click === 'function') {
          this.click(this.model)
        }
      }
    }
  }
</script>

<template>
  <button v-if="click" @click="run">
    {{label}}{{model[id]}}
  </button>
  <hr v-else-if="!id && !label"/>
  <h4 v-else-if="!id">{{label}}</h4>
  <div v-else>
    <label v-if="label">{{label}}</label>
    <span v-if="!input">{{model[id]}}</span>
    <input v-else v-model="model[id]" @blur="parse" v-bind="input"/>
    <span v-if="error">{{error}}</span>
  </div>
</template>
