<template>
  <v-card class='article_card' :href="'/articles/' + article.id">
    <div class='list_elem_wrapper'>
      <div class="list_elem_wrapper__preview_content__short_info__title_info">
        <h2 class='list_elem_wrapper__previewтз_content__short_info__title_info__title'>
          {{ article.name }}
        </h2>
        <h4 class="list_elem_wrapper__preview_content__short_info__title_info__time">
          {{article.updated_at}}
        </h4>
      </div>
      <div class='list_elem_wrapper__img_container'>
        <v-img
          alt=''
          class='list_elem_wrapper__img_container__img'
          max-width="300"
          width="300"
          height="100%"
          cover
          :src="$store.getters.getImageByEClientFilesObj(article.e_client_files)"
        />
      </div>
      <div class='list_elem_wrapper__preview_content'>
        <div class='list_elem_wrapper__preview_content__short_info'>
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
  methods: {}
}
</script>

<style lang='scss'></style>
