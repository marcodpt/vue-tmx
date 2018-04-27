<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxIcon from './icon.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-icon': tmxIcon
    },
    props: {
      click: {
        type: Function,
        required: true
      },
      type: {
        type: String,
        default: 'default',
        validator: lib.methods.isButton
      },
      icon: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
      items: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    mounted: function () {
      this.listenClick(true)
    },
    data: function () {
      return {
        isOpen: false,
        id: 'dropdown_' + T.randomId()()
      }
    }
  }
</script>

<template>
  <div :class="['btn-group', isOpen ? 'open' : '']">
    <button type="button" :class="['btn', 'btn-' + type]" v-on:click="click()">
      <tmx-icon :type="icon"></tmx-icon>
      {{label}}
    </button>
    <button
      v-if="items && items.length"
      type="button"
      :id="id"
      class="btn dropdown-toggle"
      :class="['btn-' + type]"
      data-toggle="dropdown"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <span class="caret"></span>
    </button>
    <ul v-if="items && items.length" class="dropdown-menu">
      <li v-for="(item, index) in items">
        <slot :index="index" :item="item"></slot>
      </li>
    </ul>
  </div>
</template>
