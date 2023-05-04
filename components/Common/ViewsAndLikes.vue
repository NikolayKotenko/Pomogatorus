<template>
  <div class="views_and_likes_wrapper">
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <div
          class="views_wrapper"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon color="#000000" size="26">
            mdi-eye-outline
          </v-icon>
          <span>121</span>
        </div>
      </template>
      <span>Кол-во просмотров</span>
    </v-tooltip>
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <div
          class="likes_wrapper"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="icons">
            mdi-thumb-up-outline
          </v-icon>
          <span>91</span>
        </div>
      </template>
      <span>Понравилось</span>
    </v-tooltip>
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <div
          class="likes_wrapper_wrapper"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon class="icons">
            mdi-thumb-down-outline
          </v-icon>
          <span>9</span>
        </div>
      </template>
      <span>Не понравилось</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'ViewsAndLikes'
}
</script>

<style lang="scss" scoped>
.views_and_likes_wrapper {
  display: grid;
  align-items: center;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 1em;

}
.views_wrapper, .likes_wrapper, .dislike_wrapper {
  align-items: center;
}
.icons {
  color: #000000 !important;
  &:hover{
    color: #F6C5A7 !important;
  }
  &:active{
    color: #F79256 !important;
  }
}

</style>
