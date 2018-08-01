<script type="text/babel">
  module.exports = {
    props: {
      value: {
        type: Number,
        default: 0,
        validator: function (value) {
          return value >= 0
        }
      },
      width: {
        type: String,
        default: '600px'
      },
      borderRadius: {
        type: String,
        default: '5px'
      },
      bgcolor: {
        type: String,
        default: 'lightgrey'
      },
      barcolor: {
        type: String,
        default: 'lightgreen'
      },
      textcolor: {
        type: String,
        default: 'white'
      }
    }
  }
</script>

<template>
  <div :style="{
      width: width,
      'border-radius': borderRadius,
      'background-color': bgcolor
    }"
  >
    <div
      :style="{
        'text-align': 'center',
        'width': (value > 100 ? 100 : value) + '%',
        'border-radius': borderRadius,
        'background-color': barcolor,
        'color': textcolor,
        'overflow-x': 'hidden'
      }"
    >	
      {{value}}%
    </div>
  </div>
</template>
