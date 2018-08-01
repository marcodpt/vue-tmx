<script type="text/babel">
  import tmxBarcode from './barcode.vue'
  import tmxImage from './image.vue'

  module.exports = {
    components: {
      'tmx-barcode': tmxBarcode,
      'tmx-image': tmxImage
    },
    props: {
      src: {
        type: String,
        default: ''
      },
      label: {
        type: String,
        default: ''
      },
      sublabel: {
        type: String,
        default: ''
      },
      barcode: {
        type: [Number, String],
        default: ''
      },
      pageHeader: {
        type: Boolean,
        default: false
      },
      center: {
        type: Boolean,
        default: false
      },
      size: {
        type: [Number, String],
        default: 3
      },
      hr: {
        type: Object
      }
    }
  }
</script>

<template>
  <div :class="{'page-header': pageHeader, 'row': src || barcode}">
    <div v-if="src || barcode" class="col-xs-2" style="height:100%;padding:10px">
      <tmx-image v-if="src" :src="src"></tmx-image>
    </div>
    <div :style="center ? 'text-align:center' : null" :class="{'col-xs-8': src || barcode}">
      <h1 v-if="size == 1">{{label}} <small v-if="sublabel">{{sublabel}}</small></h1>
      <h2 v-else-if="size == 2">{{label}} <small v-if="sublabel">{{sublabel}}</small></h2>
      <h4 v-else-if="size == 4">{{label}} <small v-if="sublabel">{{sublabel}}</small></h4>
      <h5 v-else-if="size == 5">{{label}} <small v-if="sublabel">{{sublabel}}</small></h5>
      <h6 v-else-if="size == 6">{{label}} <small v-if="sublabel">{{sublabel}}</small></h6>
      <h3 v-else-if="size > 0">{{label}} <small v-if="sublabel">{{sublabel}}</small></h3>
    </div>
    <div v-if="barcode || src" class="col-xs-2" style="height:100%;padding:10px">
      <tmx-barcode v-if="barcode" :value="barcode"/>
    </div>
    <hr v-if="hr" :style="hr"/>
  </div>
</template>
