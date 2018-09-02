<script type="text/babel">
  import table from '../json/table.json'
  import form from '../json/form.json'
  import formitable from './formitable.vue'

  module.exports = {
    components: {
      formitable
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
      <formitable :data="form"></formitable>
    </div>
    <div class="thumbnail table-responsive">
      <formitable
        class="table table-striped table-bordered table-condensed table-hover"
        :data="table"
      ></formitable>
    </div>
  </div>
</template>
