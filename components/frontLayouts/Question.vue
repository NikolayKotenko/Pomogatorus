<template>
  <div
    :id="`component_wrapper-${index_component}`"
    class="question_wrapper question_hover article_component"
    contenteditable="false"
  >
    <template v-if="Object.keys(question_data).length">
      <div class="question_wrapper__content">
        <div class="question_wrapper__title">
          <div>{{ question_data.name }}</div>
          <div v-if="question_data.title || question_data.name" class="helper_wrapper">
            <DropDownMenuStyled
              :is-left="true"
              :is-top="true"
              :is-offset-y="false"
            >
              <template #icon>
                <img
                  :src="require(`~/assets/svg/icons/question_icon.svg`)"
                  alt="help"
                  style="height: 24px; display: flex;'"
                >
              </template>
              <template #content>
                <div class="advice_wrapper">
                  <div class="popup_img">
                    <v-img
                      :src="require(`~/assets/mascot/pomogaikin_with_popup.svg`)"
                      cover
                      width="315"
                      height="284"
                    />
                    <div class="popup_content">
                      <div class="popup_title">
                        Как узнать мощность необходимую для отопления объекта?
                      </div>
                      <div class="popup_text">
                        {{ question_data.title }}
                      </div>
                      <div class="popup_btn">
                        <v-divider style="border-color: #777777;"/>
                        <p class="btn_text">
                          OK
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <!--                <span>{{ question_data.title }}</span> -->
              </template>
            </DropDownMenuStyled>
            <v-divider style="border-color: #DDDDDD !important;" vertical/>
            <img
              v-if="answer"
              :src="require(`~/assets/svg/icons/check_icon.svg`)"
              alt="check"
            >
          </div>
        </div>
        <!-- STATUS -->
        <transition name="slide-fade">
          <div
            v-if="check_status || $store.state.ArticleModule.isLoadingAnswers"
            class="question_wrapper__content__status"
          >
            <v-progress-circular
              v-if="status_question.type === 'sending' || $store.state.ArticleModule.isLoadingAnswers"
              :size="20"
              color="primary"
              indeterminate
            />
          </div>
        </transition>
      </div>

      <!-- QUESTION -->
      <div class="question_wrapper__content__question">
        <v-icon
          v-if="answer"
          class="check_answer_icon"
          color="#FF6347"
          size="24"
        >
          mdi-check-circle
        </v-icon>
        <template v-if="question_data.id_type_answer == '1'">
          <InputStyled
            :data="answer"
            :full-sinc-prop="true"
            :is-disabled="(check_status && status_question.type === 'sending') || $store.state.ArticleModule.isLoadingAnswers"
            :placeholder="'Введите ответ'"
            is-solo
            @update-input="textAnswer"
          />
        </template>
        <template v-else-if="question_data.id_type_answer == '2'">
          <TextAreaStyled
            :data="answer"
            :full-sinc-prop="true"
            :is-disabled="(check_status && status_question.type === 'sending') || $store.state.ArticleModule.isLoadingAnswers"
            :placeholder="'Введите ответ'"
            is-solo
            @update-input="textAnswer"
          />
        </template>
        <template v-else-if="question_data.id_type_answer == '3'">
          <v-radio-group v-model="answer" dense hide-details>
            <v-radio
              v-for="(item, index) in value_type_answer"
              :key="index"
              :disabled="(check_status && status_question.type === 'sending') || $store.state.ArticleModule.isLoadingAnswers"
              :value="item.answer"
              color="#95D7AE"
              @change="changeAnswer(item.dataEnv)"
              @click="getIdElem($event)"
            >
              <template slot="label">
                <div style="display: flex; column-gap: 20px; align-items: flex-start">
                  <span class="answerList" @click.stop v-html="item.answer"/>
                  <div v-if="item.commentary" class="helper_wrapper" @click.stop="stopEvent">
                    <TooltipStyled :title="item.commentary">
                      <template>
                        <img
                          :src="require(`/assets/svg/help-circle.svg`)"
                          alt="help"
                          class="help_img"
                        >
                      </template>
                    </TooltipStyled>
                  </div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </template>
        <template v-else-if="question_data.id_type_answer == '4'">
          <v-checkbox
            v-for="(item, index) in value_type_answer"
            :key="index"
            v-model="answer"
            :disabled="(check_status && status_question.type === 'sending') || $store.state.ArticleModule.isLoadingAnswers"
            :value="item.answer"
            color="#95D7AE"
            dense
            hide-details
            multiple
            @change="changeAnswer(item.dataEnv)"
            @click="getIdElem($event)"
          >
            <template slot="label">
              <div style="display: flex; column-gap: 20px">
                <span class="answerList" @click.stop v-html="item.answer"/>
                <div v-if="item.commentary" class="helper_wrapper" @click.stop="stopEvent">
                  <TooltipStyled :title="item.commentary">
                    <template>
                      <img
                        :src="require(`/assets/svg/help-circle.svg`)"
                        alt="help"
                        class="help_img"
                      >
                    </template>
                  </TooltipStyled>
                </div>
              </div>
            </template>
          </v-checkbox>
        </template>
        <template v-else-if="question_data.id_type_answer == '5'">
          <v-select
            v-model="answer"
            :disabled="(check_status && status_question.type === 'sending') || $store.state.ArticleModule.isLoadingAnswers"
            :items="value_type_answer"
            :menu-props="{
              closeOnContentClick: true,
              bottom: true,
              offsetY: true,
            }"
            clearable
            dense
            hide-details
            item-text="answer"
            item-value="answer"
            placeholder="Введите ответ"

            solo
            @change="changeAnswer()"
          >
            <template #selection="data">
              <span v-bind="data.attrs" v-html="data.item.answer"/>
            </template>
            <template #item="{ item, attrs, on }">
              <v-list-item v-bind="attrs" @click="getIdElem($event)" v-on="on">
                <v-list-item-content>
                  <v-list-item-title>
                    <v-row align="center" no-gutters>
                      <span class="answerList" @click.stop v-html="item.answer"/>
                      <v-spacer/>
                      <div v-if="item.commentary" class="helper_wrapper" @click.stop="stopEvent">
                        <v-tooltip bottom>
                          <template #activator="{ on, attrs }">
                            <img
                              :src="require(`/assets/svg/help-circle.svg`)"
                              alt="help"
                              class="help_img"
                              v-bind="attrs"
                              v-on="on"
                            >
                          </template>
                          <span>{{ item.commentary }}</span>
                        </v-tooltip>
                      </div>
                    </v-row>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
        </template>
        <template v-else-if="question_data.id_type_answer == '6'">
          <span>Укажите число в диапозоне от {{ value_type_answer[0].answer }} и до {{ value_type_answer[1].answer
          }}</span>
          <v-text-field
            v-model="answer"
            :class="{ rangeError: rangeError }"
            :disabled="(check_status && status_question.type === 'sending') || $store.state.ArticleModule.isLoadingAnswers"
            dense
            hide-details
            label="Введите ответ"
            solo
            type="number"
            @change="changeAnswer()"
          >
            <template slot="prepend-inner">
              <v-icon color="primary" @click="rangeEdit('minus')">
                mdi-minus
              </v-icon>
            </template>
            <template slot="append">
              <v-icon color="primary" @click="rangeEdit('plus')">
                mdi-plus
              </v-icon>
            </template>
          </v-text-field>
          <small v-if="rangeError" style="color: lightcoral"> Неккоректные значения </small>
        </template>
        <template v-else-if="question_data.id_type_answer == '7'">
          <template v-if="answerIsArray">
            <span>Укажите число в диапозоне от {{ value_type_answer[0].answer }} и до {{ value_type_answer[1].answer
            }}</span>
            <v-range-slider
              v-model="answer"
              :disabled="(check_status && status_question.type === 'sending') || $store.state.ArticleModule.isLoadingAnswers"
              :max="max"
              :min="min"
              class="align-center"
              hide-details
              type="number"
              @change="changeAnswer()"
            >
              <template #prepend>
                <v-text-field
                  :value="answer[0]"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  style="width: 60px"
                  type="number"
                  @change="$set(answer, 0, $event)"
                />
              </template>
              <template #append>
                <v-text-field
                  :value="answer[1]"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  style="width: 60px"
                  type="number"
                  @change="$set(answer, 1, $event)"
                />
              </template>
            </v-range-slider>
            <small v-if="rangeError" style="color: lightcoral"> Неккоректные значения </small>
          </template>
        </template>

        <!-- DETAILED RESPONSE -->
        <InputStyled
          v-if="question_data.state_detailed_response"
          :data="detailed_response"
          :full-sinc-prop="true"
          :is-disabled="$store.state.ArticleModule.isLoadingAnswers"
          :is-flat="true"
          :placeholder="'Развернутый ответ'"
          class="py-2"

          is-solo
          @update-input="changeDetailedResponse"
        />
      </div>

      <div v-if="question_data.state_attachment_response" class="mb-4">
        <template v-if="(answer || detailed_response) && !disableBtn">
          <div v-if="$store.state.Objects.currentObject.id" class="custom-fields">
            <DropzoneInput
              :id-answer="id_answer"
              :id-object="$store.state.Objects.currentObject.id"
              :is-disabled="$store.state.ArticleModule.isLoadingAnswers"
              :object-template="!!uploadedFiles.length"
              :question-type="true"
              @uploaded-file="uploadFile"
              @remove-file="removeFile"
            />
          </div>
        </template>
        <template v-else>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-btn
                  :loading="isSelecting"
                  class="dashedButton"
                  disabled
                  outlined
                >
                  <v-icon large>
                    mdi-cloud-upload
                  </v-icon>
                  Загрузить файлы
                </v-btn>
              </div>
            </template>
            <span>Сначала необходимо выбрать вариант ответа и авторизоваться!</span>
          </v-tooltip>
        </template>
      </div>

      <transition name="list">
        <div
          v-if="status_question.type !== 'sending' && status_question.type !== 'warning' && check_status"
          class="question_wrapper__content__alert"
        >
          <!-- TODO: в мастере вижу что убрали уведомления? Точно это надо? -->
          <!--          <span>{{ $globalToasts }}</span> -->
          <v-alert :icon="status_question.icon" :type="status_question.type">
            <span v-html="status_question.text"/>
          </v-alert>
        </div>
      </transition>
    </template>

    <!--  MODALS  -->
    <AuthModal ref="authModal"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CompareArrays from '../../utils/compareArrays';
import AuthModal from '../Modals/AuthModal';
import InputStyled from '../Common/InputStyled';
import TextAreaStyled from '../Common/TextAreaStyled';
import TooltipStyled from '../Common/TooltipStyled.vue';
import DropzoneInput from '../Common/DropzoneInput';
import Answers from '@/services/answers/answers';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Question',
  components: { DropzoneInput, TooltipStyled, TextAreaStyled, InputStyled, AuthModal },
  props: {
    propsData: {
      type: Object,
      default: () => ({})
    },
    propsIndex: {
      type: Number,
      default: 0
    },
    outerAnswer: {
      type: [String, Number, Array, Object],
      default: null
    },
    detailedResponse: {
      type: [String, Number],
      default: null
    },
    idAnswer: {
      type: Number,
      default: null
    },
  },
  data: () => ({
    question_data: {},
    index_component: null,
    index_questions: null,
    controls_height: 0,
    controls_width: 0,
    value_type_answer: [],
    debounceTimeout: null,
    saveTextDebounce: null,

    check_status: false,
    status_name: 'sending',
    detailed_response: '',
    answer: null,
    id_answer: null,
    agentCode: null,
    data_env: null,
    isSilentCreated: false,

    /* DATA_BY_TYPES */
    rangeError: false,
    range_one: null,
    min: 0,
    max: 0,
    range_two: [],

    /* FILES */
    files: [],
    isSelecting: false,
    selectedFile: null,
    uploadedFiles: []
  }),
  watch: {
    answer: {
      handler() {
        if (this.question_data.id_type_answer === '6') {
          if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
          this.debounceTimeout = setTimeout(() => {
            this.rangeError =
              parseInt(this.answer) < parseInt(this.value_type_answer[0].answer) ||
              parseInt(this.answer) > parseInt(this.value_type_answer[1].answer)
          })
        }
      }
    },
    detailed_response: {
      handler(v) {
        if (v) {
          // this.answer = null
        }
      }
    },
    stateAuth: {
      handler(v) {
        if (v && !this.$store.state.listModal[0].isOpen && !this.isSilentCreated) {
          this.check_status = false
          this.$nextTick(() => {
            // чтобы в слайдере не затерлось на null, т.к. там нужен массив
            if (this.question_data.id_type_answer !== '7') {
              this.answer = null
            }
            this.detailed_response = ''
          })
        }
      },
      deep: true
    },
    'open_close_cabinet': {
      handler(v) {
        if (!v) {
          this.$nextTick(() => {
            this.answer = ''
            this.detailed_response = ''
          })
          this.$store.commit('set_idQuestionWhenModal', null)
        }
      }
    },
    '$store.state.Objects.currentObject': {
      handler() {
        if (this.$store.state.idQuestionWhenModal === this.question_data.id) {
          if (this.$store.state.Objects.currentObject && Object.keys(this.$store.state.Objects.currentObject).length) {
            this.changeAnswer()
          }
          this.$store.commit('set_idQuestionWhenModal', null)
        }
      },
      deep: true
    },
    '$store.state.ArticleModule.answersFromServer': {
      handler() {
        this.getAnswer()
      },
      deep: true
    }
  },
  mounted() {
    if (Object.keys(this.propsData).length) {
      this.index_questions = this.propsIndex
      this.index_component = Math.floor(Math.random() * 100)
      this.question_data = this.propsData
      this.getValue_type_answer()
      this.detailed_response = this.detailedResponse
      this.id_answer = this.idAnswer
      this.answer = this.outerAnswer
    } else {
      this.getData()
    }
  },
  computed: {
    ...mapGetters(['stateAuth', 'open_close_cabinet']),

    status_question() {
      // eslint-disable-next-line camelcase
      let auth_block
      const index = this.$store.state.ArticleModule.components_after_request.findIndex((i) => {
        return i.component.name === 'auth'
      })
      // eslint-disable-next-line camelcase
      if (index !== -1) auth_block = this.$store.state.ArticleModule.components_after_request[index].index

      return new Answers().create_status(this.status_name, auth_block)
    },
    statusFile() {
      return CompareArrays(this.files, this.uploadedFiles)
    },
    disableBtn() {
      return !this.stateAuth
    },
    answerIsArray() {
      return this.answer?.length === 2
    }
  },
  methods: {
    ...mapActions('Objects', ['createNewObject']),
    ...mapGetters(['getQuestionAnswer']),

    /* ANSWERS */
    getAnswer() {
      if (this.getQuestionAnswer()(this.question_data.id)) {
        const findedAnswer = this.getQuestionAnswer()(this.question_data.id)

        this.answer = JSON.parse(findedAnswer.value_answer)
        this.detailed_response = findedAnswer.detailed_response
        this.id_answer = findedAnswer.id
      }
    },

    /* AGENT PROP */
    getIdElem(event) {
      const child =
        event.target.parentElement.parentElement.querySelectorAll('.answerList') || event.target.nextElementSibling
      if (child) {
        if (Array.from(child).length === 1) {
          if (Array.from(child)[0].children.length) {
            this.agentCode = Array.from(child)[0].children[0].id
          } else this.agentCode = null
        } else this.agentCode = null
      } else this.agentCode = null
    },
    stopEvent(event) {
      event.preventDefault()
    },

    /* FILES UPLOAD */
    uploadFile(data) {
      this.files.push(data)
      this.uploadedFiles = [...this.files]
    },
    removeFile(id) {
      const index = this.files.findIndex(elem => elem.data.id === id)
      if (index !== -1) {
        this.files.splice(index, 1)
        this.uploadedFiles = [...this.files]
      }
    },

    /* ANSWER LOGIC */
    textAnswer(value) {
      // TODO: А пустое значение на вопрос нужно ли сохранять?
      this.answer = value
      if (this.saveTextDebounce) clearTimeout(this.saveTextDebounce)
      this.saveTextDebounce = setTimeout(() => {
        this.changeAnswer()
      }, 600)
    },
    setDataEnv(dataEnv) {
      if (dataEnv) {
        this.data_env = {
          model: dataEnv.data.model,
          controller: dataEnv.data.controller,
          name: dataEnv.data.name,
          data: {
            id: this.$store.state.Objects.currentObject.id
          }
        }
        this.data_env.data[dataEnv.data.data.column] = JSON.stringify(this.answer)
      } else if (!this.answer && this.detailed_response) {
        if (this.value_type_answer && this.value_type_answer.length) {
          if (this.value_type_answer[0]?.dataEnv?.data?.data?.column) {
            this.data_env = {
              model: this.value_type_answer[0].dataEnv.data.model,
              controller: this.value_type_answer[0].dataEnv.data.controller,
              name: this.value_type_answer[0].dataEnv.data.name,
              data: {
                id: this.$store.state.Objects.currentObject.id
              }
            }
            this.value_type_answer.forEach((elem) => {
              this.data_env.data[elem.dataEnv.data.data.column] = JSON.stringify(this.detailed_response)
            })
          }
        }
      } else if (typeof this.answer === 'string') {
        if (this.value_type_answer && this.value_type_answer.length) {
          if (this.value_type_answer[0]?.dataEnv?.data?.data?.column) {
            this.data_env = {
              model: this.value_type_answer[0].dataEnv.data.model,
              controller: this.value_type_answer[0].dataEnv.data.controller,
              name: this.value_type_answer[0].dataEnv.data.name,
              data: {
                id: this.$store.state.Objects.currentObject.id
              }
            }
            this.data_env.data[this.value_type_answer[0].dataEnv.data.data.column] = JSON.stringify(this.answer)
          }
        }
      } else if (this.answer?.dataEnv) {
        if (this.answer?.dataEnv?.data?.data?.column) {
          this.data_env = {
            model: this.answer.dataEnv.data.model,
            controller: this.answer.dataEnv.data.controller,
            name: this.answer.dataEnv.data.name,
            data: {
              id: this.$store.state.Objects.currentObject.id
            }
          }
          this.data_env.data[this.answer.dataEnv.data.data.column] = JSON.stringify(this.answer)
        }
      }
    },

    async silentCreateObject() {
      this.isSilentCreated = true

      const data = await this.createNewObject()

      this.$store.commit('Objects/setListObjects', [data])
    },
    sendAnswer(dataEnv) {

      this.status_name = 'sending'
      this.$nextTick(async () => {
        try {
          this.setDataEnv(dataEnv)
        } catch (e) {
          this.status_name = 'error'
          console.warn(e)
        }

        if (this.id_answer) {
          try {
            const result = await Answers.update(
              {
                id_type_answer: this.question_data.id_type_answer,
                id_question: this.question_data.id,
                id_user: this.$store.state.AuthModule.userData.id,
                id_object: this.$store.state.Objects.currentObject.id,
                code_agent: this.agentCode,
                // id_article: this.$route.params.id,
                value_answer: JSON.stringify(this.answer),
                data_env: JSON.stringify(this.data_env),
                detailed_response: this.detailed_response,
                attachment_files: ''
              },
              this.id_answer
            )
            if (result.codeResponse !== 202) {
              this.status_name = 'error'
            } else {
              this.status_name = 'success'
              this.$emit('answer', { answer: this.answer, id: this.question_data.id })
              this.id_answer = result.data.id
            }
          } catch (e) {
            this.status_name = 'error'
            console.warn(e)
          }
        } else {
          try {
            const result = await Answers.create({
              id_type_answer: this.question_data.id_type_answer,
              id_question: this.question_data.id,
              id_user: this.$store.state.AuthModule.userData?.id,
              id_object: this.$store.state.Objects.currentObject?.id,
              code_agent: this.agentCode,
              // id_article: this.$route.params.id,
              value_answer: JSON.stringify(this.answer),
              data_env: JSON.stringify(this.data_env),
              detailed_response: this.detailed_response,
              attachment_files: ''
            })

            if (result.codeResponse !== 201) {
              this.status_name = 'error'
            } else {
              this.status_name = 'success'
              this.id_answer = result.data.id
              this.$emit('answer', { answer: this.answer, id: this.question_data.id })
            }
          } catch (e) {
            this.status_name = 'error'
            console.warn(e)
          }
        }

        await this.$store.dispatch('setIsAnswered')

        // AFTER WE CREATE WE SAVE OUR ANSWER TO STORE
        const files = structuredClone(this.files)
        this.$store.commit('add_answers', {
          id: this.question_data.id,
          answer: this.answer,
          detailed_response: this.detailed_response,
          files
        })
      })
    },

    changeDetailedResponse(value) {
      this.detailed_response = value

      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
      this.debounceTimeout = setTimeout(() => {
        this.changeAnswer()
      }, 1000)
    },
    async changeAnswer(dataEnv) {
      this.check_status = true

      if (Array.isArray(this.answer)) {
        const rangeAnswer = this.answer.join('')
        if (rangeAnswer === ('' + this.min + this.max)) {
          return
        }
      }

      if (!this.stateAuth) {
        this.status_name = 'warning'
        this.$nextTick(() => {
          /* Fix default scroll by hash on page */
          this.createAnchorToAuth()
        })
        this.$store.commit('set_modal_auth', true)
      } else if (!this.$store.state.Objects.currentObject || !Object.keys(this.$store.state.Objects.currentObject).length) {
        if (!Array.isArray(this.$store.state.AuthModule.userData.objects) || this.$store.state.AuthModule.userData.objects.length < 1) {
          await this.silentCreateObject()
          this.check_status = true
          this.sendAnswer(dataEnv)
        } else {
          this.check_status = false
          this.$store.commit('set_idQuestionWhenModal', this.question_data.id)
          this.$store.commit('change_showCabinet', true)
        }
      } else {
        this.sendAnswer(dataEnv)
      }
    },
    createAnchorToAuth() {
      document.querySelectorAll('#authAnchor').forEach((anchor) => {
        const elem = document.getElementById(this.status_question?.anchor)
        if (elem) {
          const heightNav = 70
          const headerTitle = 54
          const top = window.scrollY + elem.getBoundingClientRect().top - heightNav - headerTitle
          anchor.addEventListener('click', function(e) {
            e.preventDefault()
            window.scrollTo(0, top)
          })
        }
      })
    },
    deleteQuestion() {
      const elem = document.getElementById(`component_wrapper-${this.index_component}`)
      elem.remove()
      this.$store.dispatch('deleteComponent', this.index_component)
    },
    rangeEdit(action) {
      if (action === 'plus') {
        if (!this.answer) {
          this.$nextTick(() => {
            this.answer = 1
          })
        } else {
          this.$nextTick(() => {
            this.answer = parseInt(this.answer) + 1
          })
        }
      } else if (!this.answer) {
        this.$nextTick(() => {
          this.answer = 0
        })
      } else if (parseInt(this.answer) > 0) {
        this.$nextTick(() => {
          this.answer = parseInt(this.answer) - 1
        })
      } else
        this.$nextTick(() => {
          this.answer = 0
        })
      this.changeAnswer()
    },
    getData() {
      if (Object.keys(this.$store.state.ArticleModule.selectedComponent).length) {
        this.index_questions = this.$store.state.ArticleModule.count_of_questions
        this.index_component = this.$store.state.ArticleModule.countLayout
        this.question_data = Object.assign({}, this.$store.state.ArticleModule.selectedComponent)
        this.getValue_type_answer()
        this.getHeightOfControls()
        this.getWidthOfControls()

        if (this.$store.state.ArticleModule.answers.length) {
          const current = this.$store.state.ArticleModule.answers.find(elem => elem.id === this.question_data.id)
          if (current) {
            this.files = current.files
            this.answer = current.answer
            this.detailed_response = current.detailed_response
          }
        }
      }
    },
    getValue_type_answer() {
      if (this.question_data.id_type_answer === '7') {
        let parsed = null
        parsed = JSON.parse(JSON.parse(this.question_data.value_type_answer))
        if (Array.isArray(parsed)) {
          this.value_type_answer = parsed
        } else {
          this.value_type_answer = []
        }
        if (this.value_type_answer.length) {
          this.$nextTick(() => {
            this.min = this.value_type_answer[0].answer
            this.max = this.value_type_answer[1].answer
            this.answer = []
            this.answer.push(this.min)
            this.answer.push(this.max)
          })
        }
      } else {
        let parsed = null
        this.value_type_answer = []

        parsed = JSON.parse(this.question_data.value_type_answer);
        if (Array.isArray(parsed)){
          this.value_type_answer = parsed
          return false;
        }
        parsed = JSON.parse(parsed);
        this.value_type_answer = parsed
      }
    },
    getWidthOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(`component_wrapper-${this.index_component}`)
        if (elem) {
          this.controls_width = elem.getBoundingClientRect().width + 6
        } else {
          this.controls_width = 0
        }
      })
    },
    getHeightOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(`component_wrapper-${this.index_component}`)
        if (elem) {
          this.controls_height = elem.getBoundingClientRect().height + 22
        } else {
          this.controls_height = 0
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'assets/styles/style';

@media only screen and (max-width: 600px) {
  .file_input {
    flex-direction: column !important;
    row-gap: 7px !important;
  }
}

.list-enter-active,
.list-leave-active {
  transition: $transition;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-fade-enter-active {
  transition: $transition;
}

.slide-fade-leave-active {
  transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active до версии 2.1.8 */
{
  transform: translateX(-30px);
  opacity: 0;
}

.question_wrapper {
  position: relative;
  padding: 20px;
  border-radius: $b-r16;
  border: 1px solid ($grey1);
  background-color: rgba(221, 221, 221, 0.20);
  transition: $transition;
  height: auto;

  &__content {
    font-size: 1em;
    font-weight: 600;
  }


  &__title {
    display: flex;
    column-gap: 15px;
    padding-bottom: 5px;
    align-items: flex-start;
  }

  &__divider {
    margin-top: 10px;
    height: 1px;
    width: 100%;
    background: darkgrey;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  }

  &__content {
    display: flex;
    align-items: flex-start;
    column-gap: 15px;


    &__question {
      position: relative;
      flex: 1;
      transition: $transition;
      padding-bottom: 10px;
      color: #000000 !important;
      font-size: 0.875em;
      .check_answer_icon {
        position: absolute;
        top: -36px;
        right: 0;
      }
    }

    &__status {
    }
  }
}

.v-menu__content {
  background: #ffffff;
  padding: 15px;
}

.helper_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
}

.helper_wrapper__help {
  opacity: 0;
  transition: $transition;
}

.help_img {
  width: 20px;
  height: 20px;
  margin-bottom: 3px;
  //padding-top: 2px;
}

.file_input {
  display: grid;
  grid-row-gap: 10px;
  column-gap: 10px;
}

.v-input--selection-controls {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.rangeError {
  border: 1px solid lightcoral !important;

  .question_main_wrapper__item {
    border-bottom: unset;
  }

  ::v-deep input {
    color: lightcoral;
  }
}

.dashedButton {
  border: 0.5px dashed #B3B3B3;
  border-radius: 5px;
  color: #B3B3B3;
  font-weight: 400;
  font-size: 1em;
  text-transform: unset !important;
  letter-spacing: 0;
  width: 100%;
  height: 50px !important;
  display: grid;

}

.question_wrapper {
  @media only screen and (max-width: 1333px) {
    font-size: 0.875em !important;
  }
  @media only screen and (max-width: 992px) {
    font-size: 0.75em !important;
  }

}

.answerList {
  font-size: 0.875em;
  @media only screen and (max-width: 1333px) {
    font-size: 0.875em !important;
  }
  @media only screen and (max-width: 992px) {
    font-size: 0.75em !important;
  }
}
</style>
