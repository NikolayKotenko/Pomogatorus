<template>
  <div class="article_info_wrapper">
    <div class="article_info_wrapper__left">
      <div class="article_info_wrapper__left__block date">
        <span>
          Опубликовано: 22 августа 2022
        </span>
      </div>
      <div class="article_info_wrapper__left__block category">
        <span>
          Категория:
        </span>
        <span>
          Подбор
        </span>
      </div>
      <div class="article_info_wrapper__left__block tags">
        <span>
          Теги:
        </span>
        <span>
          Котел
        </span>
      </div>
      <div class="article_info_wrapper__left__block counters">
        <span>
          Прочитали 722 человек
        </span>
      </div>
    </div>
    <div class="article_info_wrapper__right">
      <v-btn-toggle
        tile
        color="deep-purple accent-3"
        group
        v-model="articleView"
      >
        <v-btn value="normal">

        </v-btn>
        <v-btn value="flat">

        </v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticleInfo",
  data: () => ({
    articleView: null,
  }),
}
</script>

<style lang="scss" scoped>

</style>
