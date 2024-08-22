<template>
  <div :class="{ views_and_likes_wrapper: !isBigArticle, is_big_article_style: isBigArticle}">

    <TooltipStyled :is-top="true" :title="'Понравилось'">
      <div
        class="wrapper"
        @click="setLikesDislikes(stateLike ? null : 1)"
        @submit.prevent="$store.dispatch('linkToArticle', article.id)"
      >
        <v-icon :class="{active: stateLike}" class="icons">
          mdi-thumb-up
        </v-icon>
        <span class="text">{{ getCountLike }}</span>
      </div>
    </TooltipStyled>

    <v-divider v-if="isBigArticle" vertical style="border-width: 1px; border-color: #DFDFDF !important;"/>

    <TooltipStyled :is-top="true" :title="'Не понравилось'">
      <div
        class="wrapper"
        @click="setLikesDislikes(stateDislike ? null : 0)"
      >
        <v-icon :class="{active: stateDislike}" class="icons">
          mdi-thumb-down
        </v-icon>
        <span class="text">{{ getCountDisLike }}</span>
      </div>
    </TooltipStyled>
    <DonatModal/>
  </div>
</template>

<script>
import DonatModal from '../Modals/DonatModal.vue'
import TooltipStyled from '@/components/Common/TooltipStyled';
import Request from '~/services/request';

export default {
  name: 'ViewsAndLikes',
  components: { DonatModal, TooltipStyled },
  props: {
    article: {
      type: Object,
      default: () => {
      }
    },
    viewAction: {
      type: Boolean,
      default: false
    },
    isBigArticle: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    localArticle: {},
    debounceTimeout: null,
    animationViews: false,
  }),
  computed: {
    getViews() {
      return this.computedArticle?.views ? this.computedArticle.views : 0;
    },
    getCountLike() {
      return this.computedArticle?.likes ? this.computedArticle.likes : 0;
    },
    getCountDisLike() {
      return this.computedArticle?.dislikes ? this.computedArticle.dislikes : 0;
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
      if (!this.computedArticle?.likes_dislikes) return null;

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
  },
  watch: {
    'viewAction': function(newVal, oldVal) {
      if (!newVal) return false;
      this.setViews();
    },

  },
  mounted() {
  },
  methods: {
    // localOpenDonatModal() {
    //   console.log('localOpenDonat')
    //   this.$store.state.ArticleModule.stateDonatModal = true
    // },
    async setLikesDislikes(likeOrDislikeOrNull) {
      // Если не авторизован выкидываем модалку авторизации
      if (!this.$store.getters.stateAuth) {
        await this.$store.dispatch('openAuthModal');
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
        await Request.post(this.$store.state.BASE_URL + '/m-to-m/users-likes', {
          id_user: this.$store.getters.getUserId,
          id_article: this.computedArticle.id,
          likes_or_dislikes: likeOrDislikeOrNull
        });

      }

      // Запрашиваем новые данные с бэка, чтобы обновить computedArticle
      const { data } = await Request.get(
        this.$store.state.BASE_URL + '/entity/articles/' + this.computedArticle.id
      );
      this.computedArticle = data;

      if (this.entryLikeDislikeByUser?.likes_or_dislikes === true) {
        await this.$store.dispatch('openDonatModal')
      }
    },
    async setViews() {
      if (!this.$store.getters.stateAuth) return false;

      this.runAnimationViews();
      const response = await Request.post(this.$store.state.BASE_URL + '/entity/views', {
        id_article: this.computedArticle.id
      });
      // Если существует запись, то обновляем
      if (response.codeResponse === 409) {
        await Request.put(
          this.$store.state.BASE_URL + `/entity/views/${response.data.id}`, {
            id_article: this.computedArticle.id
          });
      }

      // Запрашиваем новые данные с бэка, чтобы обновить computedArticle
      const { data } = await Request.get(
        this.$store.state.BASE_URL + '/entity/articles/' + this.computedArticle.id
      );
      this.computedArticle = data;
    },
    runAnimationViews(){
      this.animationViews = true;

      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.animationViews = false;
      }, 2000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';
.views_and_likes_wrapper {
  display: flex;
  align-items: center;
  grid-column-gap: 20px;
  .wrapper {
    display: flex;
    grid-column-gap: 5px;
    align-items: center;
    background-color: #DDDDDD;
    border-radius: 15px;
    padding: 10px 20px;
    cursor: pointer;
  }
}
.is_big_article_style {
  display: flex;
  align-items: center;
  grid-column-gap: 1em;
  background: rgba(119, 119, 119, .3);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  padding: 18px 22px;
  border-radius: 30px;
  transition: $transition;
  &:hover {
    box-shadow: $shadowBox;
  }
  .icons {
    color: #FFFFFF;
  }
  .text {
    color: #FFFFFF;
  }
}



.hover{
  color: #F6C5A7 !important;
}
body .icons {
  color: #000000;

  &:hover {
    @extend .hover;
  }

  &:active, &.active {
    color: #FF6347 !important;
  }
}

</style>
