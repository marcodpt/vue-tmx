<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxIcon from './icon.vue'
  import tmxButton from './button.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-icon': tmxIcon,
      'tmx-button': tmxButton
    },
    props: {
      id: {
        type: String,
        default: '' 
      },
      label: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      },
      sort: {
        type: Boolean,
        default: true
      },
      check: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: function () {
          return []
        }
      },
      model: {
        type: Object,
        default: function () {
          return {}
        }
      },
      modelId: {
        type: String,
        default: 'sort'
      }
    },
    data: function () {
      return {
        lock: false
      }
    },
    methods: {
      reSort: function () {
        this.$data.lock = true
        if (this.model[this.modelId]) {
          T.sync(this.data, T.sort([this.model[this.modelId]])(this.data))
        }
      },
      runSort: function () {
        if (this.sort && this.id !== '') {
          if (this.model[this.modelId] === this.id) {
            this.$set(this.model, this.modelId, '-' + this.id) 
          } else {
            this.$set(this.model, this.modelId, this.id) 
          }
          this.reSort()
        }
      },
      runCheck: function () {
        this.data.forEach((row, i) => {
          this.$set(this.data[i], this.id, row[this.id] ? false : true) 
        })
        this.reSort()
      }
    },
    watch: {
      data: function () {
        if (this.id === this.model[this.modelId] || `-${this.id}` === this.model[this.modelId]) {
          if (this.$data.lock) {
            this.$data.lock = false
          } else {
            this.reSort()
          }
        }
      }
    }
  }
</script>

<template>
  <th style="vertical-align:middle;text-align:center">
    <tmx-button
      v-if="check"
      type="success"
      icon="check"
      size="sm"
      :click="runCheck"
    />
    <a 
      @click="runSort" 
      style="text-decoration:none;"
      :style="{cursor: sort && id !== '' ? 'pointer' : undefined}"
    >
      <tmx-icon :name="icon"/>
      {{label || placeholder}}
      <span v-if="model[modelId] === id" class="caret"></span>
      <span v-if="model[modelId] === '-' + id" class="dropup">
        <span class="caret"></span>
      </span>
    </a>
  </th>
</template>
