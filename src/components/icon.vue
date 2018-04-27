<script type="text/babel">
  import lib from '../lib.js'

  module.exports = {
    props: {
      type: {
        type: String,
        validator: lib.methods.isIcon,
        default: ''
      },
      spin: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<template>
  <span 
    v-if="type !== ''"
    :class="['glyphicon', 'glyphicon-' + type, spin ? 'spinning' : '']"
    aria-hidden="true"
  ></span>
</template>

<style>
.glyphicon.spinning {
    animation: spin 1s infinite linear;
    -webkit-animation: spin2 1s infinite linear;
}

@keyframes spin {
    from { transform: scale(1) rotate(0deg); }
    to { transform: scale(1) rotate(360deg); }
}

@-webkit-keyframes spin2 {
    from { -webkit-transform: rotate(0deg); }
    to { -webkit-transform: rotate(360deg); }
}
</style>
