<script type="text/babel">
  module.exports = {
    name: 'formitable',
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
          <formitable :data="row[key]">
            {{key}}
          </formitable>
        </td>
        <td v-if="!keys.length">
          <formitable :data="row" />
        </td>
      </tr>
    </tbody>
  </table>
  <form v-else-if="type(data) === 'object'">
    <div v-for="key in keys">
      <b v-if="type(data[key]) !== 'function'">{{key}}: </b>
      <formitable :data="data[key]">
        {{key}}
      </formitable>
    </div>
  </form>
  <button v-else-if="type(data) === 'function'" @click="run">
    <slot></slot>
  </button>
  <span v-else>{{data}}</span>
</template>
