<template>
  <v-card
    class="article_card img-activator"
    @click="$store.dispatch('linkToArticle', article.id)"
  >
    <div class="list_elem_wrapper">
      <div class="list_elem_wrapper__title">
        {{ article.name }}
      </div>
      <div class="list_elem_wrapper__img_container img-container">
        <v-img
          :src="$store.getters.getImageByEClientFilesObj(article.e_client_files)"
          alt=""
          class="list_elem_wrapper__img_container__img img-hover"
          cover
          height="100%"
        />
      </div>
      <div
        class="list_elem_wrapper__short_info"
        @click="$store.dispatch('linkToArticle', article.id)"
      >
        {{ article.short_header }}
      </div>
      <div class="list_elem_wrapper__buttons" @click="$event.stopPropagation()">
        <ViewsAndLikes :article="article"/>
        <h4 class="list_elem_wrapper__buttons__time">
          {{ article.updated_at }}
        </h4>
      </div>
    </div>
  </v-card>
</template>

<script>
import ButtonStyled from '../Common/ButtonStyled.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import ViewsAndLikes from '../Common/ViewsAndLikes.vue';
import Author from './Author';

export default {
  name: 'Article',
  components: { ViewsAndLikes, ButtonStyled, Author, TooltipStyled },
  props: ['article'],
  data: () => ({
    previewAuthor: true
  }),

  computed: {

  },
  methods: {
  }
};
</script>

<style lang="scss"></style>
