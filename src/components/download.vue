<script type="text/babel">
  import T from 'libt'

  module.exports = {
    props: {
      button: {
        type: String,
        default: 'default'
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
              label: field,
              formatter: (x) => x
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
              obj[this.cast[field.id] || field.id] = field.formatter(row[field.id])
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
              s += field.formatter(row[field.id]) + this.field
            })
            s = s.substr(0, s.length - 1)
          })
        }

        var file = this.file
        if (file.substr(file.length - 6).indexOf('.') === -1){
          file += '.' + ext
        }

        T.download(document, file, s, 'text')
      }
    }
  }
</script>

<template>
  <button @click="downloadData"><slot>Download</slot></button>
</template>
