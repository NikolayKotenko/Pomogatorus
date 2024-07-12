<template>
  <div class="article-description-widget">
    <div class="article-description-widget__links">
      <div class="article-description-widget__links__header">
        <div class="article-description-widget__links__header__red"/>

        <div class="article-description-widget__links__header__title">
          Описание
        </div>
      </div>

      <div class="article-description-widget__links__content">
        <div
          v-for="(link, lIndex) in dataArticles"
          :key="'article-' + lIndex"
          class="article-description-widget__links__content__elem"
          @click="scrollIntoArticle(lIndex)"
        >
          <div class="article-description-widget__links__content__elem__title">
            {{ link.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleAnchors',
  props: {
    dataArticles: {
      type: Array,
      required: true
    }
  },
  methods: {
    scrollIntoArticle(index) {
      this.$emit('scrollInto', index)
    }
  }
}
</script>

<style lang='scss' scoped>
.article-description-widget {

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
        padding-left: 34px;
        display: flex;
        align-items: center;
      }
    }

    &__content {
      width: 276px;
      border-radius: 0 0 15px 15px;
      background: white;

      &__elem {
        padding: 10px 30px 10px 20px;
        border-bottom: 1px solid #DDDDDD;
        cursor: pointer;
        transition: all 0.4s ease-in-out;

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
