<template>
  <v-card class="article_card" @click="redirectToDetail(article.id)">
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
          <h4 class="list_elem_wrapper__preview_content__short_info__short" v-if="article.preview || article.short_header">{{preview}}</h4>
          <h4 class="list_elem_wrapper__preview_content__short_info__short" v-else>Краткое описание статьи или анонс статьи</h4>
        </div>
        <div class="author_wrapper">
          <img class="author_wrapper__img" alt="" src="https://png.pngtree.com/png-vector/20200614/ourlarge/pngtree-businessman-user-avatar-character-vector-illustration-png-image_2242909.jpg">
          <span class="author_wrapper__name">Копыткин Владислав</span>
          <span class="author_wrapper__date">26/05/2022</span>
        </div>
<!--        <v-btn-->
<!--          text-->
<!--          color="blue darken-4"-->
<!--          @click="redirectToDetail(article.id)"-->
<!--        >-->
<!--          Читать-->
<!--        </v-btn>-->
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "Article",
  props: ['article'],
  data: () => ({

  }),
  computed: {
    preview() {
      return this.article.preview ? this.article.preview : this.article.short_header ? this.article.short_header : 'Краткое описание статьи или анонс статьи'
    },
  },
  methods: {
    redirectToDetail(id) {
      this.$router.push('/articles/' + id)
    }
  },
}
</script>

<style lang="scss">
@import '@/assets/styles/lists';

.author_wrapper {
  display: flex;
  width: 100%;
  column-gap: 10px;
  align-items: center;
  font-size: 0.9em;
  padding: 5px;
  background: #FCFCFC;
  color: #999999;
  &__img {
    width: 28px;
    height: 28px;
    object-fit: cover;
    -o-object-fit: cover;
    border-radius: 50%;
  }
  &__name {
    flex: 1;
  }
  &__date {

  }
}
</style>
