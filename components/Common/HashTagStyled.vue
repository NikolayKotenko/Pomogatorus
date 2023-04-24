<template><span class="hashtag_styled" v-html="'#'+text"/></template>
<script>
export default {
  name: 'HashTagStyled',
  props: {
    link: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    target: {
      type: String,
      default: '_self'
    }
  }
}
</script>

<style lang='scss' scoped>
.hashtag_styled {
  color: #1976d2;
  text-decoration: underline;
}
</style>
