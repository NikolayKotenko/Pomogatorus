<template>
  <!--  <div class="biathlon_wrapper"> -->
  <!--    <v-container class="biathlon_container"> -->
  <!--      <v-footer -->
  <!--        class="biathlon_footer" -->
  <!--        padless -->
  <!--      > -->
  <!--        &lt;!&ndash; Mobile &ndash;&gt; -->
  <!--        <template v-if="isMobile"> -->
  <!--          <div class="biathlon"> -->
  <!--            <v-sheet class="biathlon_sheet"> -->
  <!--              <v-slide-group -->
  <!--                multiple -->
  <!--                show-arrows -->
  <!--              > -->
  <!--                <v-slide-item -->
  <!--                  v-for="(item, index) in getSortedQuestions" -->
  <!--                  :key="index" -->
  <!--                > -->
  <!--                  <TooltipStyled -->
  <!--                    :answer="getAnswer(item)" -->
  <!--                    :nudge-top="-10" -->
  <!--                    :off-hiding="isScrolling" -->
  <!--                    :title="getQuestionTitle(item)" -->
  <!--                    is-answer -->
  <!--                    is-top -->
  <!--                  > -->
  <!--                    <template> -->
  <!--                      <v-radio-group :value="getAnswer(item)" readonly success> -->
  <!--                        <v-radio :ripple="false" :value="getAnswer(item)" readonly @click="scrollToQuestion(item)"/> -->
  <!--                      </v-radio-group> -->
  <!--                    </template> -->
  <!--                  </TooltipStyled> -->
  <!--                </v-slide-item> -->
  <!--              </v-slide-group> -->
  <!--            </v-sheet> -->
  <!--          </div> -->
  <!--          <div class="likes_and_share"> -->
  <!--            <div class="likes_buttons"> -->
  <!--              <ViewsAndLikes :article="article" :view-action="viewAction"/> -->
  <!--            </div> -->
  <!--            <div class="share_buttons"> -->
  <!--              <CopyLinkButton/> -->
  <!--              <SocialShare/> -->
  <!--            </div> -->
  <!--          </div> -->
  <!--        </template> -->

  <!--        &lt;!&ndash; Desktop &ndash;&gt; -->
  <!--        <template v-else> -->
  <!--          <div class="likes_buttons"> -->
  <!--            <ViewsAndLikes :article="article" :view-action="viewAction"/> -->
  <!--          </div> -->
  <!--          <div class="biathlon"> -->
  <!--            <v-sheet class="biathlon_sheet"> -->
  <!--              <v-slide-group -->
  <!--                multiple -->
  <!--                show-arrows -->
  <!--              > -->
  <!--                <v-slide-item -->
  <!--                  v-for="(item, index) in getSortedQuestions" -->
  <!--                  :key="index" -->
  <!--                > -->
  <!--                  <TooltipStyled -->
  <!--                    :answer="getAnswer(item)" -->
  <!--                    :nudge-top="-10" -->
  <!--                    :off-hiding="isScrolling" -->
  <!--                    :title="getQuestionTitle(item)" -->
  <!--                    is-answer -->
  <!--                    is-top -->
  <!--                  > -->
  <!--                    <template> -->
  <!--                      <v-radio-group :value="getAnswer(item)" readonly success> -->
  <!--                        <v-radio -->
  <!--                          class="biathlon_radio_style" -->
  <!--                          :ripple="false" -->
  <!--                          :value="getAnswer(item)" -->
  <!--                          readonly -->
  <!--                          @click="scrollToQuestion(item)" -->
  <!--                        /> -->
  <!--                      </v-radio-group> -->
  <!--                    </template> -->
  <!--                  </TooltipStyled> -->
  <!--                </v-slide-item> -->
  <!--              </v-slide-group> -->
  <!--            </v-sheet> -->
  <!--          </div> -->
  <!--          <div class="share_buttons"> -->
  <!--            <CopyLinkButton/> -->
  <!--            <SocialShare/> -->
  <!--          </div> -->
  <!--        </template> -->
  <!--      </v-footer> -->
  <!--    </v-container> -->
  <!--  </div> -->

  <v-container class="biathlon_wrapper">
    <div class="header">
      Вопросы
    </div>
    <v-divider style="border-color: #DDDDDD;"/>
    <div
      v-for="(question, index) in getSortedQuestions"
      :key="index"
      class="questions_wrapper"
      @click="scrollToQuestion(question)"
    >
      <div class="question">
        <v-simple-checkbox
          :value="getStateAnswer(question)"
          on-icon="mdi-check-circle"
          off-icon="mdi-circle-outline"
          color="#FF6347"
        />
        <div class="question_title">
          {{ getQuestionTitle(question) }}
        </div>
      </div>
      <v-divider
        v-if="index !== getSortedQuestions.length - 1"
        style="border-color: #DDDDDD;"
      />
    </div>
  </v-container>
</template>

<script>
import SocialShare from '../Article/SocialShare.vue';
import ViewsAndLikes from './ViewsAndLikes.vue';
import CopyLinkButton from './CopyLinkButton.vue';
import TooltipStyled from './TooltipStyled';

export default {
  name: 'Biathlon',
  components: { TooltipStyled, CopyLinkButton, SocialShare, ViewsAndLikes },
  props: {
    questions: {
      type: Array,
      required: true
    },
    article: {
      type: Object,
      default: () => {
      }
    },
    viewAction: {
      type: Boolean,
      default: false
    },
    isCollection: {
      type: Boolean,
      default: false
    },
    answer: {
      type: [String, Number, Array, Object],
      default: null
    }
  },
  data: () => ({
    isScrolling: false
  }),
  computed: {


    getSortedQuestions() {
      if (this.isCollection) {
        return this.questions;
      }

      return this.questions.slice().sort((a, b) => {
        if (a.instance.$data.index_questions < b.instance.$data.index_questions) {
          return -1;
        } else if (b.instance.$data.index_questions > a.instance.$data.index_questions) {
          return 1;
        }
        return 0;
      });
    },
    isMobile() {
      return this.$device.isMobile;
    }
  },
  methods: {


    getAnswer(item) {
      if (this.isCollection) {
        if (item?.answer) {
          return item?.answer;
        }
      }

      if (item?.instance?.answer) {
        // Проверка на ответ в слайдере (диапозоне чисел)
        if (Array.isArray(item?.instance?.answer)) {
          if (parseInt(item?.instance?.min) !== parseInt(item?.instance?.answer[0]) || parseInt(item?.instance?.max) !== parseInt(item?.instance?.answer[1])) {
            return `от: ${parseInt(item?.instance?.answer[0])} до: ${parseInt(item?.instance?.answer[1])}`;
          }
        } else {
          return item?.instance?.answer;
        }
      }
    },
    scrollToQuestion(item) {
      if (this.isCollection) {
        return this.getSortedQuestions;
      }
      const elem = document.getElementById(`component_wrapper-${item?.data?.index}`);
      const heightNav = 70;

      if (elem) {
        this.isScrolling = true;

        // Фича для того, чтобы дождаться скролла и давать возможность скрывать тултип после скролла
        const checkScrollEnd = (entries, observer) => {
          entries.forEach(entry => {
            if (entry.target === elem && entry.intersectionRatio >= 0.90) {

            }
          });
        };

        const observer = new IntersectionObserver(checkScrollEnd, {
          root: null,
          rootMargin: '0px',
          threshold: 0.90
        });

        observer.observe(elem);

        const top = window.scrollY + elem.getBoundingClientRect().top - heightNav;
        window.scrollTo({ top, left: 0, behavior: 'smooth' });
      }
    },
    getQuestionTooltip(item) {
      if (this.isCollection) {
        return `Вы не заполнили вопрос номер ${item.name ? item.name : ''}, ${item.name}`;
      }
      if (item?.instance?.question_data?.name) {
        return `Вы не заполнили вопрос номер ${item?.instance?.index_questions ? item?.instance?.index_questions : ''}, ${item.instance.question_data.name}`;
      }

      return '';

    },
    getQuestionTitle(item) {
      if (this.isCollection) {
        return item.name
      }
      if (item?.instance?.question_data?.name) {
        return item?.instance?.index_questions ? item.instance.question_data.name : ''
      }

      return '';
    },
    getStateAnswer(item) {
      return !!(item?.instance?.answer || item?.instance?.detailed_response)
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

//.biathlon_wrapper {
//  position: fixed;
//  z-index: 9;
//  width: 100vw;
//  left: 0;
//  bottom: 0;
//  background-color: $background-element-color;
//  height: 80px;
//  display: flex;
//  justify-content: center;
//  align-items: center;
//  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.25);
//  @media only screen and (max-width: 800px) {
//    height: 120px;
//  }
//
//  .biathlon_container {
//    display: flex;
//    justify-content: center;
//  }
//
//  .biathlon_footer {
//    display: inline-flex;
//    grid-column-gap: 50px;
//    background-color: unset;
//    justify-content: space-between;
//    width: 1116px;
//    @media only screen and (max-width: 767px) {
//      display: grid;
//      justify-content: center;
//    }
//  }
//
//  .likes_and_share {
//    display: flex;
//    justify-content: center;
//    grid-column-gap: 50px;
//    padding-bottom: 10px;
//  }
//
//  .likes_buttons {
//    display: flex;
//  }
//
//  .share_buttons {
//    display: flex;
//    text-align: right;
//  }
//
//  .biathlon {
//    width: auto;
//    display: flex;
//    justify-content: center;
//
//    .biathlon_sheet {
//      max-width: 400px;
//
//    }
//  }
//
//}

.biathlon_wrapper {
  font-family: 'Inter', sans-serif;
  background-color: $white-color;
  border-radius: $b-r16;
  max-width: 276px;
  width: 100%;
  padding: 0 !important;
  .header {
    @extend .header-page;
    display: flex;
    justify-content: center;
    margin: 20px auto 10px;
  }
  .questions_wrapper {
    display: grid;
    cursor: pointer;
    .question {
      display: flex;
      align-items: center;
      justify-content: left;
      margin: 10px;
      .question_title {
        margin-left: 10px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

  }
}

</style>
