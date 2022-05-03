<template>
  <div class="article-template">
    <div class="article-template__title">

    </div>
    <div class="article-template__content">

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
      const article = await $axios(options)
      console.log(article.data.data)
    } catch (error) {
      console.log(error.response.data.message)
    }

  },
  data: () => ({

  }),
}
</script>

<style lang="scss" scoped>

</style>
