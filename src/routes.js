var table = require('./json/table.json')
var form = require('./json/form.json')

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
    name: 'Basic block',
    path: '/basic',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        name: 'Icon',
        path: 'icon',
        href: '/basic/icon',
        component: 'tmx-test',
        props: {
          component: 'icon',
          tests: {
            name: 'check'
          }
        }
      }, {
        name: 'Button',
        path: 'button',
        href: '/basic/button',
        component: 'tmx-test',
        props: {
          component: 'button',
          tests: {
            data: 'You click me!',
            click: function (data) {
              window.alert(data)
            },
            icon: 'play',
            label: 'Click me with router view!'
          }
        }
      }, {
        name: 'Button Split',
        path: 'split',
        href: '/basic/split',
        component: 'tmx-test',
        props: {
          component: 'button-split',
          tests: {
            click: function (index) {
              if (index === undefined) {
                this.items.push('item ' + (this.items.length + 1))
              } else {
                this.items.splice(index, 1)
              }
            },
            items: ['x', 'y', 'z'],
            label: 'Click me!',
            icon: 'plus',
            type: 'primary'
          }
        }
      }, {
        name: 'Data',
        path: 'data',
        href: '/basic/data',
        component: 'tmx-test',
        props: {
          component: 'data',
          tests: {
            model: {id: '2018-12-25'},
            id: 'id',
            format: 'date',
            language: 'en'
          }
        }
      }
    ]
  }, {
    name: 'Form Fields',
    path: '/fields',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        name: 'Checkbox',
        path: 'checkbox',
        href: '/fields/checkbox',
        component: 'tmx-test',
        props: {
          component: 'checkbox',
          tests: {
            model: {id: true},
            id: 'id'
          }
        }
      }, {
        name: 'Progress Bar',
        path: 'progressbar',
        href: '/fields/progressbar',
        component: 'tmx-test',
        props: {
          component: 'progressbar',
          tests: {
            model: {id: 32, pgbcolor: 'red'},
            id: 'id',
            value: 20
          }
        }
      }, {
        name: 'Input',
        path: 'input',
        href: '/fields/input',
        component: 'tmx-test',
        props: {
          component: 'input',
          tests: {
            model: {id: 'Test'},
            id: 'id'
          }
        }
      }, {
        name: 'Text',
        path: 'text',
        href: '/fields/text',
        component: 'tmx-test',
        props: {
          component: 'text',
          tests: {
            model: {id: 'Test'},
            id: 'id'
          }
        }
      }, {
        name: 'Select',
        path: 'select',
        href: '/fields/select',
        component: 'tmx-test',
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
        name: 'File',
        path: 'file',
        href: '/fields/file',
        component: 'tmx-test',
        props: {
          component: 'file',
          tests: {
            model: {},
            id: 'id'
          }
        }
      }, {
        name: 'Item',
        path: 'item',
        href: '/fields/item',
        component: 'tmx-test',
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
    name: 'Table Controls',
    path: '/controls',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        name: 'Pager',
        path: 'pager',
        href: '/controls/pager',
        component: 'tmx-test',
        props: {
          component: 'pager',
          tests: {
            model: {page: 1},
            rows: 3,
            input: table.data
          }
        }
      }, {
        name: 'Filter',
        path: 'filter',
        href: '/controls/filter',
        component: 'tmx-test',
        props: {
          component: 'filter',
          tests: {
            input: table.data,
            output: [],
            fields: table.fields
          }
        }
      }, {
        name: 'Group',
        path: 'group',
        href: '/controls/group',
        component: 'tmx-test',
        props: {
          component: 'group',
          tests: {
            input: table.data,
            output: [],
            fields: table.fields
          }
        }
      }, {
        name: 'Download',
        path: 'download',
        href: '/controls/download',
        component: 'tmx-test',
        props: {
          component: 'download',
          tests: {
            data: table.data,
            fields: table.fields
          }
        }
      }, {
        name: 'Head',
        path: 'head',
        href: '/controls/head',
        component: 'tmx-test',
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
        name: 'Body',
        path: 'body',
        href: '/controls/body',
        component: 'tmx-test',
        props: {
          component: 'body',
          tests: {
            model: {id: 'Test'},
            id: 'id'
          }
        }
      }, {
        name: 'Search',
        path: 'search',
        href: '/controls/search',
        component: 'tmx-test',
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
    name: 'Components',
    path: '/components',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        name: 'Form',
        path: 'form',
        href: '/components/form',
        component: 'tmx-test',
        props: {
          component: 'form',
          tests: {
            model: form.model,
            label: 'Test form'
          }
        }
      }, {
        name: 'Modal',
        path: 'modal',
        href: '/components/modal',
        component: 'tmx-test',
        props: {
          component: 'modal',
          tests: {
            model: form.model,
            fields: form.fields,
            submit: function () {
              console.log('submited')
              console.log(this.model)
              window.alert('You submitted me!')
            }
          }
        }
      }, {
        name: 'Raw Table',
        path: 'raw',
        href: '/components/raw',
        component: 'tmx-test',
        props: {
          component: 'table',
          tests: {
            data: table.data
          }
        }
      }, {
        name: 'Loading Table',
        path: 'spinner',
        href: '/components/spinner',
        component: 'tmx-test',
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
        name: 'Complete Table',
        path: 'table',
        href: '/components/table',
        component: 'tmx-test',
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
