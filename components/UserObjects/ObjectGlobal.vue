<template>
  <v-card class="object-wrapper">
    <div
      :class="{'object-wrapper-top--mobile': isMobile, 'object-wrapper-top--mobile--move': isMoving}"
      class="object-wrapper-top"
    >
      <div class="object-wrapper-top__selector">
        <div class="object-wrapper-top__selector__title">
          <span>Объект:</span>
        </div>

        <div class="object-wrapper-top__selector__select">
          <SelectObjectStyled
            v-if="stateSelectEditNameObject"
            :custom-style="true"
            :data="object"
            :is-solo="true"
            :item-text="'name'"
            :item-value="'id'"
            :items="listObjects"
            :placeholder="'Выберите объект'"
            title="Выберите объект"
            @update-input="callback"
          />
          <InputStyled
            v-else
            :data="object.name"
            :is-outlined="true"
            :placeholder="'Введите наименование объекта'"
            @update-input="setNameField"
          />
        </div>
        <TooltipStyled
          :title="stateSelectEditNameObject
            ? 'Режим редактирования наименования объекта'
            : 'Режим выбора объекта'"
        >
          <v-icon
            :color="stateSelectEditNameObject ? '' : 'green'"
            @click="setStateSelectedEditName()"
          >
            mdi-lead-pencil
          </v-icon>
        </TooltipStyled>
      </div>
      <div class="object-wrapper-top__map">
        <SelectGeo v-if="notEmptyObject" :data="object" :outer-coords="getCoords" @set-new-address="setAddressMap"/>
      </div>
      <div class="object-wrapper-top__share">
        <CopyLinkButton :id-entry="object.id"/>
        <TooltipStyled :title="'Совместная работа'">
          <v-menu :close-on-content-click="false" left offset-y>
            <template #activator="{ on, attrs }">
              <div style="display: inline-flex; grid-column-gap: 5px" v-bind="attrs" v-on="on">
                <v-icon
                  class="share"
                  color="#000000"
                  size="30"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-account-group-outline
                </v-icon>
              </div>
            </template>
            <Collaboration/>
          </v-menu>
        </TooltipStyled>
      </div>
    </div>

    <v-card-text
      ref="scrollParent"
      :class="{'object-wrapper-main--mobile': isMobile, 'object-wrapper-main--mobile--move': isMoving}"
      class="object-wrapper-main"
      style="height: 1200px;"
    >
      <div ref="docContent" class="object-wrapper-documents">
        <div class="object-wrapper-documents__img-container">
          <span>Фото объекта</span>
          <div
            :class="{'dropzone-empty': ! $store.getters.getMainPhotoObject(object) }"
            class="list-files-styled-wrapper img-activator"
          >
            <img
              v-if="$store.getters.getMainPhotoObject(object)"
              :src="$store.state.BASE_URL + $store.getters.getMainPhotoObject(object).full_path"
              :title="$store.getters.getMainPhotoObject(object).title_image"
              class="img-hover"
              height="100%"
              style="object-fit: cover"
              width="100%"
            >
            <span v-else class="empty-placeholder">Здесь будут фото вашего объекта</span>
          </div>
        </div>

        <div class="object-wrapper-documents__docs">
          <span>Прикрепленные документы</span>
          <ListFilesStyled
            v-if="objectData.id"
            :data="object"
            :id-object="objectData.id"
            @remove-from-global="removeFromGlobal"
          />
        </div>
      </div>

      <div class="object-wrapper-tabs">
        <TabsCustom
          ref="tabContent"
          :data-object="object"
          :deleted-file="deletedFile"
          @update-prop="setField"
          @update-file="setFileField"
          @change-tab="changeTab"
          @remove-file="removeFile"
          @focus-out-field="animationSaveBtn"
        />

        <div :class="{'show-more': showMore}" class="more-arrow">
          <img alt="more" src="@/assets/svg/chevron-more.svg" @click="scrollBot">
        </div>
      </div>
    </v-card-text>

    <div class="object-wrapper-footer">
      <template v-if="isMobile">
        <div class="object-wrapper-footer__left">
          <ButtonStyled
            :custom-slot="true"
            :is-animation="animationBtn"
            :is-loading="isLoading"
            :is-mobile="true"
            local-class="style_button"
            @click-button="closeModal"
          >
            <v-icon>
              mdi-content-save-outline
            </v-icon>
          </ButtonStyled>

          <ButtonStyled
            :custom-slot="true"
            :is-mobile="true"
            @click-button="stateTagsTechBlock = true;"
          >
            <v-icon>mdi-tray-arrow-down</v-icon>
          </ButtonStyled>
        </div>

        <ButtonStyled
          :custom-slot="true"
          :is-mobile="true"
          local-class="style_close"
          local-text="Отмена"
          @click-button="closeModal"
        >
          <v-icon>
            mdi-window-close
          </v-icon>
        </ButtonStyled>

        <v-dialog
          v-model="stateTagsTechBlock"
          width="1080"
        >
          <v-card>
            <v-card-title class="d-flex justify-end">
              <v-icon @click="stateTagsTechBlock = false;">
                mdi-close
              </v-icon>
            </v-card-title>
            <v-card-text>
              <TagsTechBlock/>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>

      <template v-else>
        <div class="object-wrapper-footer__left">
          <ButtonStyled
            :is-animation="animationBtn"
            :is-loading="isLoading"
            local-class="style_button"
            local-text="Сохранить изменения"
            @click-button="onSave"
          />

          <ButtonStyled
            :custom-slot="true"
            @click-button="closeModal"
          >
            <span>
              Скачать PDF
            </span>
          </ButtonStyled>
        </div>

        <ButtonStyled
          local-class="style_close"
          local-text="Закрыть"
          @click-button="closeModal"
        />
      </template>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import Vue from 'vue'
import TabsCustom from '../Common/TabsCustom'
import SelectObjectStyled from '../Common/SelectObjectStyled'
import SelectGeo from '../Common/SelectGeo'
import ButtonStyled from '../Common/ButtonStyled'
import TooltipStyled from '../Common/TooltipStyled.vue'
import CopyLinkButton from '../Common/CopyLinkButton.vue'
import ListFilesStyled from '~/components/Common/ListFilesStyled'
import Collaboration from '~/components/Modals/Collaboration'
import InputStyled from '~/components/Common/InputStyled'
import TagsTechBlock from '~/components/Widgets/TagsTechBlock'

export default {
  name: 'ObjectGlobal',
  components: {
    TagsTechBlock,
    InputStyled,
    CopyLinkButton,
    TooltipStyled,
    Collaboration,
    ListFilesStyled,
    ButtonStyled,
    SelectGeo,
    SelectObjectStyled,
    TabsCustom
  },
  props: {
    objectData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    object: {},
    updateProperties: {},
    deletedFile: 0,

    minHeightInput: 76,
    scrollHeight: null,
    maxScroll: null,
    animationBtn: false,
    debounceTimeout: null,
    startScroll: 0,
    isMoving: false,
    stateSelectEditNameObject: true,
    stateTagsTechBlock: false
  }),
  watch: {
    'objectData': {
      handler(v) {
        if (!v) return false

        this.object = v
      }
    },
    'getUserId': {
      handler(oldV, newV) {
        if (oldV !== newV && !this.listObjects.length) {
          this.getListObjectsByUserId(this.getUserId)
        }
      }
    }
  },
  mounted() {
    this.getObjectFromProp()

    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client && this.$refs.scrollParent) {
      const tabContent = this.$refs.scrollParent
      tabContent.addEventListener('scroll', this.scrollWindow)
      if (this.isMobile) {
        tabContent.addEventListener('scroll', this.scrollHeader, false)
      }
      this.scrollWindow()
    }
  },
  computed: {
    ...mapState('Objects', ['isLoading', 'listObjects']),
    ...mapGetters(['getUserId']),

    notEmptyObject() {
      return !!Object.keys(this.object).length
    },
    getCoords() {
      return this.object?.long && this.object?.lat ? [this.object.lat, this.object.long] : [55.753215, 37.622504]
    },
    showMore() {
      return ((this.parentHeight + this.scrollHeight + this.minHeightInput) <= this.maxScroll)
    },
    isMobile() {
      return this.$device.isMobile
    }
  },
  methods: {
    ...mapActions('Objects', ['saveObjData', 'getListObjectsByUserId']),
    ...mapMutations('Tabs', ['setLoadingData']),

    scrollBot() {
      this.$refs.scrollParent.scrollTo({
        top: this.scrollHeight + this.minHeightInput + 20,
        left: 0,
        behavior: 'smooth'
      })
    },
    scrollHeader() {
      const st = this.$refs.scrollParent.scrollTop

      if (!this.showMore) {
        return
      }

      if (st > this.startScroll) {
        // console.log('down')
        this.isMoving = true
      } else if (st < this.startScroll) {
        // console.log('up')
        this.isMoving = false
      }
      this.startScroll = st <= 0 ? 0 : st // For Mobile or negative scrolling
    },
    scrollWindow() {
      setTimeout(() => {
        if (this.$refs.scrollParent) {
          this.maxScroll = this.$refs.scrollParent.scrollHeight
          this.scrollHeight = this.$refs.scrollParent.scrollTop
          this.parentHeight = this.$refs.scrollParent.offsetHeight
        }
      }, 400)
    },
    changeTab() {
      this.scrollWindow()
    },
    async onSave() {
      await this.saveObjData({ id: this.object.id, keys: this.updateProperties })
      // Для обновления списка который прокидываем в SelectObjectStyled
      await this.getListObjectsByUserId(this.getUserId)
      // Для переключения режима редактирования выбора того же селекта
      this.stateSelectEditNameObject = true
      this.closeModal()
    },
    closeModal() {
      this.$emit('close-modal')
    },
    animationSaveBtn() {
      this.animationBtn = true
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
      this.debounceTimeout = setTimeout(() => {
        this.animationBtn = false
      }, 2000)
    },
    setNameField(name) {
      this.object.name = name
      this.updateProperties.name = name
    },
    setStateSelectedEditName() {
      if (!this.stateSelectEditNameObject) {
        this.onSave()
      }
      this.stateSelectEditNameObject = !this.stateSelectEditNameObject
    },
    setField(data) {
      this.object[data.key] = data.value
      this.updateProperties[data.key] = data.value
    },
    setFileField(data) {
      if (!this.object[data.key]) {
        Vue.set(this.object, data.key, [data.value])
      } else {
        this.object[data.key].push(data.value)
      }
      this.updateProperties[data.key] = data.value
    },
    removeFile(data) {
      const index = this.object[data.key].findIndex(file => file.id === data.value)

      if (index !== -1) {
        this.object[data.key].splice(index, 1)
      }
    },
    removeFromGlobal(data) {
      this.removeFile(data)

      this.deletedFile = data.value
    },
    getObjectFromProp() {
      this.object = this.objectData
    },
    async callback(value) {
      if (!value) return false

      this.setLoadingData(true)
      this.object = value

      // Не нужно выставлять текущий объект
      // await this.$store.dispatch("Objects/setCurrentObject", value);

      // TODO: Отрефакторить, но завтра сдаваться
      this.$nextTick(() => {
        this.setLoadingData(false)
      })

      // Событие изменение селекта прокидываем выше
      this.$emit('change-select-object', value)
    },
    setAddressMap(data) {
      this.object.address = data.address
      this.object.lat = data.coords[0]
      this.object.long = data.coords[1]

      this.updateProperties.address = data.address
      this.updateProperties.lat = data.coords[0]
      this.updateProperties.long = data.coords[1]
    }
  },
  destroyed() {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client) {
      window.removeEventListener('scroll', this.scrollWindow)
    }
  }
}
</script>
