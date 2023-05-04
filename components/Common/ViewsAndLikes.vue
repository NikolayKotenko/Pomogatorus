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
           @click="setLikesDislikes(stateLike ? null : true)"
      >
        <v-icon :class="{active: stateLike}" class="icons">mdi-thumb-up-outline</v-icon>
        <span>{{ getCountLike }}</span>
      </div>
    </TooltipStyled>

    <TooltipStyled :is-top="true" :title="'Не понравилось'">
      <div
        class="likes_wrapper_wrapper"
        @click="setLikesDislikes(stateDislike ? null : false)"
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
  mounted() {
  },
  methods: {
    async setLikesDislikes(likeOrDislikeOrNull) {
      if (!this.$store.getters.stateAuth) {
        this.$store.state.listModal[0].isOpen = true;
        return false;
      }

      const response = await Request.post(this.$store.state.BASE_URL + "/m-to-m/users-likes", {
        id_user: this.$store.getters.getUserId,
        id_article: this.article.id,
        likes_or_dislikes: likeOrDislikeOrNull
      });

      if (response.codeResponse === 409) {
        const responseUpdate = await Request.put(
          this.$store.state.BASE_URL + `/m-to-m/users-likes/${response.data[0].id}`, {
            id_user: this.$store.getters.getUserId,
            id_article: this.article.id,
            likes_or_dislikes: likeOrDislikeOrNull
          });
      }

      console.log("check1");
      this.$emit("update-likes");
    }
  },
  computed: {
    getCountLike(){
      return (this.article.hasOwnProperty('likes')) ? this.article.likes : 0;
    },
    getCountDisLike(){
      return (this.article.hasOwnProperty('dislikes')) ? this.article.dislikes : 0;
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
      if (!this.article) return null;
      if (!this.article.hasOwnProperty("likes_dislikes")) return null;

      const entry = this.article.likes_dislikes.filter((obj) => obj.id_user === this.$store.getters.getUserId);
      return (entry) ? entry[0] : null;
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
