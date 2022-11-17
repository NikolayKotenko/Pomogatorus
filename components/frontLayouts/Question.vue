<template>
  <div :id='`component_wrapper-${index_component}`' class='question_wrapper question_hover article_component'
       contenteditable='false'>
    <template v-if='Object.keys(question_data).length'>
      <div class='question_wrapper__content'>
        <div class='question_wrapper__title'>
          <h3>{{ index_questions }}. {{ question_data.name }}</h3>
          <div v-if='question_data.title' class='helper_wrapper'>
            <v-tooltip bottom>
              <template v-slot:activator='{ on, attrs }'>
                <img
                  :src='require(`~/assets/svg/help-circle.svg`)'
                  alt='help'
                  class='help_img'
                  v-bind='attrs'
                  v-on='on'
                />
              </template>
              <span>{{ question_data.title }}</span>
            </v-tooltip>
          </div>
        </div>
        <!-- STATUS -->
        <transition name='slide-fade'>
          <div v-if='check_status' class='question_wrapper__content__status'>
            <v-progress-circular
              v-if="status_question.type === 'sending'"
              :size='20'
              color='primary'
              indeterminate
            ></v-progress-circular>
          </div>
        </transition>
      </div>

      <!-- QUESTION -->
      <div class='question_wrapper__content__question'>
        <template v-if="question_data.id_type_answer == '1'">
          <InputStyled
            :data='answer'
            :is-disabled='!!detailed_response || (check_status && status_question.type === "sending")'
            :placeholder='"Введите ответ"'
            is-solo
            @update-input='textAnswer'
          />
        </template>
        <template v-else-if="question_data.id_type_answer == '2'">
          <TextAreaStyled
            :data='answer'
            :is-disabled='!!detailed_response || (check_status && status_question.type === "sending")'
            :placeholder='"Введите ответ"'
            is-solo
            @update-input='textAnswer'
          />
        </template>
        <template v-else-if="question_data.id_type_answer == '3'">
          <v-radio-group v-model='answer' dense hide-details>
            <v-radio
              v-for='(item, index) in value_type_answer'
              :key='index'
              :disabled="!!detailed_response || (check_status && status_question.type === 'sending')"
              :value='item.answer'
              @change='changeAnswer(item.dataEnv)'
              @click='getIdElem($event)'
            >
              <template slot='label'>
                <div style='display: flex; column-gap: 20px; align-items: flex-start'>
                  <span class='answerList' v-html='item.answer' @click.stop></span>
                  <div v-if='item.commentary' class='helper_wrapper' @click.stop='stopEvent'>
                    <v-tooltip bottom>
                      <template v-slot:activator='{ on, attrs }'>
                        <img
                          :src='require(`/assets/svg/help-circle.svg`)'
                          alt='help'
                          class='help_img'
                          v-bind='attrs'
                          v-on='on'
                        />
                      </template>
                      <span>{{ item.commentary }}</span>
                    </v-tooltip>
                  </div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </template>
        <template v-else-if="question_data.id_type_answer == '4'">
          <v-checkbox
            v-for='(item, index) in value_type_answer'
            :key='index'
            v-model='answer'
            :disabled="!!detailed_response || (check_status && status_question.type === 'sending')"
            :value='item.answer'
            dense
            hide-details
            multiple
            @change='changeAnswer(item.dataEnv)'
            @click='getIdElem($event)'
          >
            <template slot='label'>
              <div style='display: flex; column-gap: 20px'>
                <span class='answerList' v-html='item.answer' @click.stop></span>
                <div v-if='item.commentary' class='helper_wrapper' @click.stop='stopEvent'>
                  <v-tooltip bottom>
                    <template v-slot:activator='{ on, attrs }'>
                      <img
                        :src='require(`/assets/svg/help-circle.svg`)'
                        alt='help'
                        class='help_img'
                        v-bind='attrs'
                        v-on='on'
                      />
                    </template>
                    <span>{{ item.commentary }}</span>
                  </v-tooltip>
                </div>
              </div>
            </template>
          </v-checkbox>
        </template>
        <template v-else-if="question_data.id_type_answer == '5'">
          <v-select
            v-model='answer'
            :disabled="!!detailed_response || (check_status && status_question.type === 'sending')"
            :items='value_type_answer'
            :menu-props='{
            closeOnContentClick: true,
            bottom: true,
            offsetY: true,
          }'
            clearable
            dense
            hide-details
            item-text='answer'
            placeholder='Введите ответ'
            return-object
            solo
            @change='changeAnswer()'
          >
            <template v-slot:selection='data'>
              <span v-bind='data.attrs' v-html='data.item.answer'></span>
            </template>
            <template v-slot:item='{ active, item, attrs, on }'>
              <v-list-item v-bind='attrs' @click='getIdElem($event)' v-on='on'>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-row align='center' no-gutters>
                      <span class='answerList' v-html='item.answer' @click.stop></span>
                      <v-spacer></v-spacer>
                      <div v-if='item.commentary' class='helper_wrapper' @click.stop='stopEvent'>
                        <v-tooltip bottom>
                          <template v-slot:activator='{ on, attrs }'>
                            <img
                              :src='require(`/assets/svg/help-circle.svg`)'
                              alt='help'
                              class='help_img'
                              v-bind='attrs'
                              v-on='on'
                            />
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
        <span
        >Укажите число в диапозоне от {{ value_type_answer[0].answer }} и до {{ value_type_answer[1].answer }}</span
        >
          <v-text-field
            v-model='answer'
            :class='{ rangeError: rangeError }'
            :disabled="!!detailed_response || (check_status && status_question.type === 'sending')"
            dense
            hide-details
            label='Введите ответ'
            solo
            type='number'
            @change='changeAnswer()'
          >
            <template slot='prepend-inner'>
              <v-icon color='primary' @click="rangeEdit('minus')"> mdi-minus</v-icon>
            </template>
            <template slot='append'>
              <v-icon color='primary' @click="rangeEdit('plus')"> mdi-plus</v-icon>
            </template>
          </v-text-field>
          <small v-if='rangeError' style='color: lightcoral'> Неккоректные значения </small>
        </template>
        <template v-else-if="question_data.id_type_answer == '7'">
        <span
        >Укажите число в диапозоне от {{ value_type_answer[0].answer }} и до {{ value_type_answer[1].answer }}</span
        >
          <v-range-slider
            v-model='answer'
            :disabled="!!detailed_response || (check_status && status_question.type === 'sending')"
            :max='max'
            :min='min'
            class='align-center'
            hide-details
            type='number'
            @change='changeAnswer()'
          >
            <template v-slot:prepend>
              <v-text-field
                :value='answer[0]'
                class='mt-0 pt-0'
                hide-details
                single-line
                style='width: 60px'
                type='number'
                @change='$set(answer, 0, $event)'
              ></v-text-field>
            </template>
            <template v-slot:append>
              <v-text-field
                :value='answer[1]'
                class='mt-0 pt-0'
                hide-details
                single-line
                style='width: 60px'
                type='number'
                @change='$set(answer, 1, $event)'
              ></v-text-field>
            </template>
          </v-range-slider>
          <small v-if='rangeError' style='color: lightcoral'> Неккоректные значения </small>
        </template>

        <!-- DETAILED RESPONSE -->
        <InputStyled
          v-if='question_data.state_detailed_response'
          :data='detailed_response'
          :placeholder='"Развернутый ответ"'
          class='py-2'
          is-solo
          @update-input='changeDetailedResponse'
        />
      </div>

      <div v-if='question_data.state_attachment_response' class='py-3 file_input'>
        <template v-if='(answer || detailed_response) && !disableBtn'>
          <v-btn
            :loading='isSelecting'
            class='dashedButton'
            color='primary'
            dark
            outlined
            rounded
            @click='handleFileImport'
          >
            <v-icon>mdi-paperclip</v-icon>
            {{ !!files.length ? 'Добавить еще' : 'Вложить файл' }}
          </v-btn>
          <input ref='uploader' class='d-none' type='file' @change='onFileChanged' />
          <v-btn
            v-if='files.length'
            :disabled="(!!uploadedFiles.length && statusFile) || status_name === 'sending'"
            :loading="status_name === 'sending'"
            color='green lighten-1'
            rounded
            @click='uploadToServer'
          >
            Загрузить файл
          </v-btn>
        </template>
        <template v-else>
          <v-tooltip bottom>
            <template v-slot:activator='{ on, attrs }'>
              <div v-bind='attrs' v-on='on'>
                <v-btn
                  :loading='isSelecting'
                  class='dashedButton'
                  disabled
                  outlined
                  rounded
                >
                  <v-icon>mdi-paperclip</v-icon>
                  Добавить файл
                </v-btn>
              </div>
            </template>
            <span>Сначала необходимо выбрать вариант ответа и авторизоваться!</span>
          </v-tooltip>
        </template>
      </div>

      <div v-if='files.length' class='files_chips'>
        <h5 class='files_chips__title'>Добавленные файлы</h5>
        <div class='files_chips__wrapper'>
          <div v-for='(file, index) in files' class='files_chips__wrapper__chip'>
            <v-chip :key='index' class='mr-1 text-truncate' close small @click:close='remove(index)'>
              <span style='white-space: nowrap; overflow: hidden; text-overflow: ellipsis'>{{ file.name }}</span>
            </v-chip>
            <span class='files_chips__wrapper__chip__type'>{{ file.name.split('.')[1] }}</span>
          </div>
        </div>
      </div>

      <transition name='list'>
        <div v-if="status_question.type !== 'sending' && status_question.type !== 'warning' && check_status"
             class='question_wrapper__content__alert'>
          <v-alert :icon='status_question.icon' :type='status_question.type'>
            <span v-html='status_question.text'></span>
          </v-alert>
        </div>
      </transition>
    </template>

    <!--  MODALS  -->
    <AuthModal ref='authModal' />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Request from '../../services/request'
import Answers from '../../services/answers/answers'
import CompareArrays from '../../utils/compareArrays'
import AuthModal from '../Modals/AuthModal'
import InputStyled from '../Common/InputStyled'
import TextAreaStyled from '../Common/TextAreaStyled'

export default {
  name: 'Question',
  components: { TextAreaStyled, InputStyled, AuthModal },
  props: {
    propsData: {
      type: Object,
      default: () => ({})
    },
    propsIndex: {
      type: Number,
      default: 0
    }
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
  mounted() {
    if (Object.keys(this.propsData).length) {
      this.index_questions = this.propsIndex
      this.index_component = Math.floor(Math.random() * 100)
      this.question_data = this.propsData
    } else {
      this.getData()
    }
  },
  watch: {
    answer: {
      handler() {
        if (this.question_data.id_type_answer == '6') {
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
          this.answer = null
        }
      }
    },
    stateAuth: {
      handler(v) {
        if (v && !this.$store.state.listModal[0].isOpen && !this.isSilentCreated) {
          this.check_status = false
          this.$nextTick(() => {
            this.answer = null
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
            this.answer = null
            this.detailed_response = ''
          })
          this.$store.commit('set_idQuestionWhenModal', null)
        }
      }
    },
    '$store.state.currentObject': {
      handler() {
        if (this.$store.state.idQuestionWhenModal === this.question_data.id) {
          if (this.$store.state.currentObject && Object.keys(this.$store.state.currentObject).length) {
            this.changeAnswer()
          }
          this.$store.commit('set_idQuestionWhenModal', null)
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['stateAuth', 'open_close_cabinet']),
    status_question() {
      let auth_block
      let index = this.$store.state.ArticleModule.components_after_request.findIndex((i) => {
        return i.component.name === 'auth'
      })
      if (index !== -1) auth_block = this.$store.state.ArticleModule.components_after_request[index].index

      return new Answers().create_status(this.status_name, auth_block)
    },
    statusFile() {
      return CompareArrays(this.files, this.uploadedFiles)
    },
    disableBtn() {
      return !this.stateAuth
    }
  },
  methods: {
    /* AGENT PROP */
    getIdElem(event) {
      let child =
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
    remove(index) {
      this.files.splice(index, 1)
    },
    handleFileImport() {
      this.isSelecting = true

      // After obtaining the focus when closing the FilePicker, return the button state to normal
      window.addEventListener(
        'focus',
        () => {
          this.isSelecting = false
        },
        { once: true }
      )

      // Trigger click on the FileInput
      this.$refs.uploader.click()
    },
    onFileChanged(e) {
      this.selectedFile = e.target.files
      this.files = [...this.selectedFile, ...this.files]
    },
    uploadToServer() {
      this.status_name = 'sending'
      const promises = []
      this.files.forEach((elem) => {
        promises.push(this.requestFunc(elem))
      })
      Promise.all(promises)
        .then((values) => {
          if (
            values.some((elem) => {
              return elem.codeResponse != '201'
            })
          ) {
            this.status_name = 'error'
          } else {
            this.uploadedFiles = [...this.files]
            this.status_name = 'success'
          }
        })
        .catch((error) => {
          console.log(error)
          this.status_name = 'error'
        })
        .finally(() => {
          if (this.$store.state.ArticleModule.answers.map(elem => elem.id).includes(this.question_data.id)) {
            this.$store.commit('set_files_answer', {
              id: this.question_data.id,
              files: this.files
            })
          } else {
            const files = structuredClone(this.files)
            this.$store.commit('add_answers', {
              id: this.question_data.id,
              answer: this.answer,
              detailed_response: this.detailed_response,
              files: files
            })
          }
        })
    },
    async requestFunc(element) {
      return Answers.sendFile({
        id_answer: this.id_answer,
        uuid: Answers.create_UUID(),
        file: element
      })
    },

    /* ANSWER LOGIC */
    textAnswer(value) {
      if (value) {
        this.answer = value
      }
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
            id: this.$store.state.currentObject.id
          }
        }
        this.data_env.data[dataEnv.data.data.column] = JSON.stringify(this.answer)
      } else {
        if (!this.answer && this.detailed_response) {
          if (this.value_type_answer && this.value_type_answer.length) {
            if (this.value_type_answer[0]?.dataEnv) {
              this.data_env = {
                model: this.value_type_answer[0].dataEnv.data.model,
                controller: this.value_type_answer[0].dataEnv.data.controller,
                name: this.value_type_answer[0].dataEnv.data.name,
                data: {
                  id: this.$store.state.currentObject.id
                }
              }
              this.value_type_answer.forEach((elem) => {
                this.data_env.data[elem.dataEnv.data.data.column] = JSON.stringify(this.detailed_response)
              })
            }
          }
        } else if (typeof this.answer === 'string') {
          if (this.value_type_answer && this.value_type_answer.length) {
            if (this.value_type_answer[0]?.dataEnv) {
              this.data_env = {
                model: this.value_type_answer[0].dataEnv.data.model,
                controller: this.value_type_answer[0].dataEnv.data.controller,
                name: this.value_type_answer[0].dataEnv.data.name,
                data: {
                  id: this.$store.state.currentObject.id
                }
              }
              this.data_env.data[this.value_type_answer[0].dataEnv.data.data.column] = JSON.stringify(this.answer)
            }
          }
        } else {
          if (this.answer?.dataEnv) {
            this.data_env = {
              model: this.answer.dataEnv.data.model,
              controller: this.answer.dataEnv.data.controller,
              name: this.answer.dataEnv.data.name,
              data: {
                id: this.$store.state.currentObject.id
              }
            }
            this.data_env.data[this.answer.dataEnv.data.data.column] = JSON.stringify(this.answer)
          }
        }
      }
    },
    async silentCreateObject() {
      this.$store.commit('change_loaderObjects', true)

      let { data } = await Request.post(this.$store.state.BASE_URL + '/entity/objects')

      this.isSilentCreated = true

      await this.$store.dispatch('loginByToken')

      this.$store.commit('set_currentObject', data)

      this.$store.commit('change_listObjects', [data])

      this.$store.commit('change_loaderObjects', false)
    },
    sendAnswer(dataEnv) {
      this.status_name = 'sending'
      this.$nextTick(async () => {
        this.setDataEnv(dataEnv)
        if (this.id_answer) {
          try {
            const result = await Answers.update(
              {
                id_type_answer: this.question_data.id_type_answer,
                id_question: this.question_data.id,
                id_user: this.$store.state.AuthModule.userData.id,
                code_agent: this.agentCode,
                id_article: this.$route.params.id,
                value_answer: JSON.stringify(this.answer),
                data_env: JSON.stringify(this.data_env),
                detailed_response: this.detailed_response,
                attachment_files: ''
              },
              this.id_answer
            )
            if (result.codeResponse != '202') {
              this.status_name = 'error'
            } else {
              this.status_name = 'success'
              this.id_answer = result.data.id
            }
          } catch (e) {
            this.status_name = 'error'
            console.log(e)
          }
        } else {
          try {
            const result = await Answers.create({
              id_type_answer: this.question_data.id_type_answer,
              id_question: this.question_data.id,
              id_user: this.$store.state.AuthModule.userData.id,
              code_agent: this.agentCode,
              id_article: this.$route.params.id,
              value_answer: JSON.stringify(this.answer),
              data_env: JSON.stringify(this.data_env),
              detailed_response: this.detailed_response,
              attachment_files: ''
            })
            if (result.codeResponse != '201') {
              this.status_name = 'error'
            } else {
              this.status_name = 'success'
              this.id_answer = result.data.id
            }
          } catch (e) {
            this.status_name = 'error'
            console.log(e)
          }
        }

        // AFTER WE CREATE WE SAVE OUR ANSWER TO STORE
        const files = structuredClone(this.files)
        this.$store.commit('add_answers', {
          id: this.question_data.id,
          answer: this.answer,
          detailed_response: this.detailed_response,
          files: files
        })
      })
    },

    changeDetailedResponse(value) {
      this.detailed_response = value
      this.changeAnswer()
    },
    changeAnswer(dataEnv) {
      this.check_status = true
      if (!this.stateAuth) {
        this.status_name = 'warning'
        this.$nextTick(() => {
          /* Fix default scroll by hash on page */
          this.createAnchorToAuth()
        })
        this.$refs.authModal.openModal()
      } else {
        if (!this.$store.state.currentObject || !Object.keys(this.$store.state.currentObject).length) {
          if (this.$store.state.AuthModule.userData.objects.length < 1) {
            this.silentCreateObject()
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
      } else {
        if (!this.answer) {
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
      }
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
          let current = this.$store.state.ArticleModule.answers.find(elem => elem.id === this.question_data.id)
          if (current) {
            this.files = current.files
            this.answer = current.answer
            this.detailed_response = current.detailed_response
          }
        }
      }
    },
    getValue_type_answer() {
      if (this.question_data['id_type_answer'] == '7') {
        let parsed = null
        parsed = JSON.parse(JSON.parse(this.question_data['value_type_answer']))
        if (Array.isArray(parsed)) {
          this.value_type_answer = parsed
        } else {
          this.value_type_answer = []
        }
        if (this.value_type_answer.length) {
          this.min = this.value_type_answer[0].answer
          this.max = this.value_type_answer[1].answer
          this.answer = []
          this.answer.push(this.min)
          this.answer.push(this.max)
        }
      } else {
        let parsed = null
        parsed = JSON.parse(JSON.parse(this.question_data['value_type_answer']))
        if (Array.isArray(parsed)) {
          this.value_type_answer = parsed
        } else {
          this.value_type_answer = []
        }
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
@import 'assets/styles/fileChips';

@media only screen and (max-width: 600px) {
  .file_input {
    flex-direction: column !important;
    row-gap: 7px !important;
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.8s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-fade-enter-active {
  transition: all 0.8s ease;
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
  max-width: 600px;
  position: relative;
  padding: 16px 10px 8px 10px;
  border: 2px solid white;
  border-radius: 15px;
  transition: border-color 0.6s ease-in-out;

  &:hover {
    border-color: lighten(yellow, 15%);
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
      flex: 1;
      transition: all 0.4s ease-in-out;
      padding-bottom: 10px;
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
  transition: 0.2s ease-in-out;
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
  border-style: dashed !important;
  width: 100%;
  text-transform: uppercase;
  display: grid;
}
</style>
