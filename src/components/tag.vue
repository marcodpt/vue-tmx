<script type="text/babel">
  import carousel from './carousel.vue'
  import barcode from './barcode.vue'
  import chart from './chart.vue'
  import navbar from './navbar.vue'
  import form from './form.vue'
  import table from './table.vue'
  import modal from './modal.vue'

  module.exports = {
    components: {
      'tmx-carousel': carousel,
      'tmx-barcode': barcode,
      'tmx-chart': chart,
      'tmx-navbar': navbar,
      'tmx-form': form,
      'tmx-table': table,
      'tmx-modal': modal
    },
    props: {
      tag: {
        type: String,
        default: 'div'
      },
      schema: {
        type: Object,
        default: function () {
          return {}
        }
      }
    }
  }
</script>

<template>
  <div v-if="tag == 'div'">
    <slot></slot>
  </div>
  <span v-else-if="tag == 'span'">
    <slot></slot>
  </span>
  <a v-else-if="tag == 'a'">
    <slot></slot>
  </a>
  <p v-else-if="tag == 'p'">
    <slot></slot>
  </p>
  <label v-else-if="tag == 'label'">
    <slot></slot>
  </label>
  <h1 v-else-if="tag == 'h1'">
    <slot></slot>
  </h1>
  <h2 v-else-if="tag == 'h2'">
    <slot></slot>
  </h2>
  <h3 v-else-if="tag == 'h3'">
    <slot></slot>
  </h3>
  <h4 v-else-if="tag == 'h4'">
    <slot></slot>
  </h4>
  <h5 v-else-if="tag == 'h5'">
    <slot></slot>
  </h5>
  <h6 v-else-if="tag == 'h6'">
    <slot></slot>
  </h6>
  <hr v-else-if="tag == 'hr'" />
  <img v-else-if="tag == 'img'" v-bind="schema"/>
  <video v-else-if="tag == 'video'" v-bind="schema"/>
  <audio v-else-if="tag == 'audio'" v-bind="schema"/>
  <tmx-carousel v-else-if="tag == 'carousel'" v-bind="schema"/>
  <tmx-barcode v-else-if="tag == 'barcode'"  v-bind="schema"/>
  <tmx-chart v-else-if="tag == 'chart'"  v-bind="schema"/>
  <tmx-navbar v-else-if="tag == 'navbar'"  v-bind="schema"/>
  <tmx-form v-else-if="tag == 'form'"  v-bind="schema"/>
  <tmx-table v-else-if="tag == 'table'"  v-bind="schema"/>
  <tmx-modal v-else-if="tag == 'modal'"  v-bind="schema"/>
</template>
