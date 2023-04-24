<template>
  <div class="article_info_wrapper mainContentFont">
    <div class="article_info_wrapper__info">
      <div class="article_info_wrapper__info__left">
        <div class="article_info_wrapper__info__left__block">
          <span class="article_info_wrapper__info__left__block__value date">
            {{ article_data.created_at }}
          </span>
        </div>
        <!--        <div class='article_info_wrapper__info__left__block'> -->
        <!--          <div class='article_info_wrapper__info__left__block__title'> -->
        <!--            <v-icon class='article_info_wrapper__info__left__block__title__icon' size='22'> -->
        <!--              mdi-folder-open-outline -->
        <!--            </v-icon> -->
        <!--            <span> Категория: </span> -->
        <!--          </div> -->
        <!--          <span class='article_info_wrapper__info__left__block__value category'> Подбор </span> -->
        <!--        </div> -->
        <div v-if="tagsLength" class="article_info_wrapper__info__left__block">
          <div class="article_info_wrapper__info__left__block__title">
            <VIcon class="article_info_wrapper__info__left__block__title__icon" size="22">
              mdi-tag-multiple-outline
            </VIcon>
            <span> Теги: </span>
          </div>
          <div class="article_info_wrapper__info__left__block__value tags">
            <a v-for="(tag, index) in article_data._all_public_tags" :key="index" :href="'/podborki/' + tag.code">
              {{ tag.name.trim() + (index === article_data._all_public_tags.length - 1 ? '' : ',') }}
            </a>
          </div>
        </div>
        <!--                <div class='article_info_wrapper__info__left__block'> -->
        <!--                  <div class='article_info_wrapper__info__left__block__title'> -->
        <!--                    <v-icon class='article_info_wrapper__info__left__block__title__icon' size='22'> mdi-eye-outline</v-icon> -->
        <!--                    <span> Прочитали: </span> -->
        <!--                  </div> -->
        <!--                  <span class='article_info_wrapper__info__left__block__value counters'> 722 человек </span> -->
        <!--                </div> -->
      </div>
      <!--      <div class='article_info_wrapper__info__right'> -->
      <!--        <v-btn-toggle v-model='articleView' color='deep-purple accent-3' dense @change='setView'> -->
      <!--          <v-tooltip bottom> -->
      <!--            <template v-slot:activator='{ on, attrs }'> -->
      <!--              <v-btn -->
      <!--                large -->
      <!--                v-bind='attrs' -->
      <!--                value='normal' -->
      <!--                v-on='on' -->
      <!--              > -->
      <!--                <v-icon> -->
      <!--                  mdi-text-box-search-outline -->
      <!--                </v-icon> -->
      <!--              </v-btn> -->
      <!--            </template> -->
      <!--            <span>Переключить на обычное отображение статьи</span> -->
      <!--          </v-tooltip> -->
      <!--          <v-tooltip bottom> -->
      <!--          </v-tooltip> -->
      <!--          <v-tooltip bottom> -->
      <!--            <template v-slot:activator='{ on, attrs }'> -->
      <!--              <v-btn large v-bind='attrs' value='flat' v-on='on'> -->
      <!--                <v-icon> mdi-form-select</v-icon> -->
      <!--              </v-btn> -->
      <!--            </template> -->
      <!--            <span>Оставить только вопросы</span> -->
      <!--          </v-tooltip> -->
      <!--        </v-btn-toggle> -->
      <!--      </div> -->
    </div>
    <VImg
      :src="$store.getters.getImageByEClientFilesObj(article_data.e_client_files)"
      class="mt-5"
      contain
      max-width="815"
    />
    <div v-if="article_data.preview" class="article_info_wrapper__anons">
      <span>
        {{ article_data.preview }}
      </span>
    </div>
    <hr class="article_info_wrapper__divider">
  </div>
</template>

<script>
export default {
  name: 'ArticleInfo',
  props: ['article_data'],
  data: () => ({
    articleView: 'normal'
  }),
  computed: {
    tagsLength() {
      if (!this.article_data._all_public_tags) return false
      return !!this.article_data._all_public_tags.length
    }
  },
  methods: {
    setView() {
      this.$emit('set-view', this.articleView)
    }
  }
}
</script>

<style lang='scss' scoped>
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
  max-width: 815px;

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

  &__anons {
    border-radius: 5px;
    background-color: #E3E3E3;
    padding: 20px;
    margin: 15px 0 15px 0;
    max-width: 815px;
  }

  &__divider {
    max-width: 270px;
    margin: 2em auto 2em auto;
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
