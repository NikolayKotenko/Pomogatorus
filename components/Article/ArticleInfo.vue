<template>
  <div class="article_info_wrapper mainContentFont">
    <div class="article_info_wrapper__info">
      <div class="article_info_wrapper__info__left">
        <!--        <div class="article_info_wrapper__info__left__block"> -->
        <!--          <span class="article_info_wrapper__info__left__block__value date"> -->
        <!--            {{ article_data.created_at }} -->
        <!--          </span> -->
        <!--        </div> -->
        <!--        <div class='article_info_wrapper__info__left__block'> -->
        <!--          <div class='article_info_wrapper__info__left__block__title'> -->
        <!--            <v-icon class='article_info_wrapper__info__left__block__title__icon' size='22'> -->
        <!--              mdi-folder-open-outline -->
        <!--            </v-icon> -->
        <!--            <span> Категория: </span> -->
        <!--          </div> -->
        <!--          <span class='article_info_wrapper__info__left__block__value category'> Подбор </span> -->
        <!--        </div> -->
        <!--        <div v-if="tagsLength" class="article_info_wrapper__info__left__block"> -->
        <!--          <div class="article_info_wrapper__info__left__block__title"> -->
        <!--            <v-icon class="article_info_wrapper__info__left__block__title__icon" size="22"> -->
        <!--              mdi-tag-multiple-outline -->
        <!--            </v-icon> -->
        <!--            <span> Теги: </span> -->
        <!--          </div> -->
        <!--          <div class="article_info_wrapper__info__left__block__value tags"> -->
        <!--            <a v-for="(tag, index) in article_data._all_public_tags" :key="index" :href="'/podborki/' + tag.code"> -->
        <!--              {{ tag.name.trim() + (index === article_data._all_public_tags.length - 1 ? "" : ",") }} -->
        <!--            </a> -->
        <!--            </a> -->
        <!--          </div> -->
        <!--        </div> -->
      </div>
      <div class="article_info_wrapper__info__right">
        <v-btn-toggle v-model="articleView" color="deep-purple accent-3" dense @change="setView">
          <TooltipStyled :title="'Переключить на обычное отображение статьи'">
            <template>
              <v-btn
                large
                value="normal"
              >
                <v-icon>
                  mdi-text-box-search-outline
                </v-icon>
              </v-btn>
            </template>
          </TooltipStyled>

          <TooltipStyled :title="'Оставить только вопросы'">
            <template>
              <v-btn
                large
                value="flat"
              >
                <v-icon> mdi-form-select</v-icon>
              </v-btn>
            </template>
          </TooltipStyled>
        </v-btn-toggle>
      </div>
    </div>
    <v-img
      :src="$store.getters.getImageByEClientFilesObj(articleData.e_client_files)"
      class="article_img"
      cover
    />

    <div class="sticky_panel">
      <ViewsAndLikes :article="articleData" :view-action="viewAction"/>
      <div class="bookmarks_and_share">
        <TooltipStyled :is-top="true" :title="'Добавить в закладки'">
          <div
            class="btn_wrapper"
          >
            <v-icon color="#000000">
              mdi-bookmark-outline
            </v-icon>
            <span>В закладки</span>
          </div>
        </TooltipStyled>

        <div
          class="btn_wrapper"
          @click="openModal"
        >
          <v-icon color="#000000">
            mdi-export-variant
          </v-icon>
          <span>Поделиться</span>
        </div>
      </div>
    </div>

    <div v-if="articleData.preview" class="article_info_wrapper__anons">
      <span>
        {{ articleData.purpose_of_article }}
      </span>
    </div>
  </div>
</template>


<script>

import TooltipStyled from '../Common/TooltipStyled.vue';
import ViewsAndLikes from '../Common/ViewsAndLikes.vue'
import SocialShare from './SocialShare.vue'

export default {
  name: 'ArticleInfo',
  components: { SocialShare, ViewsAndLikes, TooltipStyled },
  props: {
    articleData: {
      type: Object,
      default: () => {}
    },
    viewAction: {
      type: Boolean,
      default: false
    },
  },
  data: () => ({
    articleView: 'normal'
  }),
  computed: {

    tagsLength() {
      if (!this.articleData._all_public_tags) return false;
      return !!this.articleData._all_public_tags.length;
    }
  },
  methods: {
    setView() {
      this.$emit('set-view', this.articleView);
    },
    openModal() {
      this.$store.dispatch('openShareArticleModal')
    },
  }
};
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 600px) {
  .article_info_wrapper__info {
    flex-direction: column !important;
    row-gap: 10px;

    &__left {
      &__block {
        align-items: flex-start !important;

        &__value {
          display: flex;
          flex-wrap: wrap;
        }
      }
    }
  }
}

.article_info_wrapper {
  color: black;
  display: grid;
  grid-row-gap: 20px;
  &__info {
    display: flex;
    justify-content: space-between;
    font-size: 14px;

    &__left {
      display: flex;
      flex-direction: column;
      row-gap: 6px;

      &__block {
        display: flex;
        column-gap: 6px;
        align-items: center;

        &__title {
          display: flex;
          align-items: center;
          column-gap: 4px;

          &__icon {
            padding-top: 2px;
          }
        }
      }
    }

    &__right {
    }
  }
  .article_img {
    border-radius: 30px;
    background-color: #FFFFFF;
    max-height: 430px;
  }

  .sticky_panel {
    background-color: #FFFFFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-radius: 30px;
    position: sticky;
    top: 80px;
    z-index: 1;
    bottom: 0;
    .bookmarks_and_share {
      display: flex;
      grid-column-gap: 20px;
      .btn_wrapper {
        display: flex;
        grid-column-gap: 5px;
        align-items: center;
        background-color: #DDDDDD;
        border-radius: 15px;
        padding: 10px 20px;
        cursor: pointer;
        font-weight: 600;
      }
    }
  }

  &__anons {
    border-radius: 15px;
    background-color: #FFFFFF;
    padding: 20px;
    margin-bottom: 20px;
  }
}

.category {
  text-decoration: underline;
  color: #e95420;
}

.tags {
  color: #e95420;
}
</style>
