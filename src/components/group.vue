<script type="text/babel">
  import T from 'libt'
  import tmxDropdown from './dropdown.vue'

  module.exports = {
    components: {
      'tmx-dropdown': tmxDropdown
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
      label: {
        type: String,
        default: 'Group'
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
          T.sync(this.output, T.group(this.active.reduce((O, a) => {
            O[a] = a
            return O
          }, {}), obj)(this.input)) 
        } else {
          T.sync(this.output, this.input)
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
            label: this.label,
            id: 'group',
            options: T.where([
              {
                path: 'label',
                operator: '!==',
                value: ''
              }
            ])(this.fields),
            required: true
          }]
          modal.icon = this.icon
          modal.label = this.label
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
    :label="label"
    :items="getItems()"
  >
  </tmx-dropdown>
</template>
