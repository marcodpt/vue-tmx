<script type="text/babel">
  import {Carousel, Slide} from 'vue-carousel'

  module.exports = {
    inheritAttrs: false,
    components: {
      'carousel' : Carousel,
      'slide': Slide
    },
    props: {
      slides: {
        type: Array,
        default: function () {
          return []
        }
      },
      buttons: {
        type: Boolean,
        default: false
      },
      time: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<template>
  <carousel
    v-if="slides"
    :perPage="1"
    :navigationEnabled="buttons"
    :loop="true"
    :autoplay="time ? true : false"
    :autoplayTimeout="1000 * time"
  >
    <slide v-for="slide in slides">
      <img v-if="slide.image" :href="slide.href" :src="slide.image" style="width:100%"/>
      <video v-if="slide.video" :src="slide.video" style="width:100%" controls/>
      <h3 v-if="slide.label">{{slide.label}}</h3>
      <p v-if="slide.text" style="white-space:pre-wrap">{{slide.text}}</p>
    </slide>
  </carousel>
</template>
