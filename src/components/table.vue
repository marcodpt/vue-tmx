<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxDownload from './download.vue'
  import tmxGroup from './group.vue'
  import tmxFilter from './filter.vue'
  import tmxHead from './head.vue'
  import tmxBody from './body.vue'
  import tmxIcon from './icon.vue'
  import tmxPager from './pager.vue'
  import tmxButton from './button.vue'
  import tmxSearch from './search.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-download': tmxDownload,
      'tmx-group': tmxGroup,
      'tmx-filter': tmxFilter,
      'tmx-head': tmxHead,
      'tmx-body': tmxBody,
      'tmx-icon': tmxIcon,
      'tmx-pager': tmxPager,
      'tmx-button': tmxButton,
      'tmx-search': tmxSearch
    },
    props: {
      model: {
        type: Object,
        default: function () {
          return {
            sort: null,
            page: 1,
            search: ''
          }
        }
      },
      filters: {
        type: Array,
        default: function () {
          return []
        }
      },
      groups: {
        type: Array,
        default: function () {
          return []
        }
      },
      download: {
        type: Object
      },
      methods: {
        type: Array,
        default: function () {
          return []
        }
      },
      aggregate: {
        type: Boolean,
        default: false
      },
      rows: {
        type: Number,
        default: 0
      },
      sort: {
        type: Boolean,
        default: false
      },
      search: {
        type: Boolean,
        default: false
      },
      filter: {
        type: Boolean,
        default: false
      },
      group: {
        type: Boolean,
        default: false
      },
      fields: {
        type: Array
      },
      data: {
        type: Array
      },
      run: {
        type: Function,
        default (target, model) {
          T.debug(`run: ${target}`, model)
        }
      },
      language: {
        type: String,
        default: 'en'
      }
    },
    data: function () {
      return {
        tableFields: this.fields || [],
        expression: false,
        data0: [],
        data1: [],
        data2: [],
        data3: [],
        view: [],
        id: T.randomId()(),
        isLoading: false
      }
    },
    mounted: function () {
      this.load()
    },
    watch: {
      data: function () {
        this.load()
      },
      fields: function () {
        this.load()
      }
    },
    methods: {
      load: function () {
        if (this.$data.isLoading) {
          return
        }
        this.$data.isLoading = true
        this.$data.tableFields = this.fields || []
        this.$data.expression = false

        if (!this.$data.tableFields.length) {
          this.$data.tableFields = this.setFields(this.data)
        } else if (this.aggregate) {
          this.$data.tableFields.forEach(field => {
            if (field.expression) {
              this.$data.expression = true
            }
          })
        }
        
        this.$data.tableFields.forEach((field, i) => {
          if (field.label === undefined) {
            this.$set(this.$data.tableFields[i], 'label', field.id)
          }
        })

        if (this.data) {
          this.data.forEach((row, i) => {
            this.$data.tableFields.forEach(field => {
              this.$set(this.data[i], field.id, T.parse(field.format)(row[field.id]))
            })
          })
          this.populate(this.data, this.$data.data0)
        }

        this.$data.isLoading = false 
      },
      aggregateData: function (field) {
        if (field.expression && this.aggregate) {
          return this.formatData(T.evaluate(field.expression)(this.$data.data1), field.format)
        }
      },
      isVisible: function (field) {
        if (!this.groups.length || this.groups.indexOf(field.id) !== -1 || field.expression) {
          return true
        }
        return false
      },
      getFields: function (method) {
        if (method === 'download' && this.download && this.download.fields) {
          return this.download.fields
        }
        var R = []

        this.$data.tableFields.forEach(field => {
          if (field[method] !== false && this.isVisible(field) && !field.button) {
            R.push(field)
          }
        })

        return R
      },
      display: function (section) {
        if (section === 'methods' && (
          this.filter || this.group || this.methods.length || this.download
        )) {
          return
        }
        if (section === 'filter' && this.filter) {
          return
        } 
        if (section === 'group' && this.group) {
          return
        } 
        if (section === 'download' && this.download) {
          return
        } 
        if (section === 'pager' && this.rows) {
          return
        }
        if (section === 'search' && this.search) {
          return
        } 
        if (section === 'aggregate' && this.$data.expression && this.$data.view.length) {
          return
        }
        if (section === 'head' && this.$data.tableFields.length) {
          return
        }
        return {
          display: 'none'
        }
      }
    }
  }
</script>

<template>
  <div>
    <p :style="display('methods')" class="text-center">
      <span :style="display('filter')">
        <tmx-filter
          :active="filters"
          :fields="tableFields"
          :input="data0"
          :output="data1"
          :language="language"
        >
        </tmx-filter>&nbsp;
      </span>
      <span :style="display('group')">
        <tmx-group
          :active="groups"
          :fields="tableFields"
          :input="data2"
          :output="data3"
          :language="language"
        >
        </tmx-group>&nbsp;
      </span>
      <span v-for="m in methods">
        <tmx-button
          :type="m.button"
          :icon="m.icon"
          :click="m.click"
          :data="m.model"
          :label="m.label"
        />&nbsp;
      </span>
      <span :style="display('download')">
        <tmx-download
          v-bind="download"
          :fields="getFields('download')"
          :data="data3"
          :language="language"
        >
        </tmx-download>&nbsp;
      </span>
    </p>
    <p :style="display('pager')" class="text-center">
      <tmx-pager
        :model="model"
        :rows="rows"
        :input="data3"
        :output="view"
        :language="language"
      ></tmx-pager>
    </p>
    <table class="table table-striped table-bordered table-condensed table-hover">
      <thead>
        <tr :style="display('search')">
          <th colspan="100%" class="text-center">
            <tmx-search :input="data1" :output="data2" :model="model"></tmx-search>
          </th>
        </tr>
        <tr :style="display('aggregate')">
          <th
            v-for="field in tableFields"
            v-show="isVisible(field)"
            class="text-center"
          >
            {{aggregateData(field)}}
          </th>
        </tr>
        <tr :style="display('head')">
          <tmx-head
            v-for="field in tableFields"
            v-show="isVisible(field)"
            v-bind="field"
            :model="model"
            :data="data3"
            :check="field.format === 'boolean' && field.static === false && !groups.length"
            :sort="sort"
          >
          </tmx-head>
        </tr>
      </thead>
      <tbody v-if="data">
        <tr v-for="row in view" :style="{'background-color' : row.bgcolor}">
          <tmx-body
            v-for="field in tableFields"
            v-show="isVisible(field)"
            :model="row"
            :language="language"
            :static="groups.length ? true : field.static"
            :click="field.click"
            v-bind="field"
          >
          </tmx-body>
        </tr>
      </tbody>
    </table>
    <p v-if="!data" style="font-size:600%" class="text-center">
      <tmx-icon type="refresh" spin></tmx-icon>
    </p>
  </div>
</template>
