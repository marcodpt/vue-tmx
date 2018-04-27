<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxSelect from './select.vue'
  import tmxButton from './button.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-select': tmxSelect,
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
      language: {
        type: String,
        default: 'en'
      },
      label: {
        type: String,
        default: ''
      }
    },
    data: function () {
      return {
        pages: T.pager(this.rows)(this.input),
        oldPage: 0
      }
    },
    mounted: function () {
      this.setPage ()
    },
    methods: {
      setPage: function (action) {
        this.$data.pages = T.pager(this.rows)(this.input)
        this.model[this.id] = parseInt(this.model[this.id]) || 1
        this.$data.oldPage = this.model[this.id]

        if (action === 'begin') {
          this.$set(this.model, this.id, 1)
        }
        if (action === 'back') {
          this.$set(this.model, this.id, this.model[this.id] - 1)
        }
        if (action === 'next') {
          this.$set(this.model, this.id, this.model[this.id] + 1)
        }
        if (action === 'end') {
          this.$set(this.model, this.id, this.$data.pages)
        }

        if (this.model[this.id] > this.$data.pages) {
          this.$set(this.model, this.id, this.$data.pages)
        }
        if (!this.model[this.id] || this.model[this.id] < 1) {
          this.$set(this.model, this.id, 1)
        }

        if (action === undefined || this.$data.oldPage !== this.model[this.id]) {
          this.populate(T.pager(this.rows)(this.model[this.id])(this.input), this.output)
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
        return this.selectOptions(this.selectRange(this.label || this.translate('pager'), 1, this.pages))
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
      }
    }
  }
</script>

<template>
  <form class="form-inline">
    <tmx-button type="primary" icon="fast-backward" :disabled="model[id] <= 1" :click="begin" />
    <tmx-button type="primary" icon="step-backward" :disabled="model[id] <= 1" :click="back" />
    <div class="form-group">
      <tmx-select
        :id="id"
        :model="model"
        :source="getLabel()"
        required
        style="background-color:white;border-radius:5px"
      ></tmx-select>
    </div>
    <tmx-button type="primary" icon="step-forward" :disabled="model[id] >= pages" :click="next" />
    <tmx-button type="primary" icon="fast-forward" :disabled="model[id] >= pages" :click="end" />
  </form>
</template>
