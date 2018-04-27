<script type="text/babel">
  import T from 'libt'
  import tmxDropdown from './dropdown.vue'
  import tmxIcon from './icon.vue'

  module.exports = {
    components: {
      'tmx-dropdown': tmxDropdown,
      'tmx-icon': tmxIcon
    },
    props: {
      routes: {
        type: Array,
        default: function () {
          return []
        }
      },
      change: {
        type: Number,
        default: 0
      },
      actions: {
        type: Array,
        default: function () {
          return []
        }
      },
      label: {
        type: String,
        default: ''
      },
      sublabel: {
        type: String,
        default: ''
      },
      icon: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return {
        section: {},
        page: {},
        router: [],
        isOpen: false
      }
    },
    mounted: function () {
      this.setRouter()
    },
    methods: {
      toogle: function () {
        this.$data.isOpen = !this.$data.isOpen
      },
      setRouter: function () {
        this.$data.router = this.routes.reduce((R, $) => {
          try {
            R.push({
              label: $.label || $.path,
              icon: $.icon,
              href: $.href ? $.href : ("#" + ($.path ? $.path : "")) + ($.children[0].path ? ("/" + $.children[0].path) : "")
            })
          } catch (err) {}
          return R
        }, [])

        this.$data.router.forEach((route, i) => {
          var href = route.href.substr(0, route.href.lastIndexOf('/')) + '/'
          this.$data.router[i].links = this.routes[i].children.map($ => {
            return {
              label: $.label ? $.label : $.path,
              icon: $.icon,
              href: $.href ? $.href : (href + $.path)
            }
          })
        })

        this.setPage()
      },
      setPage: function () {
        this.$data.isOpen = false
        if (!this.$data.router.length) {
          return
        }

        const objA = {label: '?', href: '#'}
        const objB = {label: 'label', icon: 'icon'}

        const map = path => V => V.map(v => T.path(path)(v))
        const act1 = T.compose(T.merge({label: '?', links: []}), T.path(objB))
        const act2 = T.compose(T.merge(objA), map(T.merge(objB)({href: 'links.0.href'})))

        var href = window.location.href
        var max = 0

        this.$data.section = act1(this.$data.router[0])

        this.$data.page = act1(this.$data.router[0].links[0])

        this.$data.section.links = act2(this.$data.router)
        this.$data.page.links = T.copy(this.$data.router[0].links)

        this.$data.router.forEach(section => {
          var links = T.compose(T.merge(objA), map(T.merge(objB)({href: 'href'})))(section.links)
          var set = false

          section.links.forEach(link => {
            if (link.href.length > max && href.indexOf(link.href) !== -1) {
              max = link.href.length
              this.$data.section = T.compose(T.merge(this.$data.section), T.path(objB))(section)
              this.$data.page = T.compose(T.merge(objA), T.path(objB))(link)
              set = true
            }
          })

          if (set) {
            this.$data.page.links = links 
          }
        })
      }
    },
    watch: {
      change: function () {
        this.setPage()
      },
      'routes.length': function () {
        this.setRouter()
      }
    }
  }
</script>

<template>
  <nav class="navbar navbar-default" role="navigation">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" aria-expanded="false" @click="toogle">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a v-if="label || sublabel || icon" class="navbar-brand">
          {{label}}
          <small>
            <tmx-icon :type="icon"></tmx-icon>
            {{sublabel}}
          </small>
        </a>
      </div>
      <div :class="[isOpen ? '' : 'collapse navbar-collapse']">
        <ul class="nav navbar-nav">
          <tmx-dropdown v-bind="section">
          </tmx-dropdown>
          <tmx-dropdown v-bind="page">
          </tmx-dropdown>
        </ul>
        <ul class="nav navbar-nav navbar-right" v-if="actions.length">
          <li v-for="action in actions">
            <a @click="action.onClick" style="cursor:pointer;">
              <tmx-icon :type="action.icon"></tmx-icon>
              {{action.label}}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
