<script type="text/babel">
  import T from 'libt'
  import Chart from 'chart.js'

  module.exports = {
    props: {
      id: {
        type: String,
        default: function () {
          return 'chart_' + T.randomId()()
        }
      },
      label: {
        type: String,
        default: 'Data'
      },
      data: {
        type: Array,
        default: []
      },
      fieldX: {
        type: String,
        default: 'chartX'
      },
      fieldY: {
        type: String,
        default: 'chartY'
      },
      width: {
        type: Number,
        default: 1000
      },
      height: {
        type: Number,
        default: 400
      },
      fill: {
        type: Boolean,
        default: false
      },
      borderColor: {
        type: String,
        default: 'lightgreen'
      },
      pointStyle: {
        type: String,
        default: 'circle'
      },
      responsive: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        chart: null
      }
    },
    methods: {
      build: function () {
        if (this.$data.chart !== null){
          this.$data.chart.destroy();
        }

        var canvas = document.getElementById(this.id)

        canvas.width = this.width
        canvas.height = this.height

        var chart = canvas.getContext('2d')

        this.$data.chart = new Chart(chart, {
          type: 'line',
          data: {
            labels: this.data.map(row => row[this.fieldX]),
            datasets:[{
              label: this.label,
              data: this.data.map(row => row[this.fieldY]),
              fill: this.fill,
              borderColor: this.borderColor,
              pointStyle: this.pointStyle
            }]
          },
          options: {
            responsive: this.responsive
          }
        })
      }
    },
    mounted: function () {
      this.build()
    },
    watch: {
      data: function () {
        this.build()
      },
      width: function () {
        this.build()
      },
      height: function () {
        this.build()
      },
      fieldX: function () {
        this.build()
      },
      fieldY: function () {
        this.build()
      },
      label: function () {
        this.build()
      },
      fill: function () {
        this.build()
      },
      borderColor: function () {
        this.build()
      },
      pointStyle: function () {
        this.build()
      },
      responsive: function () {
        this.build()
      }
    }
  }
</script>

<template>
  <canvas :id="id" width="0" height="0" style="margin:auto;">
  </canvas>
</template>
