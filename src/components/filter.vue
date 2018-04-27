<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxButtonSplit from './buttonSplit.vue'
  import tmxIcon from './icon.vue'
  import tmxButton from './button.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-button-split': tmxButtonSplit,
      'tmx-icon': tmxIcon,
      'tmx-button': tmxButton
    },
    props: {
      button: {
        type: String,
        default: 'info'
      },
      icon: {
        type: String,
        default: 'filter'
      },
      active: {
        type: Array,
        default: function () {
          return []
        }
      },
      fields: {
        type: Array,
        default: function () {
          return []
        }
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
      }
    },
    mounted: function () {
      this.run()
    },
    methods: {
      run: function () {
        this.populate(T.where(this.active)(this.input), this.output)
      },
      add: function (m) {
        var unique = true
        this.active.forEach(a => {
          if (unique && T.compare(m)(a) === 0) {
            unique = false
          }
        })
        if (unique) {
          this.active.push(T.copy(m))
        }

        this.run()
      },
      getOperators: function () {
        return [
          {id: '~', label: this.translate('like')},
          {id: '===', label: this.translate('eq')},
          {id: '!==', label: this.translate('ne')},
          {id: '>', label: this.translate('gt')},
          {id: '>=', label: this.translate('gte')},
          {id: '<', label: this.translate('lt')},
          {id: '<=', label: this.translate('lte')}
        ]
      },
      getFormat: function (path) {
        var X = this.fields.filter(f => T.compare({id: path})(f) === 0)
        if (X && X[0]) {
          return X[0]['format']
        }
      },
      getValues: function (model, callback) {
        var X = T.distinct({
          id: model.path
        })(this.input) 

        X.forEach((x, i) => {
          X[i].label = this.formatData(x.id, this.getFormat(model.path))
        })

        callback(X)
      },
      click: function (index) {
        if (index === undefined) {
          var modal = {}
          modal.fields = [
            {
              format: 'string',
              label: this.translate('filterField'),
              id: 'path',
              source: this.selectOptions(T.where([
                {
                  path: 'label',
                  operator: '!==',
                  value: ''
                }
              ])(this.fields)),
              required: true
            }, {
              format: 'string',
              label: this.translate('filterOperator'),
              id: 'operator',
              source: this.selectOptions(this.getOperators()),
              required: true
            }, {
              format: 'string',
              label: this.translate('filterValue'),
              id: 'value',
              required: true,
              dependencies: ['path', 'operator']
            }
          ]

          modal.model = {operator: '~'}
          modal.icon = this.icon
          modal.label = this.translate('filter')
          modal.submit = this.add

          this.$root.$data.modal = modal
        } else {
          this.active.splice(index, 1)
          this.run()
        }
      },
      getLabel: function (w) {
        var O = this.getOperators().filter(o => T.compare({id: w.operator})(o) === 0)
        var X = this.fields.filter(f => T.compare({id: w.path})(f) === 0)
        var path = w.path
        var format = 'string'
        var operator = w.operator
        if (O && O[0]) {
          operator = O[0]['label'] ? O[0]['label'] : operator
        }
        if (X && X[0]) {
          path = X[0]['label'] ? X[0]['label'] : w.path
          format = X[0]['format']
        }

        return `${path} ${operator} ${this.formatData(w.value, format)}`
      }
    },
    watch: {
      input: function () {
        this.run()
      },
      '$root.$data.modal.model.operator': function (op) {
        if (op === '~') {
          this.$set(this.$root.$data.modal.fields[2], 'source')
        } else if (op !== undefined) {
          this.$set(this.$root.$data.modal.fields[2], 'source', this.getValues)
        }
      }
    }
  }
</script>

<template>
  <tmx-button-split
    :type="button"
    :icon="icon"
    :click="click"
    :label="translate('filter')"
    :items="active"
  >
    <a v-on:click="click(scope.index)" style="cursor:pointer;" slot-scope="scope">
      <tmx-icon type="remove"></tmx-icon>
      {{getLabel(scope.item)}}
    </a>
  </tmx-button-split>
</template>
