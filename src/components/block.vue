<script type="text/babel">
  import T from 'libt'
  import tmxTag from './tag.vue'

  module.exports = {
    name: 'tmx-block',
    components: {
      'tmx-tag': tmxTag
    },
    props: {
      tag: {
        type: String,
        default: 'div'
      },
      content: {
        default: ''
      }
    }
  }
</script>

<template>
  <tmx-tag v-if="content && content instanceof Array" :tag="tag">
    <tmx-block v-for="tag in content" v-bind="tag" :method="tag.method ? tag.method : method">
    </tmx-block>
  </tmx-tag>
  <tmx-tag v-else-if="content && typeof content === 'object' && content.content" :tag="tag">
    <tmx-block v-bind="content" :method="content.method ? content.method : method">
    </tmx-block>
  </tmx-tag>
  <tmx-tag v-else-if="content && typeof content === 'object'" :schema="content" :tag="tag" />
  <tmx-tag v-else-if="content" :tag="tag">{{content}}</tmx-tag>
</template>
