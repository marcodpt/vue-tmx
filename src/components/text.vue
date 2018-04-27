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
      },
      disabled: {
        type: Boolean,
        default: false
      },
      rows: {
        type: Number,
        default: 6
      },
      placeholder: {
        type: String,
        default: ''
      }
    }
  }
</script>

<template>
  <textarea
    v-model="model[id]"
    :placeholder="placeholder"
    :rows="rows"
    :disabled="disabled"
    :id="id"
    class="form-control"
  >
  </textarea>
</template>
