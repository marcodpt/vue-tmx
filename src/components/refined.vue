<script type="text/babel">
  import T from 'libt'
  import lib from '../lib.js'
  import tmxRaw from './raw.vue'
  import tmxIcon from './icon.vue'
  import tmxData from './data.vue'
  import tmxInput from './input.vue'
  import tmxCheckbox from './checkbox.vue'
  import tmxButton from './button.vue'

  module.exports = {
    mixins: [lib],
    components: {
      'tmx-raw': tmxRaw,
      'tmx-icon': tmxIcon,
      'tmx-data': tmxData,
      'tmx-input': tmxInput,
      'tmx-checkbox': tmxCheckbox,
      'tmx-button': tmxButton
    },
    props: {
      data: {
        type: Array
      },
      fields: {
        type: Array
      }
    },
    methods: {
      center: function (field, row) {
        return !T.match('text')(row[field.id])
      },
      bgcolor: function (field, row) {
        if (field.format.split(':').indexOf('rgb') > -1 && row[field.id]) {
          return `#${row[field.id]}`
        }
        return null
      },
      getLabel: function (field, row) {
        return T.format(row[id], field.format, this.translate)
      },
      runSort: function () {

      }
    }
  }
</script>

<template>
  <tmx-raw
    class="table table-striped table-bordered table-condensed table-hover"
    :data="data"
    :fields="fields"
  >
    <template slot="th" slot-scope="{field}">
      <!--<tmx-button-->
        <!--v-if="check"-->
        <!--type="success"-->
        <!--icon="check"-->
        <!--size="sm"-->
        <!--:click="runCheck"-->
      <!--/>-->
      <a 
        @click="runSort" 
        style="text-decoration:none;"
        :style="{cursor: field.sort && field.id !== '' ? 'pointer' : null}"
      >
        <tmx-icon :name="field.icon"/>
        {{field.label || field.placeholder}}
        <!--<span v-if="model[modelId] === id" class="caret"></span>-->
        <!--<span v-if="model[modelId] === '-' + id" class="dropup">-->
          <!--<span class="caret"></span>-->
        <!--</span>-->
      </a>
    </template>
    <template slot="td" slot-scope="{field, row}">
      <tmx-button
        v-if="field.button && field.click"
        :type="field.button"
        :icon="field.icon"
        :click="field.click"
        :data="row"
        :label="field.label"
      />
      <tmx-button
        v-else-if="field.click"
        type="info"
        :icon="field.icon"
        :click="field.click"
        :data="row"
        :label="getLabel()"
      />
      <tmx-data v-else-if="field.static" v-bind="field" :model="row">
      </tmx-data>
      <tmx-checkbox
        v-else-if="field.format === 'boolean'"
        v-bind="field"
        :model="row"
      >
      </tmx-checkbox>
      <tmx-input
        v-else
        v-bind="field"
        :model="row"
      >
      </tmx-input>
    </template>
    <p slot="loading" style="margin:40px 0">
      <tmx-icon name="sync" scale="6" spin></tmx-icon>
    </p>
  </tmx-raw>
</template>

<style>
  .table th, .table td {
    vertical-align: middle;
    text-align: center;
  }
</style>
