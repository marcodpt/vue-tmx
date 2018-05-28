<script type="text/babel">
  import lib from '../lib.js'
  import tmxImage from './image.vue'
  import tmxButton from './button.vue'
  import tmxPager from './pager.vue'

  module.exports = {
    components: {
      'tmx-image': tmxImage,
      'tmx-button': tmxButton,
      'tmx-pager': tmxPager
    },
    props: {
      type: {
        type: String,
        validator: lib.methods.isPanel,
        default: 'default'
      },
      open: {
        type: Boolean,
        default: true
      },
      toogle: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      },
      text: {
        type: [String, Array],
        default: ''
      },
      image: {
        type: Object
      },
      block: {
        type: Object
      },
      blocks: {
        type: Array,
        default: function () {
          return []
        }
      },
      buttons: {
        type: Array,
        default: function () {
          return []
        }
      },
      pager: {
        type: Object,
        default: null
      }
    },
    data: function () {
      return {
        isOpen: this.open
      }
    },
    methods: {
      toogleMe: function () {
        if (this.toogle) {
          this.$data.isOpen = !this.$data.isOpen
        }
      },
      isArray: function (x) {
        return x instanceof Array
      }
    },
    watch: {
      open: function () {
        this.$data.isOpen = this.open
      }
    }
  }
</script>

<template>
  <div :class="['panel', 'panel-' + type]">
    <div v-if="label" class="panel-heading" @click="toogleMe">
      <div class="panel-title">
        {{label}}
      </div>
    </div>
    <div v-if="isOpen" class="panel-body">
      <tmx-pager v-if="pager" v-bind="pager"></tmx-pager>
      <div v-if="block" v-bind="block" />
      <div v-for="block in blocks" :style="block" />
      <div v-if="text && !isArray(text)" style="white-space:pre-wrap">{{text}}</div>
      <div v-if="text && isArray(text)" v-for="msg in text">{{msg}}</div>
      <tmx-image v-if="image" v-bind="image" />
      <tmx-button v-for="button in buttons" v-bind="button" />
      <slot></slot>
    </div>
  </div>
</template>
