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
        icon: 'pencil',
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
            icon: 'pencil',
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
    label: 'Tags',
    path: '/tags',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        label: 'Carousel',
        path: 'carousel',
        component: 'tmx-test',
        props: {
          component: 'carousel',
          tests: {
            style: "width:400px",
            class: "thumbnail justify",
            time: 2,
            buttons: true,
            slides: [
              {
                text: "Lorem ipsum porttitor eget vehicula mollis turpis ornare phasellus sociosqu, quam ultricies himenaeos dictumst tempus fringilla massa sociosqu leo, arcu tristique posuere dictumst imperdiet ornare aliquam venenatis. mattis egestas ligula est convallis hendrerit placerat, integer inceptos ultricies sodales fusce aenean tellus, scelerisque blandit eleifend donec elementum.",
                video: "static/video.mp4"
              }, {
                label: "First slide",
                image: "static/icon.jpg"
              }, {
                label: "Second slide",
                text: "Lorem ipsum porttitor eget vehicula mollis turpis ornare phasellus sociosqu, quam ultricies himenaeos dictumst tempus fringilla massa sociosqu leo, arcu tristique posuere dictumst imperdiet ornare aliquam venenatis. mattis egestas ligula est convallis hendrerit placerat, integer inceptos ultricies sodales fusce aenean tellus, scelerisque blandit eleifend donec elementum.",
                video: "static/video.mp4",
              }, {
                image: "static/icon.jpg"
              }
            ]
          }
        }
      }
    ]
  }, {
    label: 'Block',
    path: '/block',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        label: 'Panel',
        path: 'panel',
        component: 'tmx-test',
        props: {
          component: 'block',
          tests: {
            content: {
              class: "container text-center",
              content: {
                class: "panel panel-default",
                content: [
                  {
                     class: "panel-heading",
                     content: [
                       {
                         tag: "h3",
                         class: "panel-title",
                         content: "My company. We gonna have some fun here!"
                       }
                     ]
                  }, {
                   class: "panel-body",
                   content: [
                     {
                       content: "Some place in the world, XXX – YYYYY ZIP: ZZZZZ-ZZZ – My City – EE Country"
                     }, {
                       content: "Phone: +XX (XX) XXXX-XXXX/ YYYY-YYYY"
                     }, {
                       content: [
                         {
                           tag: "span",
                           content: "E-Mail: "
                         }, {
                           tag: "a",
                           content: "myemail@host.com",
                           href: "mailto:myemail2@host.com"
                         }, {
                           tag: "span",
                           content: " | "
                         }, {
                           tag: "a",
                           content: "myemail2@host.com",
                           href: "mailto:myemail2@host.com"
                         }, {
                           tag: "span",
                           content: " | "
                         }, {
                           tag: "a",
                           content: "go to Google",
                           href: "https://www.google.com.br"
                         }
                       ]
                     }, {
                       tag: "a",
                       href: "https://www.google.com",
                       content: {
                         tag: "img",
                         content: {
                           style: "width:400px;margin:auto",
                           src: "static/icon.jpg",
                         }
                       }
                     }
                   ]
                  }
                ]
              }
            }
          }
        }
      }, {
        label: 'Carousel',
        path: 'carousel',
        component: 'tmx-test',
        props: {
          component: 'block',
          tests: {
            tag: 'carousel',
            style: "width:400px",
            class: "thumbnail justify",
            content: {
              time: 2,
              buttons: true,
              slides: [
                {
                  text: "Lorem ipsum porttitor eget vehicula mollis turpis ornare phasellus sociosqu, quam ultricies himenaeos dictumst tempus fringilla massa sociosqu leo, arcu tristique posuere dictumst imperdiet ornare aliquam venenatis. mattis egestas ligula est convallis hendrerit placerat, integer inceptos ultricies sodales fusce aenean tellus, scelerisque blandit eleifend donec elementum.",
                  video: "static/video.mp4"
                }, {
                  label: "First slide",
                  image: "static/icon.jpg"
                }, {
                  label: "Second slide",
                  text: "Lorem ipsum porttitor eget vehicula mollis turpis ornare phasellus sociosqu, quam ultricies himenaeos dictumst tempus fringilla massa sociosqu leo, arcu tristique posuere dictumst imperdiet ornare aliquam venenatis. mattis egestas ligula est convallis hendrerit placerat, integer inceptos ultricies sodales fusce aenean tellus, scelerisque blandit eleifend donec elementum.",
                  video: "static/video.mp4",
                }, {
                  image: "static/icon.jpg"
                }
              ]
            }
          }
        }
      }, {
        label: 'Barcode',
        path: 'barcode',
        component: 'tmx-test',
        props: {
          component: 'block',
          tests: {
            style: 'width:200px;height:200px',
            class: 'thumbnail',
            content: [{
              tag: 'barcode',
              content: {
                value: '12345abc'
              }
            }]
          }
        }
      }
    ]
  }, {
    label: 'Basic block',
    path: '/basic',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        label: 'Icon',
        path: 'icon',
        component: 'tmx-test',
        props: {
          component: 'icon',
          tests: {
            name: 'ok'
          }
        }
      }, {
        label: 'Button',
        path: 'button',
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
        label: 'Button Split',
        path: 'split',
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
        label: 'Dropdown',
        path: 'dropdown',
        component: 'tmx-test',
        props: {
          component: 'dropdown',
          tests: {
            icon: 'cog',
            label: 'Test',
            links: [
              {label: 'Github', href: 'http://www.github.com'},
              {label: 'Gitlab', href: 'http://www.gitlab.com', icon: 'cog'}
            ]
          }
        }
      }, {
        label: 'Image',
        path: 'image',
        component: 'tmx-test',
        props: {
          component: 'image',
          tests: {
            src: 'static/icon.jpg'
          }
        }
      }, {
        label: 'Data',
        path: 'data',
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
      }, {
        label: 'Barcode',
        path: 'barcode',
        component: 'tmx-test',
        props: {
          component: 'barcode',
          tests: {
            value: '12345abc'
          }
        }
      }, {
        label: 'Chart',
        path: 'chart',
        component: 'tmx-test',
        props: {
          component: 'chart',
          tests: {
            data: table.data,
            fieldX: 'age',
            fieldY: 'balance'
          }
        }
      }
    ]
  }, {
    label: 'Form Fields',
    path: '/fields',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        label: 'Checkbox',
        path: 'checkbox',
        component: 'tmx-test',
        props: {
          component: 'checkbox',
          tests: {
            model: {id: true},
            id: 'id'
          }
        }
      }, {
        label: 'Progress Bar',
        path: 'progressbar',
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
        label: 'Input',
        path: 'input',
        component: 'tmx-test',
        props: {
          component: 'input',
          tests: {
            model: {id: 'Test'},
            id: 'id'
          }
        }
      }, {
        label: 'Text',
        path: 'text',
        component: 'tmx-test',
        props: {
          component: 'text',
          tests: {
            model: {id: 'Test'},
            id: 'id'
          }
        }
      }, {
        label: 'Select',
        path: 'select',
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
        label: 'File',
        path: 'file',
        component: 'tmx-test',
        props: {
          component: 'file',
          tests: {
            model: {},
            id: 'id'
          }
        }
      }, {
        label: 'Item',
        path: 'item',
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
    label: 'Table Controls',
    path: '/controls',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        label: 'Pager',
        path: 'pager',
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
        label: 'Filter',
        path: 'filter',
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
        label: 'Group',
        path: 'group',
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
        label: 'Download',
        path: 'download',
        component: 'tmx-test',
        props: {
          component: 'download',
          tests: {
            data: table.data,
            fields: table.fields
          }
        }
      }, {
        label: 'Head',
        path: 'head',
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
        label: 'Body',
        path: 'body',
        component: 'tmx-test',
        props: {
          component: 'body',
          tests: {
            model: {id: 'Test'},
            id: 'id'
          }
        }
      }, {
        label: 'Search',
        path: 'search',
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
    label: 'Components',
    path: '/components',
    component: {
      template: '<router-view></router-view>'
    },
    children: [
      {
        label: 'Navbar',
        path: 'navbar',
        component: 'tmx-test',
        props: {
          component: 'navbar',
          tests: {
            label: 'TMX test',
            sublabel: 'marcodpt',
            icon: 'user',
            routes: [
              {
                label: 'Components',
                path: '/components',
                children: [
                  {label: 'Navbar', path: 'navbar'}
                ]
              }
            ]
          }
        }
      }, {
        label: 'Header',
        path: 'header',
        component: 'tmx-test',
        props: {
          component: 'header',
          tests: {
            label: 'I am the header label',
            sublabel: 'And i am the header sublabel',
            pageHeader: true,
            center: true
          }
        }
      }, {
        label: 'Panel',
        path: 'panel',
        component: 'tmx-test',
        props: {
          component: 'panel',
          tests: {
            toogle: true,
            open: true,
            type: 'primary',
            label: 'I am a panel!',
            text: 'And i am the body\nFull of ideas'
          }
        }
      }, {
        label: 'Form',
        path: 'form',
        component: 'tmx-test',
        props: {
          component: 'form',
          tests: {
            model: form.model,
            label: 'Test form'
          }
        }
      }, {
        label: 'Modal',
        path: 'modal',
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
        label: 'Raw Table',
        path: 'raw',
        component: 'tmx-test',
        props: {
          component: 'table',
          tests: {
            data: table.data
          }
        }
      }, {
        label: 'Loading Table',
        path: 'spinner',
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
        label: 'Complete Table',
        path: 'table',
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
