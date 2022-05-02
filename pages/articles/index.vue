<template>
  <div class="list_container">
    <Article
      v-for="(article, index) in $store.state.list_articles"
      :key="index"
    />
  </div>
</template>

<script>
import Article from "../../components/Article/Article";
export default {
  name: "index.vue",
  components: {Article}
}
</script>

<style scoped lang="scss">

</style>
