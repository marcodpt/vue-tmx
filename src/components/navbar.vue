<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxDropdown from './dropdown.vue'
  import tmxIcon from './icon.vue'
  import tmxTree from './tree.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-dropdown': tmxDropdown,
      'tmx-icon': tmxIcon,
      'tmx-tree': tmxTree
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
        isOpen: false,
        fade: false
      }
    },
    mounted: function () {
      this.setRouter()
    },
    methods: {
      open: function () {
        this.$data.fade = true;
        document.getElementById("mySidenav").style.width = "300px";
      },
      close: function () {
        this.$data.fade = false;
        document.getElementById("mySidenav").style.width = "0";
      },
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
  <div>
    <div class="bar">
      <div class="subbar" style="text-align:left;">
        <a @click="open" style="font-size:36px;">&#8801;</a>
      </div>
      <div class="subbar" style="text-align:center;">
        <h4>
          TMX <small>{{section.label}} / {{page.label}}</small>
        </h4>
      </div>
      <div class="subbar" style="text-align:right;">
        <a v-for="action in actions" @click="action.onClick">
          <tmx-icon :name="action.icon" />
          {{action.label}}
        </a>
      </div>
    </div>
    <div id="mySidenav" class="sidenav">
      <tmx-tree :data="routes" :close="{click: close}"/>
    </div>
    <div v-show="fade" @click="close" class="fadeMe"></div>
  </div>
</template>

<style>
  .bar {
    display: table; 
    background-color:#f8f8f8;
    position: relative;
    width: 100%;
    margin-bottom: 20px;
    color: #777;
  }

  .subbar {
    display: table-cell;
    vertical-align: middle;
    padding: 5px 15px;
  }

  .bar a {
    color: #777;
  }
  .bar a:hover, .bar a:focus {
    color: #333;
    text-decoration:none;
  }

  .sidenav {
    height: 100%;
    width: 0;
    position: fixed;
    z-index: 2000;
    top: 0;
    left: 0;
    background-color:#eee;
    overflow-x: hidden;
    transition: 0.5s;
  }

  .fadeMe {
    opacity:0.7;
    filter: alpha(opacity=20);
    background-color:#000; 
    width:100%; 
    height:100%; 
    z-index:1999;
    top:0; 
    left:0; 
    position:fixed; 
    transition: 0.5s;
  }
</style>
