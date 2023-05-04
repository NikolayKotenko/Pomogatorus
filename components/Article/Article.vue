<template>
  <v-card
    :href="'/articles/' + article.id"
    class="article_card img-activator">
    <div class="list_elem_wrapper">
      <div class="list_elem_wrapper__preview_content__short_info__title_info">
        <h2 class="list_elem_wrapper__preview_content__short_info__title_info__title">
          {{ article.name }}
        </h2>

      </div>
      <div class="list_elem_wrapper__tag_container">
        <a v-for="(tag, key) in article._all_tags" :href="'/podborki/'+tag.code">#{{ tag.name }}</a>
      </div>
      <div class="list_elem_wrapper__img_container img-container">
        <v-img
          :src="$store.getters.getImageByEClientFilesObj(article.e_client_files)"
          alt=""
          class="list_elem_wrapper__img_container__img img-hover"
          cover
          height="100%"
          max-width="300"
        />
      </div>
      <div class="list_elem_wrapper__preview_content">
        <div
          class="list_elem_wrapper__preview_content__short_info"
        >
          <h4
            v-if="article.short_header"
            class="list_elem_wrapper__preview_content__short_info__short"
          >
            {{ preview }}
          </h4>
        </div>
        <div class="list_elem_wrapper__preview_content__buttons">
          <ViewsAndLikes :article="article"></ViewsAndLikes>
          <h4 class="list_elem_wrapper__preview_content__short_info__title_info__time">
            {{ article.updated_at }}
          </h4>
        </div>

      </div>
    </div>
  </v-card>
</template>

<script>
import Author from "./Author";
import ButtonStyled from "../Common/ButtonStyled.vue";
import ViewsAndLikes from "../Common/ViewsAndLikes.vue";

export default {
  name: "Article",
  components: { ViewsAndLikes, ButtonStyled, Author },
  props: ["article"],
  data: () => ({
    previewAuthor: true
  }),

  computed: {
    preview() {
      if (this.article.short_header) {
        if (this.article.short_header.length > 50) {
          return this.article.short_header.substring(0, 50) + "...";
        } else {
          return this.article.short_header;
        }
      } else {
        return "";
      }
    }
  },
  methods: {}
};
</script>

<style lang="scss"></style>
