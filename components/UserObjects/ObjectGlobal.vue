<template>
  <v-card class='object-wrapper'>
    <div :class='{"object-wrapper-top--mobile": isMobile, "object-wrapper-top--mobile--move": isMoving}'
         class='object-wrapper-top'>
      <div class='object-wrapper-top__selector'>
        <div class='object-wrapper-top__selector__title'>
          <span>Объект:</span>
        </div>

        <div class='object-wrapper-top__selector__select'>
          <SelectObjectStyled
            :custom-style='true'
            :data='object'
            :is-solo='true'
            :item-text='computedText'
            :item-value="'id'"
            :items='listObjects'
            :placeholder="'Выберите объект'"
            title='Выберите объект'
            @update-input='callback'
          />
        </div>
      </div>
      <div class='object-wrapper-top__map'>
        <SelectGeo v-if='notEmptyObject' :data='object' :outerCoords='getCoords' @set-new-address='setAddressMap' />
      </div>
      <div class='object-wrapper-top__share'>
        <v-menu :close-on-content-click='false' left offset-y>
          <template v-slot:activator='{ on, attrs }'>
            <div style='display: inline-flex; grid-column-gap: 5px' v-bind='attrs' v-on='on'>
              Поделиться
              <v-icon
                color='black'
                v-bind='attrs'
                v-on='on'
              >
                mdi-export-variant
              </v-icon>
            </div>
          </template>
          <Collaboration></Collaboration>
        </v-menu>
      </div>
    </div>

    <v-card-text ref='scrollParent'
                 :class='{"object-wrapper-main--mobile": isMobile, "object-wrapper-main--mobile--move": isMoving}'
                 class='object-wrapper-main'
                 style='height: 1200px;'>
      <div ref='docContent' class='object-wrapper-documents'>
        <div class='object-wrapper-documents__img-container'>
          <span>Фото объекта</span>
          <div :class='{"dropzone-empty": ! $store.getters.getMainPhotoObject(object) }' class='list-files-styled-wrapper img-activator'>
            <img v-if='$store.getters.getMainPhotoObject(object)'
                 :src='$store.state.BASE_URL + $store.getters.getMainPhotoObject(object).full_path'
                 :title='$store.getters.getMainPhotoObject(object).title_image'
                 class='img-hover'
                 height='100%'
                 style='object-fit: cover'
                 width='100%'
            >
            <span v-else class='empty-placeholder'>Здесь будут фото вашего объекта</span>
          </div>
        </div>

        <div class='object-wrapper-documents__docs'>
          <span>Прикрепленные документы</span>
          <ListFilesStyled
            :data='object' :id-object='objectData.id'
            @remove-from-global='removeFromGlobal'
          ></ListFilesStyled>
        </div>
      </div>

      <div class='object-wrapper-tabs'>
        <TabsCustom
          ref='tabContent'
          :data-object='object'
          :deleted-file='deletedFile'
          @update-prop='setField'
          @update-file='setFileField'
          @change-tab='changeTab'
          @remove-file='removeFile'
          @focus-out-field='animationSaveBtn'
        />

        <div :class='{"show-more": showMore}' class='more-arrow'>
          <img alt='more' src='@/assets/svg/chevron-more.svg' @click='scrollBot'>
        </div>
      </div>
    </v-card-text>

    <div class='object-wrapper-footer'>
      <template v-if='isMobile'>
        <div class='object-wrapper-footer__left'>
          <ButtonStyled
            :custom-slot='true'
            :is-animation='animationBtn'
            :is-loading='isLoading'
            :is-mobile='true'
            local-class='style_button'
            @click-button='closeModal'
          >
            <v-icon color='#5C856BFF'>mdi-check</v-icon>
          </ButtonStyled>

          <ButtonStyled
            :custom-slot='true'
            :is-mobile='true'
            @click-button='closeModal'
          >
            <v-icon>mdi-download</v-icon>
          </ButtonStyled>
        </div>

        <ButtonStyled
          :custom-slot='true'
          :is-mobile='true'
          local-class='style_close'
          local-text='Отмена'
          @click-button='closeModal'
        >
          <v-icon color='#AF673DFF'>mdi-close</v-icon>
        </ButtonStyled>
      </template>

      <template v-else>
        <div class='object-wrapper-footer__left'>
          <ButtonStyled
            :is-animation='animationBtn'
            :is-loading='isLoading'
            local-class='style_button'
            local-text='Сохранить изменения'
            @click-button='onSave'
          />

          <ButtonStyled
            :custom-slot='true'
            @click-button='closeModal'
          >
          <span>
             Скачать PDF
           </span>
          </ButtonStyled>
        </div>

        <ButtonStyled
          local-class='style_close'
          local-text='Отмена'
          @click-button='closeModal'
        />
      </template>
    </div>
  </v-card>
</template>

<script>
import TabsCustom from '../Common/TabsCustom'
import SelectObjectStyled from '../Common/SelectObjectStyled'
import SelectGeo from '../Common/SelectGeo'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import ButtonStyled from '../Common/ButtonStyled'
import ListFilesStyled from '~/components/Common/ListFilesStyled'
import Vue from 'vue'
import Collaboration from '~/components/Modals/Collaboration'

export default {
  name: 'ObjectGlobal',
  components: { Collaboration, ListFilesStyled, ButtonStyled, SelectGeo, SelectObjectStyled, TabsCustom },
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
    isMoving: false
  }),
  mounted() {
    this.getObjectFromProp()

    if (process.client && this.$refs.scrollParent) {
      const tabContent = this.$refs.scrollParent
      tabContent.addEventListener('scroll', this.scrollWindow)
      if (this.isMobile) {
        tabContent.addEventListener('scroll', this.scrollHeader, false)
      }
      this.scrollWindow()
    }
  },
  watch: {
    'objectData': {
      handler(v) {
        this.object = v
      }
    },
    'getUserId': {
      handler(oldV, newV) {
        if (oldV !== newV && !this.listObjects.length) {
          this.getUserObjects(this.getUserId)
        }
      }
    }
  },
  computed: {
    ...mapState('Objects', ['isLoading', 'listObjects']),
    ...mapGetters(['getUserId']),

    notEmptyObject() {
      return !!Object.keys(this.object).length
    },
    computedText() {
      return !!this.object?.name ? 'name' : 'address'
    },
    getCoords() {
      return this.object?.long && this.object?.lat ? [this.object.lat, this.object.long] : [55.753215, 37.622504]
    },
    showMore() {
      return ((this.parentHeight + this.scrollHeight + this.minHeightInput) <= this.maxScroll)
    },
    isMobile() {
      return this.$device.isMobile
    },
  },
  methods: {
    ...mapActions('Objects', ['saveObjData', 'getUserObjects']),
    ...mapMutations('Tabs', ['setLoadingData']),

    scrollBot() {
      this.$refs.scrollParent.scrollTo({
        top: this.scrollHeight + this.minHeightInput + 20,
        left: 0,
        behavior: 'smooth'
      })
    },
    scrollHeader() {
      let st = this.$refs.scrollParent.scrollTop

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
      let index = this.object[data.key].findIndex(file => file.id === data.value)

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
    callback(value) {
      this.setLoadingData(true)
      this.object = value
      // TODO: Отрефакторить, но завтра сдаваться
      this.$nextTick(() => {
        this.setLoadingData(false)
      })
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
    if (process.client) {
      window.removeEventListener('scroll', this.scrollWindow)
    }
  }
}
</script>
