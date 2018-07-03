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
      },
      video: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<template>
  <video v-if="video" :id="id" :style="{
    display: 'block',
    margin: 'auto',
    height: vertical ? '100%' : 'auto',
    width: vertical ? 'auto' : '100%'
  }" controls>
    <source :src="src">
    Video: {{src}}
  </video>
  <img v-else :id="id" :src="src" :style="{
    display: 'block',
    margin: 'auto',
    height: vertical ? '100%' : 'auto',
    width: vertical ? 'auto' : '100%'
  }"/>
</template>
