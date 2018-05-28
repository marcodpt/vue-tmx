<script type="text/babel">
  import tmxPanel from './panel.vue'

  module.exports = {
    components: {
      'tmx-panel': tmxPanel
    },
    props: {
      panels: {
        type: Array,
        default: function () {
          return []
        }
      },
      time: {
        type: Number,
        default: 0
      }
    },
    data: function () {
      return {
        pager: {
          rows: 1,
          model: {
            page: 0
          },
          label: '$index / $end',
          input: this.panels,
          output: [],
          time: this.time
        }
      }
    },
    watch: {
      panels: function () {
        this.$data.pager.input = this.panels
      },
      time: function () {
        this.$data.pager.time = this.time
      }
    }
  }
</script>

<template>
  <tmx-panel v-bind="pager.output[0]" :pager="pager" />
</template>
