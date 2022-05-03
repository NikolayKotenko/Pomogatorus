<template>
  <div class="article-template">
    <h1 class="article-template__title">
      {{ article.name }}
    </h1>
    <div class="article-template__content" v-html="refactored_content">
    </div>
  </div>
</template>

<script>
export default {
  name: "_id.vue",
  async asyncData({$axios, store, params}) {
    const options = {
      method: 'GET',
      url: `${store.state.BASE_URL}/entity/articles/${params.id}`,
      headers: {
        Authorization: '666777'
      },
    }
    try {
      const article_request = await $axios(options)
      console.log(article_request.data.data)
      const article = article_request.data.data
      return {article}
    } catch (error) {
      console.log(error.response.data.message)
    }

  },
  data: () => ({

  }),
  computed: {
    refactored_content() {
      return JSON.parse(JSON.parse(this.article.content))
    }
  },
}
</script>

<style lang="scss" scoped>
.article-template {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  &__title {
    width: 100%;
    text-align: center;
  }
}
</style>
