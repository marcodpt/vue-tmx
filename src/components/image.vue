<script type="text/babel">
  module.exports = {
    props: {
      id: {
        type: String
      },
      src: {
        type: String
      },
      vertical: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<template>
  <img :id="id" :src="src" :style="{
    display: 'block',
    margin: 'auto',
    height: vertical ? '100%' : 'auto',
    width: vertical ? 'auto' : '100%'
  }"/>
</template>
