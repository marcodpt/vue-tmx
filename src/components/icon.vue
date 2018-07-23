<script type="text/babel">
  import lib from '../lib.js'
  import icon from 'vue-awesome'

  module.exports = {
    components: {
      icon: icon
    },
    props: {
      name: {
        type: String,
        validator: lib.methods.isIcon,
        default: ''
      },
      spin: {
        type: Boolean,
        default: false
      },
      scale: {
        type: [Number, String],
        default: 1
      }
    }
  }
</script>

<template>
  <icon v-if="name !== ''"
    :name="name"
    class="glyphicon"
    :spin="spin"
    :scale="scale"
  ></icon>
</template>
