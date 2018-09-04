<script type="text/babel">
  import tmxSelect from './select.vue'

  module.exports = {
    components: {
      'tmx-select': tmxSelect
    },
    props: {
      model: {
        type: Object,
        required: true
      },
      id: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'text'
      },
      formatter: {
        type: Function,
        default: function (x) {
          return x
        }
      }
    },
    methods: {
      change: function (id, files) {
        this.model[this.id] = files
      },
      getStyle: function () {
        return {
          'white-space': String(this.model[this.id]).match(/\n/) ? 'pre-line' : null
        }
      },
      getBarColor: function () {
        var value = parseInt(this.model[this.id])
        value = isNaN(value) || value < 0 ? 0 : value
        value = value > 100 ? 100 : value

        return `hsl(${(100 - value) / 100 * 240}, 100%, ${value / 4 + 25}%)`
      }
    }
  }
</script>

<template>
  <tmx-select
    v-if="type === 'select'"
    :model="model"
    :id="id"
    v-bind="$attrs"
  />
  <textarea
    v-else-if="type === 'textarea'"
    v-model="model[id]"
    :id="id"
    :rows="$attrs.rows > 0 ? $attrs.rows : 6"
  />
  <input 
    v-else-if="type === 'file'"
    type="file"
    :id="id"
    @change="change($event.target.name, $event.target.files)"
  />
  <div v-else-if="type === 'progressbar'" :style="{
      width: '600px',
      'border-radius': '5px',
      'background-color': 'lightgrey'
    }"
  >
    <div
      :style="{
        'text-align': 'center',
        'width': (model[id] > 100 ? 100 : model[id]) + '%',
        'border-radius': '5px',
        'background-color': getBarColor(),
        'color': 'white',
        'overflow-x': 'hidden'
      }"
    >	
      {{model[id]}}%
    </div>
  </div>
  <input 
    v-else-if="type"
    :type="type"
    :id="id"
    v-model="model[id]"
  />
  <a v-else-if="$attrs.href" :style="getStyle()" target="_blank">{{formatter(model[id])}}</a>
  <span v-else :style="getStyle()">{{formatter(model[id])}}</span>
</template>
