<template>
  <div class="article_wrapper">
    <div class="article_header">
      <v-img
        :src="$store.getters.getImageByEClientFilesObj(article.e_client_files)"
        :class="{'empty_img': ! $store.getters.getImageByEClientFilesObj(article.e_client_files) }"
        width="54"
        height="54"
      />
    </div>

    <div class="article_name">
      {{ article.name }}
    </div>

    <v-divider style="margin-top: 20px"/>

    <img
      :src="require('/assets/svg/icons/dottet_bg_for_small_article.svg')"
      class="dottet_bg"
    >
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
    },
    isTagsPage: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';
.article_wrapper {
  display: flex !important;
  flex-direction: column;
  border-radius: $b-r8;
  background-color: $white-color;
  width: 415px !important;
  margin-right: 20px;
  height: 290px;
  padding: 12px 0 0;
  font-size: 0.875em;
  .article_header {
    background-color: $grey1;
    padding: 10px;
    display: flex;
    column-gap: 10px;
    margin: 0 12px;
    .img {
      max-width: 54px;
      border-radius: 4px;
    }
    .article_name {
      font-weight: 600;
    }
  }
  .article_description {
    margin: 12px 12px 30px;
    color: $grey4;
    height: 85px;
    max-height: 90px;
    overflow: hidden
  }
  .article_footer {
    display: flex;
    justify-content: space-between;
    margin: 0 12px;
    .date_and_views {
      @extend .grey-text14;
      display: flex;
      grid-column-gap: 20px;
      align-items: center;
      .views {
        display: flex;
        align-items: center;
        column-gap: 4px;
      }
    }
    .likes_dislikes {
      display: flex;
      align-items: center;
      column-gap: 10px;
      .likes {
        display: flex;
        align-items: center;
        column-gap: 6px;
      }
      .dislikes {
        display: flex;
        align-items: center;
        column-gap: 6px;
      }
    }
  }
  .dottet_bg {
    display: flex;
    margin: 5px auto 8px;
    justify-content: center;
  }
}
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


.empty_img {
  background: #ADADAD;
  height: 100%;
  width: 100%;
}

.tags_article_small_card {
  display: grid;
  position: relative;
  border-radius: $b-r30 !important;
  width: 340px;
  max-height: 220px;
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
//.article_small_card {
//  display: grid;
//  position: relative;
//  border-radius: $b-r30 !important;
//  width: 415px;
//  max-height: 250px;
//  cursor: pointer;
//  transition: $transition;
//  &:hover {
//    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
//  }
//
//  .img_container {
//    position: relative;
//    display: inline-block;
//    overflow: hidden;
//    border-radius: $b-r30 !important;
//    .img {
//      height: auto;
//      max-height: 250px;
//      display: block;
//      width: 100%;
//      border-radius: $b-r30 !important;
//
//    }
//    &::before {
//      content: '';
//      position: absolute;
//      top: 0;
//      border-radius: $b-r30;
//      left: 0;
//      width: 100%;
//      height: 100%;
//      background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
//      z-index: 1;
//      pointer-events: none;
//    }
//  }
//  .article_name {
//    position: absolute;
//    left: 20px;
//    bottom: 20px;
//    @extend .white-small-header-page;
//    font-size: 1.5em !important;
//    z-index: 2;
//    display: -webkit-box;
//    -webkit-line-clamp: 2;
//    -webkit-box-orient: vertical;
//    overflow: hidden;
//    text-overflow: ellipsis;
//    white-space: wrap !important;
//  }
//
//}
//
//
//.empty_img {
//  background: #ADADAD;
//  height: 100%;
//  max-height: 250px;
//  width: 100%;
//}
//
//.tags_article_small_card {
//  display: grid;
//  position: relative;
//  border-radius: $b-r30 !important;
//  width: 340px;
//  max-height: 220px;
//  cursor: pointer;
//  transition: $transition;
//  &:hover {
//    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
//  }
//
//  .img_container {
//    position: relative;
//    display: inline-block;
//    overflow: hidden;
//    border-radius: $b-r30 !important;
//    .img {
//      height: auto;
//      max-height: 250px;
//      display: block;
//      width: 100%;
//      border-radius: $b-r30 !important;
//
//    }
//    &::before {
//      content: '';
//      position: absolute;
//      top: 0;
//      border-radius: $b-r30;
//      left: 0;
//      width: 100%;
//      height: 100%;
//      background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
//      z-index: 1;
//      pointer-events: none;
//    }
//  }
//  .article_name {
//    position: absolute;
//    left: 20px;
//    bottom: 20px;
//    @extend .white-small-header-page;
//    font-size: 1.5em !important;
//    z-index: 2;
//    display: -webkit-box;
//    -webkit-line-clamp: 2;
//    -webkit-box-orient: vertical;
//    overflow: hidden;
//    text-overflow: ellipsis;
//    white-space: wrap !important;
//  }
//
//}
</style>
