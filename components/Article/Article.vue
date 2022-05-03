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
        <h2>{{article.short_header}}</h2>
        <h4>{{article.preview}}</h4>
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
