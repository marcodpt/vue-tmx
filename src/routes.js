var table = require('./json/table.json')
var form = require('./json/form.json')
var validate = require('./json/validate.json')

form.fields.forEach((field, i) => {
  if (field.source === '&country') {
    form.fields[i].source = function (model, callback) {
      callback(['Russia', 'Italy', 'Brazil'])
    }
  } else if (field.source === '&city') {
    form.fields[i].source = function (model, callback) {
      if (model.country === 'Russia') {
        callback([
          {id: 1, label: 'Moscow'},
          {id: 2, label: 'St. Petersburg'}
        ])
      } else if (model.country === 'Italy') {
        callback(['Roma', 'Veneza', 'Milao'])
      } else if (model.country === 'Brazil') {
        callback(['Sao Paulo', 'Rio de Janeiro', 'Porto Alegre', 'Manaus'])
      } else {
        callback(['Unknown'])
      }
    }
  } else if (field.source === '&banana') {
    form.fields[i].source = function (model, callback) {
      callback(['Apple', 'Banana'])
    }
  }
})

table.fields.forEach((field, i) => {
  if (field.click === '&delete') {
    table.fields[i].click = function () {
      this.$root.$data.modal = {
        text: "Are you sure you want do delete this item?",
        icon: 'trash',
        label: 'Delete',
        fields: [],
        submit: () => {
          this.$root.$data.modal = {
            text: "Item deleted! Just a joke!",
            icon: 'trash',
            label: 'Delete',
            fields: []
          }
        }
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
          this.$root.$data.modal = {
            text: JSON.stringify(model, undefined, 2),
            icon: 'edit',
            label: 'Put',
            fields: []
          }
        }
      }
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
          this.$root.$data.modal = {
            text: JSON.stringify(model, undefined, 2),
            icon: 'pencil-alt',
            label: 'Post',
            fields: []
          }
        }
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
          this.$root.$data.modal = {
            text: "Do nothing is crazy!",
            icon: 'play',
            label: 'Exec',
            fields: []
          }
        }
      }
    }
  }
})

module.exports = [
  {
    path: '/basic',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        path: 'icon',
        component: 'tests',
        props: {
          component: 'icon',
          tests: {
            name: 'check'
          }
        }
      }, {
        path: 'button',
        component: 'tests',
        props: {
          component: 'button',
          tests: {
            data: {msg: 'You click me!'},
            click: function (data) {
              window.alert(data.msg)
            },
            icon: 'play',
            label: 'Click me with router view!'
          }
        }
      }, {
        path: 'dropdown',
        component: 'tests',
        props: {
          component: 'dropdown',
          tests: {
            click: function () {
              var animals = ['dog', 'cat', 'horse', 'bird', 'lion', 'wolf', 'bear', 'pig', 'elephant']
              var label = animals[Math.floor(Math.random() * animals.length)]
              this.items.push({
                label: label,
                icon: 'exclamation',
                click: () => window.alert(label)
              })
            },
            items: [],
            label: 'Click me!',
            icon: 'plus',
            type: 'primary'
          }
        }
      }
    ]
  }, {
    path: '/controls',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        path: 'filter',
        component: 'tests',
        props: {
          component: 'filter',
          tests: {
            input: table.data,
            output: [],
            fields: table.fields
          }
        }
      }, {
        path: 'group',
        component: 'tests',
        props: {
          component: 'group',
          tests: {
            input: table.data,
            output: [],
            fields: table.fields
          }
        }
      }, {
        path: 'download',
        component: 'tests',
        props: {
          component: 'download',
          tests: {
            data: table.data,
            fields: table.fields,
            class: 'btn btn-default'
          }
        }
      }, {
        path: 'head',
        component: 'tests',
        props: {
          component: 'head',
          tests: {
            data: table.data,
            fields: table.fields,
            model: {sort: null},
            label: 'Sort Id!',
            icon: 'play',
            id: '_id'
          }
        }
      }, {
        path: 'body',
        component: 'tests',
        props: {
          component: 'body',
          tests: {
            model: {id: 'Test'},
            id: 'id'
          }
        }
      }, {
        path: 'search',
        component: 'tests',
        props: {
          component: 'search',
          tests: {
            input: table.data,
            output: [],
            onChange: function () {
              console.log('search: ' + this.model.search)
              console.log('input: ' + this.input.length)
              console.log('output: ' + this.output.length)
            },
            placeholder: 'Search',
            class: 'form-control'
          }
        }
      }
    ]
  }, {
    path: '/components',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        path: 'raw',
        component: 'tests',
        props: {
          component: 'table',
          tests: {
            data: table.data
          }
        }
      }, {
        path: 'spinner',
        component: 'tests',
        props: {
          component: 'table',
          tests: {
            fields: table.fields,
            methods: table.methods,
            rows: 4,
            aggregate: true,
            sort: true,
            search: true,
            filter: true,
            group: true,
            download: {}
          }
        }
      }, {
        path: 'table',
        component: 'tests',
        props: {
          component: 'table',
          tests: {
            label: 'Complete Table',
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
        }
      }
    ]
  }, {
    path: '*',
    redirect: '/components/table'
  }
]
