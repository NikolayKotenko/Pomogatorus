<template>
  <v-card
    :elevation="0"
    :outlined="false"
    class="article_small_card"
    @click="$store.dispatch('linkToArticle', article.id)"
  >
    <div>
      <h2 class="title">
        {{ article.name }}
      </h2>
    </div>
    <div class="img_wrapper">
      <v-img
        :class="{'empty_img': ! $store.getters.getImageByEClientFilesObj(article.e_client_files) }"
        :src="$store.getters.getImageByEClientFilesObj(article.e_client_files)"
        class="img"
        cover
      />
      <span v-if="! $store.getters.getImageByEClientFilesObj(article.e_client_files)">Фото статьи</span>
    </div>
    <div class="icons_and_time_wrapper" @click="$event.stopPropagation()">
      <ViewsAndLikes :article="article"/>
      <h4 class="time">
        {{ article.updated_at }}
      </h4>
    </div>
  </v-card>
</template>

<script>
import ViewsAndLikes from '../Common/ViewsAndLikes.vue';

export default {
  name: 'ArticleSmallCard',
  components: { ViewsAndLikes },
  props: {
    article: {
      type: Object,
      default: () => {
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.article_small_card {
  display: grid;
  grid-row-gap: 10px;
  padding: 10px;
  transition: all 0.4s ease-in-out !important;
  opacity: 0.6;
  max-width: 270px;

  &:hover {

    box-shadow: 0px 5px 20px 7px rgba(34, 60, 80, 0.2) !important;
    opacity: 1;
  }
}

.title {
  font-size: 1em !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px
}

.img_wrapper {
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 250px;
  height: 150px;

  span {
    position: absolute;
  }
}

.img {
  height: 100%;
  border-radius: 5px;
}

.empty_img {
  background: #ADADAD;
  height: 100%;
  width: 100%;
}

.icons_and_time_wrapper {
  display: flex;
  justify-content: space-between;
  align-self: end;
  font-size: 0.8em !important;
}

.icons_wrapper {
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
}

.icon-eye {
  padding-right: 10px !important;
}

.time {
  font-weight: 400;
  font-style: normal;
}
</style>
