<script type="text/babel">
  import T from 'libt'
  import {transform} from 'vue-transform'
  import body from './body.vue'
  import button from './button.vue'
  import download from './download.vue'
  import dropdown from './dropdown.vue'
  import filter from './filter.vue'
  import group from './group.vue'
  import head from './head.vue'
  import icon from './icon.vue'
  import search from './search.vue'
  import table from './table.vue'

  module.exports = {
    components: {
      transform: transform,
      'v-body': body,
      'v-button': button,
      'v-download': download,
      'v-dropdown': dropdown,
      'v-filter': filter,
      'v-group': group,
      'v-head': head,
      'v-icon': icon,
      'v-search': search,
      'v-table': table
    },
    props: {
      component: {
        type: String,
        default: ''
      },
      tests: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data: function () {
      return {
        ready: false,
        schema: null,
        model: null,
        fields: null
      }
    },
    methods: {
      submit: function (data) {
        if (this.component === 'modal') {
          this.$root.$data.modal = T.copy(data)
        } else {
          this.$data.schema = T.copy(data)
        }
        this.$data.ready = true
      },
      build: function () {
        this.$data.ready = false
        this.$data.model = T.copy(this.tests)
        this.$data.fields = T.copy(this.$options.components[`v-${this.component}`].props)
      }
    },
    mounted: function () {
      this.build()
    },
    watch: {
      component: function () {
        this.build()
      },
      tests: function () {
        this.build()
      }
    }
  }
</script>

<template>
  <div>
    <div v-if="ready">
      <v-body v-if="component === 'body'" v-bind="schema" />
      <v-dropdown v-if="component === 'dropdown'" v-bind="schema" />
      <v-button v-if="component === 'button'" v-bind="schema" />
      <v-download v-if="component === 'download'" v-bind="schema" />
      <v-filter v-if="component === 'filter'" v-bind="schema" />
      <v-group v-if="component === 'group'" v-bind="schema" />
      <v-head v-if="component === 'head'" v-bind="schema" />
      <v-icon v-if="component === 'icon'" v-bind="schema" />
      <v-search v-if="component === 'search'" v-bind="schema" />
      <v-table v-if="component === 'table'" v-bind="schema" />
    </div>
    <transform
      icon="cog"
      :label="'Live Playground '+component"
      :model="model"
      :fields="fields"
      :submit="submit"
      :buttons="[{
        type: 'primary',
        icon: 'cog',
        label: 'Rebuild'
      }]"
    />
  </div>
</template>
