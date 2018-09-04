<script type="text/babel">
  module.exports = {
    name: 'data2html',
    props: {
      data: {
        type: [Object, Array, Function, String, Number, Boolean]
      }
    },
    data: function () {
      return {
        keys: []
      }
    },
    mounted: function () {
      this.build()
    },
    watch: {
      data: function () {
        this.build()
      }
    },
    methods: {
      type: function (x) {
        if (typeof x === 'function') {
          return 'function'
        } else if (typeof x === 'object' && x != null) {
          if (x instanceof Array) {
            return 'array'
          } else {
            return 'object'
          }
        } else { 
          return 'data'
        }
      },
      run: function () {
        if (this.type(this.data) === 'function') {
          this.data()
        }
      },
      build: function () {
        while (this.$data.keys.length) {
          this.$data.keys.pop()
        }
        var t = this.type(this.data)
        if (t === 'array') {
          this.data.forEach(row => {
            this.getFields(row)
          })
        } else if (t === 'object') {
          this.getFields(this.data)
        }
      },
      getFields: function (row) {
        if (this.type(row) === 'object') {
          Object.keys(row).forEach(key => {
            if (this.$data.keys.indexOf(key) === -1) {
              this.$data.keys.push(key)
            }
          })
        }
      }
    }
  }
</script>

<template>
  <table v-if="type(data) === 'array'">
    <thead>
      <tr v-if="keys.length">
        <th v-for="key in keys">
          {{key}}
        </th>
      </tr>
    </thead>
    <tbody v-if="data">
      <tr v-for="row in data">
        <td v-for="key in keys">
          <data2html :data="row[key]">
            <span slot="button">
              {{key}}
            </span>
          </data2html>
        </td>
        <td v-if="!keys.length">
          <data2html :data="row" />
        </td>
      </tr>
    </tbody>
  </table>
  <form v-else-if="type(data) === 'object'">
    <slot v-for="key in keys" name="form" :id="key" :model="data">
      <b v-if="type(data[key]) !== 'function'">{{key}}: </b>
      <data2html :data="data[key]">
        <span slot="button">
          {{key}}
        </span>
      </data2html>
    </slot>
  </form>
  <button v-else-if="type(data) === 'function'" @click="run">
    <slot name="button"></slot>
  </button>
  <span v-else>{{data}}</span>
</template>
