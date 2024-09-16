<template>
  <div class="article-description-widget">
    <div class="article-description-widget__links">
      <div class="article-description-widget__links__header">
        <div class="article-description-widget__links__header__red"/>

        <div
          class="article-description-widget__links__header__title"
          @click="scrollToHeaderArticle"
        >
          <div class="text">
            {{ articleData.name }}
          </div>
        </div>
      </div>

      <div class="article-description-widget__links__content">
        <div
          v-for="(link, lIndex) in arrayTitlesArticle"
          :key="'article-' + lIndex"
          class="article-description-widget__links__content__elem"
          @click="scrollIntoArticle(lIndex)"
        >
          <div class="article-description-widget__links__content__elem__title">
            {{ link.name }}
          </div>
        </div>
        <div
          class="article-description-widget__links__content__elem"
          @click="scrollToCurrentObj"
        >
          <img :src="require('/assets/svg/icons/home_icon.svg')">
          Текущий объект
        </div>
        <div
          class="article-description-widget__links__content__elem"
          @click="scrollToCurrentObj"
        >
          <img :src="require('/assets/svg/icons/thump_up_poof.svg')">
          Рекомендации от Помогайкина
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { req } from 'vuelidate/lib/validators/common';

export default {
  name: 'ArticleAnchors',
  props: {
    arrayTitlesArticle: {
      type: Array,
      required: true
    },
    articleData: {
      type: Object,
      default: () => {
      }
    }
  },
  methods: {
    req,
    scrollIntoArticle(index) {
      this.$emit('scrollInto', index)
    },
    scrollToCurrentObj() {
      this.$emit('scroll-to-object')
    },
    scrollToHeaderArticle() {
      this.$emit('scroll-to-header')
    }
  }
}
</script>

<style lang='scss' scoped>
.article-description-widget {
  font-size: 0.75em;
  &__links {
    display: flex;
    flex-direction: column;
    align-items: center;



    &__header {
      width: 100%;
      display: flex;
      height: 40px;
      background: white;
      box-shadow: 0px 4px 4px 0px #00000040;
      border-radius: 0px 8px 8px 0px;
      z-index: 1;

      &__red {
        border: 4px solid #FF6347;
      }

      &__title {
        flex: 1;
        padding: 10px 30px 10px 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: all 0.4s ease-in-out;
        .text {
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          max-height: 30px;
          line-height: 1.25;
        }
        &:hover {
          background: darken(white, 10%);
        }
      }
    }

    &__content {
      width: 270px;
      border-radius: 0 0 15px 15px;
      background: white;

      &__elem {
        padding: 10px 30px 10px 20px;
        border-bottom: 1px solid #DDDDDD;
        cursor: pointer;
        transition: all 0.4s ease-in-out;
        display: flex;
        column-gap: 6px;

        &:last-child {
          border-bottom: unset;
          border-radius: 0 0 15px 15px;
        }

        &:hover {
          background: darken(white, 10%);
        }

        &__title {
          text-overflow: ellipsis;
          overflow: hidden;
          width: 220px;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
