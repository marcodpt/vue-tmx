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
      multiple: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      change: function (id, files) {
        this.model[this.id] = files
      }
    }
  }
</script>

<template>
  <input 
    type="file"
    class="form-control"
    :multiple="multiple"
    :name="id"
    :disabled="disabled"
    :id="id"
    @change="change($event.target.name, $event.target.files)"
  />
</template>
