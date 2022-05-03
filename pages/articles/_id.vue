<template>
  <div class="article-template">
    <div class="article-template__title">
      {{ article.name }}
    </div>
    <div class="article-template__content">
      {{ article.content }}
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
}
</script>

<style lang="scss" scoped>
.article-template {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
</style>
