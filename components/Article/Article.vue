<template>
   <v-card class="article_card" @click="redirectToDetail(article.id)">
      <div class="list_elem_wrapper">
         <div class="list_elem_wrapper__img_container">
            <img
               class="list_elem_wrapper__img_container__img"
               src="https://cdn.dribbble.com/users/41613/screenshots/3848663/chronicle_prev.jpg?compress=1&resize=400x300"
               alt=""
            />
         </div>
         <div class="list_elem_wrapper__preview_content">
            <div class="list_elem_wrapper__preview_content__short_info">
               <h2
                  class="list_elem_wrapper__preview_content__short_info__title"
               >
                  {{ article.name }}
               </h2>
               <h4
                  class="list_elem_wrapper__preview_content__short_info__short"
                  v-if="article.preview || article.short_header"
               >
                  {{ preview }}
               </h4>
               <h4
                  class="list_elem_wrapper__preview_content__short_info__short"
                  v-else
               >
                  Краткое описание статьи или анонс статьи
               </h4>
            </div>
            <Author :preview="previewAuthor" />
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
import Author from './Author'
export default {
   name: 'Article',
   components: { Author },
   props: ['article'],
   data: () => ({
      previewAuthor: true,
   }),
   computed: {
      preview() {
         return this.article.preview
            ? this.article.preview
            : this.article.short_header
            ? this.article.short_header
            : 'Краткое описание статьи или анонс статьи'
      },
   },
   methods: {
      redirectToDetail(id) {
         this.$router.push('/articles/' + id)
      },
   },
}
</script>

<style lang="scss">
@import '@/assets/styles/lists';
</style>
