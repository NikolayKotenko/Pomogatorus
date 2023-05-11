<template>
  <div class="views_and_likes_wrapper">
    <TooltipStyled :is-top="true" :title="'Кол-во просмотров'">
      <div class="views_wrapper">
        <v-icon>mdi-eye-outline</v-icon>
        <span>121</span>
      </div>
    </TooltipStyled>

    <TooltipStyled :is-top="true" :title="'Понравилось'">
      <div class="likes_wrapper_wrapper"
           @click="setLikesDislikes(stateLike ? null : 1)"
      >
        <v-icon :class="{active: stateLike}" class="icons">mdi-thumb-up-outline</v-icon>
        <span>{{ getCountLike }}</span>
      </div>
    </TooltipStyled>

    <TooltipStyled :is-top="true" :title="'Не понравилось'">
      <div
        class="likes_wrapper_wrapper"
        @click="setLikesDislikes(stateDislike ? null : 0)"
      >
        <v-icon :class="{active: stateDislike}" class="icons">mdi-thumb-down-outline</v-icon>
        <span>{{ getCountDisLike }}</span>
      </div>
    </TooltipStyled>
  </div>
</template>

<script>
import TooltipStyled from "@/components/Common/TooltipStyled";
import Request from "~/services/request";

export default {
  name: "ViewsAndLikes",
  components: { TooltipStyled },
  props: {
    article: {
      type: Object,
      default: () => {
      }
    }
  },
  data: () => ({
    localArticle: {}
  }),
  mounted() {
  },
  methods: {
    async setLikesDislikes(likeOrDislikeOrNull) {
      //Если не авторизован выкидываем модалку авторизации
      if (!this.$store.getters.stateAuth) {
        this.$store.state.listModal[0].isOpen = true;
        return false;
      }

      // Если существует запись, то обновляем
      if (this.entryLikeDislikeByUser) {
        await Request.put(
          this.$store.state.BASE_URL + `/m-to-m/users-likes/${this.entryLikeDislikeByUser.id}`, {
            id_user: this.$store.getters.getUserId,
            id_article: this.computedArticle.id,
            likes_or_dislikes: likeOrDislikeOrNull
          });
      }
      // Если запись НЕ существует, то создаем новую запись
      else {
        await Request.post(this.$store.state.BASE_URL + "/m-to-m/users-likes", {
          id_user: this.$store.getters.getUserId,
          id_article: this.computedArticle.id,
          likes_or_dislikes: likeOrDislikeOrNull
        });
      }

      // Запрашиваем новые данные с бэка, чтобы обновить computedArticle
      const { data } = await Request.get(
        this.$store.state.BASE_URL + "/entity/articles/" + this.computedArticle.id
      );
      this.computedArticle = data;
    }
  },
  computed: {
    getCountLike() {
      if (!this.computedArticle) return 0;
      return (this.computedArticle.hasOwnProperty("likes")) ? this.computedArticle.likes : 0;
    },
    getCountDisLike() {
      if (!this.computedArticle) return 0;
      return (this.computedArticle.hasOwnProperty("dislikes")) ? this.computedArticle.dislikes : 0;
    },
    stateLike() {
      if (!this.entryLikeDislikeByUser) return false;
      return this.entryLikeDislikeByUser.likes_or_dislikes === true;
    },
    stateDislike() {
      if (!this.entryLikeDislikeByUser) return false;
      return this.entryLikeDislikeByUser.likes_or_dislikes === false;
    },
    entryLikeDislikeByUser() {
      if (!this.computedArticle) return null;
      if (!this.computedArticle.hasOwnProperty("likes_dislikes")) return null;

      const entry = this.computedArticle.likes_dislikes.filter((obj) => obj.id_user === this.$store.getters.getUserId);
      return (entry) ? entry[0] : null;
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
  }
};
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

  &:hover {
    color: #F6C5A7 !important;
  }

  &:active, &.active {
    color: #F79256 !important;
  }
}

</style>
