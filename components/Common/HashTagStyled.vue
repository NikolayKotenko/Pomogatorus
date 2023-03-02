<template>
  <span class="hashtag_styled" v-html="'#'+Text"></span>
</template>

<script>
export default {
  name: "HashTagStyled",
  props:{
    Link: {
      type: String,
      default: ''
    },
    Text: {
      type: String,
      default: ''
    },
    Target: {
      type: String,
      default: '_self'
    },
  }
};
</script>

<style lang="scss" scoped>
.hashtag_styled{
  color: #1976d2;
  text-decoration: underline;
}
</style>
