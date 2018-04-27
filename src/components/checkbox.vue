<script type="text/babel">
  module.exports = {
    props: {
      model: {
        type: Object,
        required: true
      },
      id: {
        type: String,
        required: true
      }
    }
  }
</script>

<template>
  <input 
    v-model="model[id]" 
    type="checkbox"
    :id="id"
  />
</template>
