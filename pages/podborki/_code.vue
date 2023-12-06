<template>
  <v-container class="podborki_detail">
    <span
      v-if="mainTag.description"
      class="description"
      v-html="mainTag.description"
    />
    <div class="content_wrapper">
      <div
        v-if="$store.state.PopularSelectionsModule.questions.length"
        class="left_column"
      >
        <span class="title">
          Вопросы по тегу:
          <HashTagStyled
            :text="mainTag.name"
          />
        </span>
        <Question
          v-for="(question, index) in $store.state.PopularSelectionsModule.questions"
          :key="index"
          :props-data="question"
          :props-index="index + 1"
          class="question_card"
          @answer="setAnswer"
        />
      </div>
      <v-divider
        v-if="$store.state.PopularSelectionsModule.article.length"
        vertical
      />
      <div v-if="$store.state.PopularSelectionsModule.article.length" class="right_column">
        <span class="title">
          Ещё статьи по тегу
        </span>
        <ArticleSmallCard
          v-for="(article, index) in $store.state.PopularSelectionsModule.article"
          :key="index"
          :article="article"
          class="small_card"
        />
      </div>
    </div>
    <Biathlon
      v-if="! $store.state.ArticleModule.refactoring_content"
      :questions="$store.state.PopularSelectionsModule.questions"
      is-collection
      :view-action="localViewAction"
    />
    <v-overlay z-index="10" :value="$store.state.ArticleModule.refactoring_content">
      <v-progress-circular :size="50" color="primary" indeterminate style="margin-top: 20px"/>
    </v-overlay>
  </v-container>
</template>

<script>
import Question from '../../components/frontLayouts/Question';
import Request from '../../services/request';
import ArticleSmallCard from '../../components/Article/ArticleSmallCard.vue';
import Biathlon from '../../components/Common/Biathlon.vue';
import article from '../../store/modules/article';
import podborki from './index.vue';
import HashTagStyled from '~/components/Common/HashTagStyled';

export default {
  name: '_code.vue',
  components: {
    Biathlon,
    ArticleSmallCard,
    Question,
    HashTagStyled
  },
  async asyncData({ store, params }) {
    try {
      const request = await Request.get(`${store.state.BASE_URL}/dictionary/tags-by-code/${params.code}`, '', true)
      const mainTag = request.data
      return { mainTag }
    } catch (error) {
      console.warn(error.response.data.message)
    }
  },
  data: () => ({
    params_of_component: {
      name: ''
    },
    data_of_components: [],
    computedQuestions: [],
    coordYNav: null,
    heightNav: 70,
    localViewAction: false
  }),
  head() {
    return {
      title: `${this.mainTag?.seo_title}`,
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: `${this.mainTag?.seo_keywords}`
        },
        {
          hid: 'description',
          name: 'description',
          content: `${this.mainTag?.seo_description}`
        },
        {
          hid: 'theme-color',
          name: 'theme-color',
          content: 'blue'
        }
      ]
    }
  },
  computed: {
    podborki() {
      return podborki
    },
    article() {
      return article
    }
  },
  watch: {},
  created() {
  },
  async mounted() {
    this.$route.meta.title = this.mainTag?.name;
    await this.$store.dispatch('PopularSelectionsModule/getArticlesInfo', this.$route.params.code);
    await this.$store.dispatch('PopularSelectionsModule/getQuestionsInfo', this.$route.params.code);
    this.findQuestions();
  },

  methods: {
    findQuestions() {
      if (!this.data_of_components.length) {
        return;
      }
      this.computedQuestions = this.data_of_components.filter(elem => {
        return elem.data.component.name === 'questions';
      });

    },
    setAnswer(data) {
      this.$store.commit('PopularSelectionsModule/setAnswer', {
        answer: data.answer, id: data.id
      })

    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/lists';

.title {
  font-size: 1.5em !important;
  font-weight: 700;
}

.podborki_detail {
  display: grid;
  row-gap: 20px;
  .description {
    background-color: #FFFFFF;
    border-radius: 5px;
    padding: 1em;
  }
  .content_wrapper {
    display: flex;
    grid-column-gap: 20px;
    @media screen and (max-width: 768px) {
      grid-template-columns: 1fr;
    }

    .left_column {
      display: grid;
      grid-row-gap: 20px;
      width: 100%;
      .question_card {
        //min-height: ;
      }
    }

    .right_column {
      display: grid;
      grid-row-gap: 20px;
    }

  }

  //.auth_container {
  //  margin-right: auto !important;
  //  margin: unset;
  //}
}
@media only screen and (max-width: 768px){
  .text_tag_article {
    padding-left: 8px;
  }
  .more_article {
    display: grid;
    justify-content: center;
  }
}
</style>
