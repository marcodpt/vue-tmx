<script type="text/babel">
  import Vue from '../node_modules/vue/dist/vue.js'
  import VueRouter from 'vue-router'
  import treeNav from 'vue-tree-nav'
  import tmxModal from './components/modal.vue'
  import tmxTest from './components/test.vue'

  import routes from './routes.js'

  Vue.use(VueRouter)

  Vue.component('tmx-test', tmxTest)
  Vue.component('tmx-modal', tmxModal)
  Vue.component('vue-tree-nav', treeNav)

  var setComponent = (routes) => {
    routes.forEach((route, i) => {
      if (typeof route.component === "string") {
        routes[i].component = Vue.component(route.component)
      }
      if (route.children) {
        routes[i].children = setComponent(route.children)
      }
    })

    return routes
  }

  const router = new VueRouter({
    routes: setComponent(routes)
  })

  new Vue({
    router: router,
    data: {
      routes: routes,
      right: [
        {
          href: "https://github.com/marcodpt/tmx",
          icon: "brands/github"
        }
      ],
      modal: null
    }
  }).$mount('#app')
</script>
