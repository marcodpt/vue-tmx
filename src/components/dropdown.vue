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
      icon: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
      links: {
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
  <li :class="['dropdown', isOpen ? 'open' : '']">
    <a 
      :id="id"
      class="dropdown-toggle"
      data-toggle="dropdown"
      role="button"
      aria-haspopup="true"
      :aria-expanded="isOpen"
      style="cursor:pointer;"
    >
      <tmx-icon :type="icon"></tmx-icon>
      {{label}}
      <span class="caret"></span>
    </a>
    <ul class="dropdown-menu">
      <li v-for="link in links">
        <a :href="link.href">
          <tmx-icon :type="link.icon"></tmx-icon>
          {{link.label}}
        </a>
      </li>
    </ul>
  </li>
</template>
