<script type="text/babel">
  import Vue from '../node_modules/vue/dist/vue.js'
  import T from 'libt'
  import {modal, transform} from 'vue-transform'
  import tmx from './index.vue'
  import table from './json/table.json'
  import VueGitHubCorners from 'vue-gh-corners'

  Vue.use(VueGitHubCorners)

  Vue.component('modal', modal)
  Vue.component('transform', transform)
  Vue.component('tmx', tmx)

  table.fields.forEach((field, i) => {
    if (field.click === '&delete') {
      table.fields[i].click = function () {
        this.$root.$data.modal = {
          text: "Are you sure you want do delete this item?",
          icon: 'trash',
          label: 'Delete',
          fields: [],
          submit: () => {
            setTimeout (() => {
              this.$root.$data.modal = {
                text: "Item deleted! Just a joke!",
                icon: 'trash',
                label: 'Delete',
                fields: [], 
                buttons: [
                  {
                    type: 'danger',
                    icon: 'times',
                    label: 'Close',
                    click: 'hide'
                  }
                ]
              }
            }, 500)
          }, 
          buttons: [
            {
              type: 'primary',
              icon: 'check',
              label: 'Confirm'
            }, {
              type: 'danger',
              icon: 'times',
              label: 'Close',
              click: 'hide'
            }
          ]
        }
      }
    } else if (field.click === '&put') {
      table.fields[i].click = function (model) {
        this.$root.$data.modal = {
          icon: 'edit',
          label: 'Put',
          fields: [
            {
              id: '_id',
              label: 'Id',
              format: 'string',
              static: true
            }, {
              id: 'balance',
              label: 'Balance ($)',
              format: 'number:2'
            }
          ],
          model: model,
          submit: model => {
            setTimeout (() => {
              this.$root.$data.modal = {
                text: JSON.stringify(model, undefined, 2),
                icon: 'edit',
                label: 'Put',
                fields: [], 
                buttons: [
                  {
                    type: 'danger',
                    icon: 'times',
                    label: 'Close',
                    click: 'hide'
                  }
                ]
              }
            }, 500)
          }, 
          buttons: [
            {
              type: 'primary',
              icon: 'check',
              label: 'Confirm'
            }, {
              type: 'danger',
              icon: 'times',
              label: 'Close',
              click: 'hide'
            }
          ]
        }
      }
    } else if (field.format === 'date') {
      table.fields[i].formatter = x => {
        var d = new Date(x)
        return d.toLocaleString().split(' ')[0]
      }
    } else if (field.format === 'boolean') {
      table.fields[i].formatter = x => {
        return x ? 'True' : 'False'
      }
    }
  })

  table.methods.forEach((method, i) => {
    if (method.click === '&post') {
      table.methods[i].click = function () {
        this.$root.$data.modal = {
          icon: 'pencil-alt',
          label: 'Insert',
          fields: [
            {
              id: 'balance',
              label: 'Balance ($)',
              format: 'number'
            }
          ],
          model: {
            balance: 3000
          },
          submit: model => {
            setTimeout (() => {
              this.$root.$data.modal = {
                text: JSON.stringify(model, undefined, 2),
                icon: 'pencil-alt',
                label: 'Post',
                fields: [], 
                buttons: [
                  {
                    type: 'danger',
                    icon: 'times',
                    label: 'Close',
                    click: 'hide'
                  }
                ]
              }
            }, 500)
          }, 
          buttons: [
            {
              type: 'primary',
              icon: 'check',
              label: 'Confirm'
            }, {
              type: 'danger',
              icon: 'times',
              label: 'Close',
              click: 'hide'
            }
          ]
        }
      }
    } else if (method.click === '&exec') {
      table.methods[i].click = function () {
        this.$root.$data.modal = {
          text: "I am going to do some crazy stuff! Are you sure?",
          icon: 'play',
          label: 'Exec',
          fields: [],
          submit: () => {
            setTimeout (() => {
              this.$root.$data.modal = {
                text: "Do nothing is crazy!",
                icon: 'play',
                label: 'Exec',
                fields: [], 
                buttons: [
                  {
                    type: 'danger',
                    icon: 'times',
                    label: 'Close',
                    click: 'hide'
                  }
                ]
              }
            }, 500)
          }, 
          buttons: [
            {
              type: 'primary',
              icon: 'check',
              label: 'Confirm'
            }, {
              type: 'danger',
              icon: 'times',
              label: 'Close',
              click: 'hide'
            }
          ]
        }
      }
    }
  })

  new Vue({
    data: {
      modal: null,
      ready: false,
      schema: null,
      model: null,
      fields: null,
      tests: {
        label: 'TMX Table sample',
        icon: 'table',
        fields: table.fields,
        data: table.data,
        methods: table.methods,
        rows: 4,
        aggregate: true,
        sort: true,
        search: true,
        filter: true,
        group: true,
        download: {}
      }
    },
    methods: {
      submit: function (data) {
        this.$data.schema = T.copy(data)
        this.$data.ready = true
      },
      build: function () {
        this.$data.ready = false
        this.$data.model = T.copy(this.tests)
        this.$data.fields = T.copy(tmx.props)
      }
    },
    mounted: function () {
      this.build()
    }
  }).$mount('#app')
</script>
