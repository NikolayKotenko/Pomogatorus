<template>
  <v-card
    class="article_card img-activator"
    elevation="0"
    @click="$store.dispatch('linkToArticle', article.id)"
  >
    <div class="list_elem_wrapper">
      <div class="list_elem_wrapper__img_container img-container">
        <v-img
          :src="$store.getters.getImageByEClientFilesObj(article.e_client_files)"
          alt=""
          class="list_elem_wrapper__img_container__img img-hover"
          cover
          height="100%"
        />
        <div @click="$event.stopPropagation()">
          <ViewsAndLikes class="article_likes" :is-big-article="true" :article="article"/>
        </div>
      </div>
      <div class="footer_wrapper">
        <div class="article_name">
          {{ article.name }}
        </div>
        <div class="article_info">
          <div class="date">
            {{ article.created_at }}
          </div>
          <TooltipStyled :is-top="true" :title="'Кол-во просмотров'">
            <div
              class="views"
            >
              <v-icon class="icons">
                mdi-eye
              </v-icon>
              <span class="text">{{ getViews }}</span>
            </div>
          </TooltipStyled>
        </div>
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
    previewAuthor: true,
    localArticle: {}
  }),

  computed: {
    getViews() {
      return this.computedArticle?.views ? this.computedArticle.views : 0;
    },
    computedArticle: {
      get() {
        if (Object.keys(this.localArticle).length) {
          return this.localArticle;
        }
        return this.article;
      },
      set(value) {
        this.localArticle = value;
      }
    }
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.article_card {
  max-width: 850px;
  border-radius: 30px;
}
.list_elem_wrapper {
  display: grid;
  grid-row-gap: 20px;
  width: auto;
  max-width: 850px;
  height: auto;
  min-height: 440px;
  align-content: baseline;
  font-family: 'Inter', sans-serif;

  .footer_wrapper {
    padding: 0 20px 20px 20px;
    display: grid;
    row-gap: 20px;
    .article_name {
      font-size: 1.9em;
      font-weight: 600;
      white-space: nowrap; /* Запрет на перенос текста на новую строку */
      overflow: hidden; /* Обрезание текста, выходящего за границы контейнера */
      text-overflow: ellipsis;
    }
    .article_info {
      font-size: 0.9em;
      color: #898989;
      text-transform: uppercase;
      display: flex;
      grid-column-gap: 20px;
      align-items: center;
    }
  }

  &__title {
    font-size: 1.5em;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__img_container {
    height: 320px;
    width: auto;
    display: flex;
    align-content: center;
    justify-content: center;
    align-items: center;
    position: relative;
    max-height: 325px;
    //max-width: 510px;
    background: #ADADAD;

    &__img {
      width: 100%;
      height: 100%;
      margin: 0 auto;
      object-fit: cover;
      -o-object-fit: cover;
      position: relative;
    }
    .article_likes {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }

  &__short_info {
    padding: 1em;
    border-radius: 5px;
    background: #F2F2F2;
    height: 82px;
    font-size: 0.9em;
    font-weight: 400;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;

    &__time {
      font-size: 1em;
      font-weight: 400;
    }
  }
}
</style>
