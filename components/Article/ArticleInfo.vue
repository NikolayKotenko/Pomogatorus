<template>
  <div class="article_info_wrapper mainContentFont">
    <div class="article_info_wrapper__info">
      <div class="article_info_wrapper__info__left">
        <div class="article_info_wrapper__info__left__block">
          <div class="article_info_wrapper__info__left__block__title">
            <v-icon size="22" class="article_info_wrapper__info__left__block__title__icon">
              mdi-calendar-month-outline
            </v-icon>
            <span>
              Опубликовано:
            </span>
          </div>
          <span class="article_info_wrapper__info__left__block__value date">
            {{ article_data.created_at }}
          </span>
        </div>
        <div class="article_info_wrapper__info__left__block">
          <div class="article_info_wrapper__info__left__block__title">
            <v-icon size="22" class="article_info_wrapper__info__left__block__title__icon">
              mdi-folder-open-outline
            </v-icon>
            <span>
              Категория:
            </span>
          </div>
          <span class="article_info_wrapper__info__left__block__value category">
            Подбор
          </span>
        </div>
        <div class="article_info_wrapper__info__left__block" v-if="article_data._all_tags.length">
          <div class="article_info_wrapper__info__left__block__title">
            <v-icon size="22" class="article_info_wrapper__info__left__block__title__icon">
              mdi-tag-multiple-outline
            </v-icon>
            <span>
              Теги:
            </span>
          </div>
          <div class="article_info_wrapper__info__left__block__value tags">
            <span
              v-for="(tag, index) in article_data._all_tags"
              :key="index"
            >
              {{ tag.name.trim() + (index === article_data._all_tags.length-1 ? '' : ',') }}
            </span>
          </div>
        </div>
        <div class="article_info_wrapper__info__left__block">
          <div class="article_info_wrapper__info__left__block__title">
            <v-icon size="22" class="article_info_wrapper__info__left__block__title__icon">
              mdi-eye-outline
            </v-icon>
            <span>
              Прочитали:
            </span>
          </div>
          <span class="article_info_wrapper__info__left__block__value counters">
            722 человек
          </span>
        </div>
      </div>
      <div class="article_info_wrapper__info__right">
        <v-btn-toggle
          color="deep-purple accent-3"
          v-model="articleView"
          dense
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                value="normal"
                v-bind="attrs"
                v-on="on"
                large
              >
                <v-icon>
                  mdi-text-box-search-outline
                </v-icon>
              </v-btn>
            </template>
            <span>Переключить на обычное отображение статьи</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                value="flat"
                v-bind="attrs"
                v-on="on"
                large
              >
                <v-icon>
                  mdi-form-select
                </v-icon>
              </v-btn>
            </template>
            <span>Оставить только вопросы</span>
          </v-tooltip>
        </v-btn-toggle>
      </div>
    </div>
    <div class="article_info_wrapper__anons" v-if="article_data.preview">
      <span>
        {{ article_data.preview }}
      </span>
    </div>
    <hr class="article_info_wrapper__divider">
  </div>
</template>

<script>
export default {
  name: "ArticleInfo",
  props: ['article_data'],
  data: () => ({
    articleView: 'normal',
  }),
}
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
    border-left: solid 5px #e95320;
    background-color: lightgoldenrodyellow;
    padding: 10px 10px 10px 10px;
    margin: 15px 0 15px 0;
  }

  &__divider {
    width: 75%;
    margin: 30px auto;
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
