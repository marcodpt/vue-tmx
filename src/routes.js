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
        component: 'tmx-tests',
        props: {
          component: 'icon',
          tests: {
            name: 'check'
          }
        }
      }, {
        path: 'button',
        component: 'tmx-tests',
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
        component: 'tmx-tests',
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
      }, {
        path: 'data',
        component: 'tmx-tests',
        props: {
          component: 'data',
          tests: {
            model: {id: '2018-12-25'},
            id: 'id',
            format: 'date'
          }
        }
      }
    ]
  }, {
    path: '/fields',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        path: 'checkbox',
        component: 'tmx-tests',
        props: {
          component: 'checkbox',
          tests: {
            model: {id: true},
            id: 'id'
          }
        }
      }, {
        path: 'progressbar',
        component: 'tmx-tests',
        props: {
          component: 'progressbar',
          tests: {
            model: {id: 32, pgbcolor: 'red'},
            id: 'id',
            value: 20
          }
        }
      }, {
        path: 'input',
        component: 'tmx-tests',
        props: {
          component: 'input',
          tests: {
            model: {id: 'Test'},
            id: 'id'
          }
        }
      }, {
        path: 'text',
        component: 'tmx-tests',
        props: {
          component: 'text',
          tests: {
            model: {id: 'Test'},
            id: 'id'
          }
        }
      }, {
        path: 'select',
        component: 'tmx-tests',
        props: {
          component: 'select',
          tests: {
            model: {id: 'Gauss'},
            id: 'id',
            source: function (model, callback) {
              callback([
                "Eistein",
                "Newton",
                "Gauss",
                "Euler",
                "Riemann"
              ])
            }
          }
        }
      }, {
        path: 'file',
        component: 'tmx-tests',
        props: {
          component: 'file',
          tests: {
            model: {},
            id: 'id'
          }
        }
      }, {
        path: 'item',
        component: 'tmx-tests',
        props: {
          component: 'item',
          tests: {
            model: {id: 'Test'},
            id: 'id'
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
        path: 'pager',
        component: 'tmx-tests',
        props: {
          component: 'pager',
          tests: {
            model: {page: 1},
            rows: 3,
            input: table.data
          }
        }
      }, {
        path: 'filter',
        component: 'tmx-tests',
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
        component: 'tmx-tests',
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
        component: 'tmx-tests',
        props: {
          component: 'download',
          tests: {
            data: table.data,
            fields: table.fields
          }
        }
      }, {
        path: 'head',
        component: 'tmx-tests',
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
        component: 'tmx-tests',
        props: {
          component: 'body',
          tests: {
            model: {id: 'Test'},
            id: 'id'
          }
        }
      }, {
        path: 'search',
        component: 'tmx-tests',
        props: {
          component: 'search',
          tests: {
            input: table.data,
            output: [],
            onChange: function () {
              console.log('search: ' + this.model.search)
              console.log('input: ' + this.input.length)
              console.log('output: ' + this.output.length)
            }
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
        path: 'form',
        component: 'tmx-tests',
        props: {
          component: 'form',
          tests: {
            model: form.model,
            label: 'Test form'
          }
        }
      }, {
        path: 'modal',
        component: 'tmx-tests',
        props: {
          component: 'modal',
          tests: {
            model: form.model,
            fields: form.fields,
            submit: function () {
              console.log('submited')
              console.log(this.model)
            }
          }
        }
      }, {
        path: 'raw',
        component: 'tmx-tests',
        props: {
          component: 'table',
          tests: {
            data: table.data
          }
        }
      }, {
        path: 'spinner',
        component: 'tmx-tests',
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
        component: 'tmx-tests',
        props: {
          component: 'table',
          tests: {
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
