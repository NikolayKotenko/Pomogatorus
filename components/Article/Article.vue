<template>
  <div class="list_elem_wrapper">
    <div class="list_elem_wrapper__img_container">
      <img
        class="list_elem_wrapper__img_container__img"
        src="https://cdn.dribbble.com/users/41613/screenshots/3848663/chronicle_prev.jpg?compress=1&resize=400x300"
        alt=""
      >
    </div>
    <div class="list_elem_wrapper__preview_content">
      <div class="list_elem_wrapper__preview_content__short_info">
        <h2 class="list_elem_wrapper__preview_content__short_info__title">{{article.name}}</h2>
        <h4 class="list_elem_wrapper__preview_content__short_info__short" v-if="article.preview">{{article.preview}}</h4>
        <h4 class="list_elem_wrapper__preview_content__short_info__short" v-else>Краткое описание статьи или анонс статьи</h4>
      </div>
      <v-btn
        text
        color="blue darken-4"
        @click="redirectToDetail(article.id)"
      >
        Читать
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "Article",
  props: ['article'],
  data: () => ({

  }),
  methods: {
    redirectToDetail(id) {
      this.$router.push('/articles/' + id)
    }
  },
}
</script>

<style lang="scss">
@import '@/assets/styles/lists';
</style>
