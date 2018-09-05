<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import inputag from 'vue-inputag'
  import tmxButton from './button.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'vue-inputag': inputag,
      'tmx-button': tmxButton
    },
    props: {
      model: {
        type: Object,
        default: function () {
          return {}
        }
      },
      id: {
        type: String,
        default: 'page'
      },
      rows: {
        type: Number,
        default: 10
      },
      input: {
        type: Array,
        default: function () {
          return []
        }
      },
      output: {
        type: Array,
        default: function () {
          return []
        }
      },
      label: {
        type: String,
        default: ''
      },
      time: {
        type: Number,
        default: 0
      }
    },
    data: function () {
      return {
        pages: T.pager(this.rows)(this.input),
        oldPage: 0,
        interval: null
      }
    },
    mounted: function () {
      this.setPage ()
    },
    methods: {
      setPage: function (action) {
        if (this.time && !this.$data.interval) {
          this.$data.interval = setInterval(() => {
            this.setPage('rotate')
          }, 1000 * this.time)
        } else if (!this.time && this.$data.interval) {
          clearInterval (this.$data.interval)
          this.$data.interval = null
        }

        this.$data.pages = T.pager(this.rows)(this.input)
        this.model[this.id] = parseInt(this.model[this.id]) || 1
        this.$data.oldPage = this.model[this.id]

        if (action === 'begin') {
          this.$set(this.model, this.id, 1)
        }
        if (action === 'back') {
          this.$set(this.model, this.id, this.model[this.id] - 1)
        }
        if (action === 'next' || action === 'rotate') {
          this.$set(this.model, this.id, this.model[this.id] + 1)
        }
        if (action === 'end') {
          this.$set(this.model, this.id, this.$data.pages)
        }

        if (this.model[this.id] > this.$data.pages) {
          if (action === 'rotate') {
            this.$set(this.model, this.id, 1)
          } else {
            this.$set(this.model, this.id, this.$data.pages)
          }
        }
        if (!this.model[this.id] || this.model[this.id] < 1) {
          this.$set(this.model, this.id, 1)
        }

        if (action === undefined || this.$data.oldPage !== this.model[this.id]) {
          T.sync(this.output, T.pager(this.rows)(this.model[this.id])(this.input))
        }
      },
      begin: function () {
        this.setPage('begin')
      },
      back: function () {
        this.setPage('back')
      },
      next: function () {
        this.setPage('next')
      },
      end: function () {
        this.setPage('end')
      },
      getLabel: function () {
        var label = this.label || (this.translate('pager') + ' ($page / $total)')
        var options = []
        for (var i = 1; i <= this.pages; i += 1) {
          options.push({
            id: i,
            label: T.compose(
              T.replaceAll('$total', this.pages),
              T.replaceAll('$page', i)
            )(label)
          })
        }

        return options
      }
    },
    watch: {
      model: {
        deep: true,
        handler: function () {
          if (this.$data.oldPage !== this.model[this.id]) {
            this.setPage ()
          }
        }
      },
      rows: function () {
        this.setPage ()
      },
      input: function () {
        this.setPage ()
      },
      time: function () {
        this.setPage ()
      }
    }
  }
</script>

<template>
  <form class="form-inline">
    <tmx-button type="primary" icon="fast-backward" :disabled="model[id] <= 1" :click="begin" />
    <tmx-button type="primary" icon="step-backward" :disabled="model[id] <= 1" :click="back" />
    <div class="form-group">
      <vue-inputag
        :id="id"
        :model="model"
        :options="getLabel()"
        type="select"
        required
        style="background-color:white;border-radius:5px"
      />
    </div>
    <tmx-button type="primary" icon="step-forward" :disabled="model[id] >= pages" :click="next" />
    <tmx-button type="primary" icon="fast-forward" :disabled="model[id] >= pages" :click="end" />
  </form>
</template>
