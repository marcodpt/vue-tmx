<script type="text/babel">
  import lib from '../lib.js'
  import tmxButton from './button.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-button': tmxButton
    },
    props: {
      button: {
        type: String,
        default: 'default'
      },
      icon: {
        type: String,
        default: 'file'
      },
      label: {
        type: String
      },
      json: {
        type: Boolean,
        default: false
      },
      fields: {
        type: Array,
        default: function () {
          return []
        }
      },
      cast: {
        type: Object,
        default: function () {
          return {}
        }
      },
      data: {
        type: Array,
        required: true
      },
      ident: {
        type: Number,
        default: 2
      },
      field: {
        type: String,
        default: '\t'
      },
      line: {
        type: String,
        default: '\n'
      },
      header: {
        type: Boolean,
        default: true
      },
      file: {
        type: String,
        default: "download"
      },
      language: {
        type: String,
        default: 'en'
      }
    },
    methods: {
      downloadData: function () {
        var s = ''
        var ext = ''

        if (!this.fields.length && this.data.length) {
          this.fields = Object.keys(this.data[0])
        }
        this.fields.forEach((field, i) => {
          if (typeof field === 'string') {
            this.fields[i] = {
              id: field,
              label: field
            }
          } else {
            this.fields[i].id = field.id || field.label
            this.fields[i].label = field.label || field.id
          }
        })

        if (this.json) {
          ext = 'json'
          var S = []

          this.data.forEach(row => {
            var obj = {}
            this.fields.forEach(field => {
              obj[this.cast[field.id] || field.id] = this.formatData(row[field.id], field.format)
            })
            S.push(obj)
          })

          s = JSON.stringify(S, undefined, this.ident)
        } else {
          ext = 'csv'
          if (this.header) {
            this.fields.forEach(field => {
              s += field.label + this.field
            })
            s = s.substr(0, s.length - 1)
          }

          this.data.forEach((row, i) => {
            if (i > 0 || this.header) {
              s += this.line
            }
            this.fields.forEach(field => {
              s += this.formatData(row[field.id], field.format) + this.field
            })
            s = s.substr(0, s.length - 1)
          })
        }

        var file = this.file
        if (file.substr(file.length - 6).indexOf('.') === -1){
          file += '.' + ext
        }

        this.downloadFile(file, s, 'text')
      }
    }
  }
</script>

<template>
  <tmx-button :type="button" :icon="icon" :click="downloadData" :label="label || translate('download')" />
</template>
