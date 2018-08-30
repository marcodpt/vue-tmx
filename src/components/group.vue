<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxDropdown from './dropdown.vue'
  import tmxIcon from './icon.vue'
  import tmxButton from './button.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-dropdown': tmxDropdown,
      'tmx-icon': tmxIcon,
      'tmx-button': tmxButton
    },
    props: {
      button: {
        type: String,
        default: 'warning'
      },
      icon: {
        type: String,
        default: 'th'
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
        var obj = {}
        this.fields.forEach((field) => {
          if (field.expression !== undefined && field.view !== false && field.id) {
            obj[field.id] = field.expression
          }
        })
        if (this.active.length) {
          this.populate(T.group(this.active.reduce((O, a) => {
            O[a] = a
            return O
          }, {}), obj)(this.input), this.output) 
        } else {
          this.populate(this.input, this.output)
        }
      },
      add: function (model) {
        if (this.active.indexOf(model.group) === -1) {
          this.active.push(model.group)
        }
        this.run()
      },
      click: function (index) {
        if (index === undefined) {
          var modal = {}
          modal.fields = [{
            format: 'string',
            label: this.translate('group'),
            id: 'group',
            source: this.selectOptions(T.where([
              {
                path: 'label',
                operator: '!==',
                value: ''
              }
            ])(this.fields)),
            required: true
          }]
          modal.icon = this.icon
          modal.label = this.translate('group')
          modal.source = this.getValues
          modal.submit = this.add
          modal.model = {}

          this.$root.$data.modal = modal
        } else {
          this.active.splice(index, 1)
          this.run()
        }
      },
      itemLabel: function (field) {
        var X = this.fields.filter(f => T.compare({id: field})(f) === 0)
        if (!X[0]) {
          return field
        }
        return X[0].label || X[0].id || field
      },
      getItems: function () {
        return this.active.map((a, i) => {
          return {
            icon: 'times',
            label: this.itemLabel(a),
            click: () => {
              this.click(i)
            }
          }
        })
      }
    },
    watch: {
      input: function () {
        this.run()
      }
    }
  }
</script>

<template>
  <tmx-dropdown
    :type="button"
    :icon="icon"
    :click="click"
    :label="translate('group')"
    :items="getItems()"
  >
  </tmx-dropdown>
</template>
