<template>
  <div class="biathlon_wrapper">
    <v-container class="biathlon_container">
      <v-footer
        class="biathlon_footer"
        padless
      >
        <div class="social_buttons">
          <ViewsAndLikes :article="article"/>
          <CopyLinkButton/>
          <SocialShare/>
        </div>
        <div class="biathlon">
          <v-sheet class="biathlon_sheet">
            <v-slide-group
              multiple
              show-arrows
            >
              <v-slide-item
                v-for="(item, index) in questions"
                :key="index"
              >
                <TooltipStyled :nudge-top="-10" :title="getQuestionTitle(item)" is-top>
                  <template>
                    <v-radio-group :value="getAnswer(item)" readonly success>
                      <v-radio :value="getAnswer(item)" readonly @click="scrollToQuestion(item)"/>
                    </v-radio-group>
                  </template>
                </TooltipStyled>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
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
        return `Вы не заполнили вопрос номер ${item?.data?.component?.index_questions ? item.data.component.index_questions : ''}, ${item.instance.question_data.name}`
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
    }
    .social_buttons {
      display: flex;
      width: 350px;

  }

  .biathlon {
    width: auto;

    .biathlon_sheet {
      max-width: 400px;
    }
  }

}

</style>
