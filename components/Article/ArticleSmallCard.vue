<template>
  <div
    class="article_small_card"
    @click="$store.dispatch('linkToArticle', article.id)"
  >
    <div class="img_container">
      <v-img
        :class="{'empty_img': ! $store.getters.getImageByEClientFilesObj(article.e_client_files) }"
        :src="$store.getters.getImageByEClientFilesObj(article.e_client_files)"
        class="img"
        cover
      />
    </div>

    <div class="article_name">
      {{ article.name }}
    </div>

<!--    <div>-->
<!--      <h2 class="title">-->
<!--        {{ article.name }}-->
<!--      </h2>-->
<!--    </div>-->
<!--    <div class="img_wrapper">-->
<!--      <v-img-->
<!--
<!--      />-->
<!--      <span v-if="! $store.getters.getImageByEClientFilesObj(article.e_client_files)">Фото статьи</span>-->
<!--    </div>-->
<!--    <div class="icons_and_time_wrapper" @click="$event.stopPropagation()">-->
<!--      <ViewsAndLikes :article="article"/>-->
<!--      <h4 class="time">-->
<!--        {{ article.updated_at }}-->
<!--      </h4>-->
<!--    </div>-->
  </div>
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
@import 'assets/styles/style';
.article_small_card {
  display: grid;
  position: relative;
  border-radius: $b-r30 !important;
  width: 415px;
  max-height: 250px;
  cursor: pointer;
  transition: $transition;
  &:hover {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  }

  .img_container {
    position: relative;
    display: inline-block;
    overflow: hidden;
    border-radius: $b-r30 !important;
    .img {
      height: auto;
      display: block;
      width: 100%;
      border-radius: $b-r30 !important;

    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      border-radius: $b-r30;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
      z-index: 1;
      pointer-events: none;
    }
  }
  .article_name {
    position: absolute;
    left: 20px;
    bottom: 20px;
    @extend .white-small-header-page;
    font-size: 1.5em !important;
    z-index: 2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: wrap !important;
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
