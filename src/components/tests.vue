<script type="text/babel">
  import T from 'libt'
  import tmx from '../index.vue'

  var components = {}
  Object.keys(tmx).forEach(key => {
    if (key !== 'lib') {
      components[`tmx-${key}`] = tmx[key]
    }
  })

  module.exports = {
    components: components,
    props: {
      case: {
        type: String,
        default: ''
      },
      component: {
        type: String,
        default: ''
      },
      tests: {
        type: Object,
        default: function () {
          return {}
        }
      },
      isReady: {
        type: Function
      }
    },
    data: function () {
      return {
        ready: false
      }
    },
    methods: {
      callback: function () {
        this.$data.ready = true
        if (this.isReady) {
          this.isReady()
        } 
        if (this.component === 'modal') {
          this.$root.$data.modal = T.copy(this.tests)
        }
      },
      getProps: function () {
        var name = 'tmx-' + (this.component === 'modal' ? 'form' : this.component)
        return this.$options.components[name].props
      }
    },
    watch: {
      component: function () {
        this.$data.ready = false
      }
    }
  }
</script>

<template>
  <div>
    <div v-if="ready">
      <tmx-body v-if="component === 'body'" v-bind="tests" />
      <tmx-dropdown v-if="component === 'dropdown'" v-bind="tests" />
      <tmx-button v-if="component === 'button'" v-bind="tests" />
      <tmx-download v-if="component === 'download'" v-bind="tests" />
      <tmx-filter v-if="component === 'filter'" v-bind="tests" />
      <tmx-form v-if="component === 'form'" v-bind="tests" />
      <tmx-group v-if="component === 'group'" v-bind="tests" />
      <tmx-head v-if="component === 'head'" v-bind="tests" />
      <tmx-icon v-if="component === 'icon'" v-bind="tests" />
      <tmx-search v-if="component === 'search'" v-bind="tests" />
      <tmx-table v-if="component === 'table'" v-bind="tests" />
      <tmx-raw v-if="component === 'raw'" v-bind="tests" />
      <tmx-refined v-if="component === 'refined'" v-bind="tests" />
      <tmx-data2html v-if="component === 'data2html'" v-bind="tests" />
      <tmx-twbs3 v-if="component === 'twbs3'" v-bind="tests" />
    </div>
    <tmx-playground
      :model="tests"
      :name="component"
      :props="getProps()"
      :callback="callback"
    ></tmx-playground>
  </div>
</template>
