<script type="text/babel">
  import Vue from '../node_modules/vue/dist/vue.js'
  import VueRouter from 'vue-router'
  import tmxTest from './components/test.vue'
  import tmxNavbar from './components/navbar.vue'

  import routes from './routes.js'

  Vue.use(VueRouter)

  Vue.component('tmx-test', tmxTest)
  Vue.component('tmx-navbar', tmxNavbar)

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
      change: 0,
      navbar: {
        routes: routes,
        label: 'TMX test',
        sublabel: 'marcodpt',
        icon: 'user',
        actions: [
          {
            icon: "power-off",
            label: "Quit",
            onClick: function () {
              window.location.href = "https://github.com/marcodpt/tmx"
            }
          }
        ]
      },
      modal: null
    },
    watch: {
      $route: function () {
        this.$data.change += 1
      }
    }
  }).$mount('#app')
</script>
