<template>
  <div class="biathlon_wrapper">
    <v-container class="biathlon_container">
      <v-footer
        class="biathlon_footer"
        padless
      >
        <div class="likes_buttons">
          <ViewsAndLikes :article="article" :view-action="viewAction"/>
        </div>
        <div class="biathlon">
          <v-sheet class="biathlon_sheet">
            <v-slide-group
              multiple
              show-arrows
            >
              <v-slide-item
                v-for="(item, index) in getSortedQuestions"
                :key="index"
              >
                <TooltipStyled :nudge-top="-10" :title="getQuestionTitle(item)" is-top>
                  <template>
                    <v-radio-group :value="getAnswer(item)" readonly success>
                      <v-radio :ripple="false" :value="getAnswer(item)" readonly @click="scrollToQuestion(item)"/>
                    </v-radio-group>
                  </template>
                </TooltipStyled>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </div>
        <div class="share_buttons">
          <CopyLinkButton/>
          <SocialShare/>
        </div>
      </v-footer>
    </v-container>
  </div>
</template>

<script>
import SocialShare from '../Article/SocialShare.vue'
import ViewsAndLikes from './ViewsAndLikes.vue'
import CopyLinkButton from './CopyLinkButton.vue'
import TooltipStyled from './TooltipStyled'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
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
    }
  },
  computed: {
    getSortedQuestions() {
      return this.questions.slice().sort((a, b) => {
        if (a.instance.$data.index_questions < b.instance.$data.index_questions) {
          return -1
        } else if (b.instance.$data.index_questions > a.instance.$data.index_questions) {
          return 1
        }
        return 0
      })
    }
  },
  methods: {
    getAnswer(item) {
      if (item?.instance?.answer) {
        return true
      }
    },
    scrollToQuestion(item) {
      const elem = document.getElementById(`component_wrapper-${item?.data?.index}`)
      const heightNav = 70

      if (elem) {
        const top = window.scrollY + elem.getBoundingClientRect().top - heightNav
        window.scrollTo({ top, left: 0, behavior: 'smooth' })
      }
    },
    getQuestionTitle(item) {
      if (item?.instance?.question_data?.name) {
        return `Вы не заполнили вопрос номер ${item?.instance?.index_questions ? item?.instance?.index_questions : ''}, ${item.instance.question_data.name}`
      }

      return ''
    }
  }
}
</script>

<style lang='scss' scoped>
.biathlon_wrapper {
  position: fixed;
  z-index: 9;
  width: 100vw;
  left: 0;
  bottom: 0;
  background-color: #FFFFFF;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.25);

  .biathlon_container {
    display: flex;
    justify-content: center;
  }

  .biathlon_footer {
    display: inline-flex;
    grid-column-gap: 50px;
    background-color: unset;
    justify-content: space-between;
    width: 1116px;
  }

  .likes_buttons {
    display: flex;
  }
  .share_buttons {
    display: flex;
    text-align: right;
  }

  .biathlon {
    width: auto;

    .biathlon_sheet {
      max-width: 400px;
    }
  }

}

</style>