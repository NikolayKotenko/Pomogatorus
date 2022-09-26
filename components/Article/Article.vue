<template>
  <v-card class='article_card' @click='redirectToDetail(article.id)'>
    <div class='list_elem_wrapper'>
      <div class='list_elem_wrapper__img_container'>
        <img
          alt=''
          class='list_elem_wrapper__img_container__img'
          src='https://cdn.dribbble.com/users/41613/screenshots/3848663/chronicle_prev.jpg?compress=1&resize=400x300'
        />
      </div>
      <div class='list_elem_wrapper__preview_content'>
        <div class='list_elem_wrapper__preview_content__short_info'>
          <h2 class='list_elem_wrapper__preview_content__short_info__title'>
            {{ article.name }}
          </h2>
          <h4
            v-if='article.short_header'
            class='list_elem_wrapper__preview_content__short_info__short'
          >
            {{ preview }}
          </h4>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import Author from './Author'

export default {
  name: 'Article',
  components: { Author },
  props: ['article'],
  data: () => ({
    previewAuthor: true
  }),
  computed: {
    preview() {
      if (this.article.short_header) {
        if (this.article.short_header.length > 50) {
          return this.article.short_header.substring(0, 50) + '...'
        } else {
          return this.article.short_header
        }
      } else {
        return ''
      }
    }
  },
  methods: {
    redirectToDetail(id) {
      this.$router.push('/articles/' + id)
    }
  }
}
</script>

<style lang='scss'></style>
