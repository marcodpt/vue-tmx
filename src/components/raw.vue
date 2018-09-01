<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'

  module.exports = {
    mixins: [lib],
    props: {
      data: {
        type: Array
      },
      fields: {
        type: Array
      }
    },
    data: function () {
      return {
        Fields: []
      }
    },
    mounted: function () {
      this.build()
    },
    watch: {
      data: function () {
        this.build()
      },
      fields: function () {
        this.build()
      }
    },
    methods: {
      build: function () {
        var Fields = []
        if (!this.fields && this.data && this.data.length) {
          Fields = this.setFields(this.data)
        } else if (this.fields && this.fields.length) {
          Fields = T.copy(this.fields)
        } 

        Fields.forEach((field, i) => {
          if (field.label == null) {
            Fields[i].label = field.id
          }
          if (field.static == null) {
            field.static = true
          }
        })

        T.sync(this.$data.Fields, Fields)
      }
    }
  }
</script>

<template>
  <table>
    <thead>
      <slot></slot>
      <tr>
        <th v-for="field in Fields">
          <slot name="th" :field="field">
            {{field.label}}
          </slot>
        </th>
      </tr>
    </thead>
    <tbody v-if="data">
      <tr v-for="row in data">
        <td v-for="field in Fields">
          <slot name="td" :field="field" :row="row" :value="row[field.id]">
            {{row[field.id]}}
          </slot>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td colspan="100%">
          <slot name="loading">
            Loading...
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>
