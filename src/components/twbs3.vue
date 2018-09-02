<script type="text/babel">
  import table from '../json/table.json'
  import form from '../json/form.json'
  import data2html from './data2html.vue'

  module.exports = {
    components: {
      data2html
    },
    data: function () {
      return {
        ready: false,
        table: [],
        form: form.model
      }
    },
    mounted: function () {
      table.data.forEach(row => {
        Object.keys(row).forEach(key => {
          if (key.substr(0, 1) === '$') {
            var x = row[key]
            row[key] = () => {window.alert(`${key}:${x}`)}
          }
          if (typeof row[key] === 'object') {
            row[key] = JSON.stringify(row[key])
          }
        })
        this.$data.table.push(row)
      })
    }
  }
</script>

<template>
  <div>
    <div class="thumbnail">
      <data2html :data="form"></data2html>
    </div>
    <div class="thumbnail table-responsive">
      <data2html
        class="table table-striped table-bordered table-condensed table-hover"
        :data="table"
      ></data2html>
    </div>
  </div>
</template>
