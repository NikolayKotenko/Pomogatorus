<template>
  <div
    :class='{"input-file-padding": (type === "fail" && dropzone_uploaded.length > 2)}'
    class='tab-content__input'>
    <div :class='{"custom-fields-padding": (type === "fail" && dropzone_uploaded.length > 2)}' class='custom-fields'>
      <template v-if='type === "cislo"'>
        <v-text-field
          v-model='currentData'
          :append-icon='appendIcon'
          :autofocus='isAutofocus'
          :disabled='isDisabled'
          :flat='isFlat'
          :label='label'
          :loading='isLoading'
          :placeholder='placeholder'
          :prepend-inner-icon='prependIconInner'
          :readonly='isReadonly'
          :solo='isSolo'
          dense
          hide-details
          type='number'
          @click='onClick'
          @focus='focusStart'
          @focusout='focusEnd'
        />
      </template>

      <template v-else-if='type === "stroka"'>
        <v-textarea
          v-model='currentData'
          :append-icon='appendIcon'
          :autofocus='isAutofocus'
          :clearable='isClearable'
          :disabled='isDisabled'
          :flat='isFlat'
          :hide-details='!currentRules.length'
          :label='label'
          :loading='isLoading'
          :multi-line='multiLine'
          :outlined='isOutlined'
          :placeholder='placeholder'
          :prepend-icon='prependIcon'
          :prepend-inner-icon='prependIconInner'
          :readonly='isReadonly'
          :required='isRequired'
          :rows='rowsCount'
          :rules='currentRules'
          :solo='isSolo'
          :type='typeData'
          auto-grow
          dense
          hide-details
          row-height='25'
          @click='onClick'
          @focus='focusStart'
          @focusout='focusEnd'
        />
      </template>

      <template v-else-if='type === "fail"'>
        <div :class='{"dropzone-column": isDropzoneNotEmpty}' class='dropzone-files'>
          <v-autocomplete
            v-model='dropzone_uploaded'
            :append-icon='appendIcon'
            :autofocus='isAutofocus'
            :disabled='isDropzoneNotEmpty'
            :flat='isFlat'
            :items='dzData'
            :label='label'
            :loading='isLoading'
            :placeholder='placeholder'
            :prepend-inner-icon='prependIconInner'
            :solo='isSolo'
            dense
            hide-details
            item-value='id'
            multiple
            readonly
            @click='forceDropzone'
            @focus='focusStart'
            @focusout='focusEnd'
          >
            <template v-slot:selection='data'>
              <div class='uploaded-image' v-bind='data.attrs'>
                <div v-if="data.item.type === 'text/plain'">
                  <a :href='$store.state.BASE_URL + data.item.full_path' target='_blank'>
                    <img :src='require(`~/assets/images/txt_doc_type.png`)' style='object-fit: contain;' />
                  </a>
                </div>
                <div v-else-if="data.item.type === 'application/pdf'">
                  <a :href='$store.state.BASE_URL + data.item.full_path' target='_blank'>
                    <img :src='require(`~/assets/svg/pdf_icon.svg`)' style='object-fit: contain;' />
                  </a>
                </div>

                <!-- КОСТЫЛЬ, чтобы передать массив изображений для нашей либы просмотрщика фоток -->
                <template v-else>
                  <viewer v-if='data.index === 0' :images='onlyImages' :options='viewOptions'
                          class='uploaded-image__image-container'>
                    <div v-for='(image, index) in onlyImages' :key='index'
                         class='uploaded-image__image-container__block'>
                      <img :alt='image.alt_image'
                           :src='$store.state.BASE_URL + image.full_path'
                           class='list-files-img'>

                      <div class='uploaded-image__image-container__block__name'>
                        {{ image.filename }}
                      </div>

                      <v-tooltip top>
                        <template v-slot:activator='{ on, attrs }'>
                          <div class='uploaded-image__image-container__block__remove' v-bind='attrs' v-on='on'>
                            <v-icon color='#000000' @click='onRemoveFile(image.id)'>mdi-trash-can</v-icon>
                          </div>
                        </template>
                        <span>Удалить файл</span>
                      </v-tooltip>

                      <v-overlay
                        :absolute='true'
                        :value='getLoadingImg(image.id)'
                        :z-index='2'
                      >
                        <v-progress-circular
                          v-if='getLoadingImg(image.id)'
                          :indeterminate='true'
                          :size='30'
                          color='#95D7AE'
                          style='margin: auto'
                          width='4'
                        ></v-progress-circular>
                      </v-overlay>
                    </div>
                  </viewer>
                </template>

                <template v-if="data.item.type === 'text/plain' || data.item.type === 'application/pdf'">
                  <div class='uploaded-image__name'>
                    {{ data.item.filename }}
                  </div>

                  <v-tooltip top>
                    <template v-slot:activator='{ on, attrs }'>
                      <div class='uploaded-image__remove' v-bind='attrs' v-on='on'>
                        <v-icon color='#000000' @click='onRemoveFile(data.item.id)'>mdi-trash-can</v-icon>
                      </div>
                    </template>
                    <span>Удалить файл</span>
                  </v-tooltip>

                  <v-overlay
                    :absolute='true'
                    :value='getLoadingImg(data.item.id)'
                    :z-index='2'
                  >
                    <v-progress-circular
                      v-if='getLoadingImg(data.item.id)'
                      :indeterminate='true'
                      :size='30'
                      color='#95D7AE'
                      style='margin: auto'
                      width='4'
                    ></v-progress-circular>
                  </v-overlay>
                </template>
              </div>
            </template>
          </v-autocomplete>
          <dropzone
            id='dropzone'
            ref='dropzone'
            :destroyDropzone='true'
            :include-styling='false'
            :options='$store.getters.optionsDropzone'
            :useCustomSlot='true'
            @vdropzone-success='successData'
            @vdropzone-sending='sendingData'
          >
            <div ref='dropzoneTemplate' class='dropzone-custom-content'>
              <!--              <div v-if='isDropzoneNotEmpty' class='separator'></div>-->
              <div class='dropzone-label'>
                <v-icon color='#B3B3B3' large>mdi-cloud-upload</v-icon>
                <span>{{ computedLabel }}</span>
              </div>
            </div>
          </dropzone>
        </div>
      </template>

      <template v-else-if='type === "vybor-iz-spravocnika"'>
        <v-select
          v-model='currentData'
          :append-icon='appendIcon'
          :autofocus='isAutofocus'
          :clearable='isClearable'
          :disabled='isDisabled'
          :flat='isFlat'
          :hide-details='!currentRules.length'
          :items='items'
          :label='label'
          :loading='isLoading'
          :menu-props='{
            closeOnContentClick: true,
            bottom: true,
            offsetY: true,
          }'
          :outlined='isOutlined'
          :placeholder='placeholder'
          :prepend-icon='prependIcon'
          :prepend-inner-icon='prependIconInner'
          :readonly='isReadonly'
          :rules='currentRules'
          :solo='isSolo'
          dense
          hide-details
          item-text='value'
          item-value='code'
          @click='onClick'
          @focus='focusStart'
          @focusout='focusEnd'
        >
          <template v-slot:append>
            <template v-if='!isFocused'>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
            <template v-else>
              <v-icon>mdi-minus</v-icon>
            </template>
          </template>
        </v-select>
      </template>
    </div>
  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import { mapActions, mapState } from 'vuex'
import _clone from '@/helpers/deepClone'

import Vue from 'vue'
import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.use(VueViewer)

export default {
  components: {
    Dropzone
  },
  name: 'CustomField',
  props: {
    type: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      default: () => ([])
    },
    deletedFile: {
      type: [Number, String],
      default: 0
    },

    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    codeProperty: {
      type: String,
      default: ''
    },
    isSolo: {
      type: Boolean,
      default: false
    },
    data: {
      type: [String, Array, Number],
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isAutofocus: {
      type: Boolean,
      default: false
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    appendIcon: {
      type: String,
      default: ''
    },
    prependIconInner: {
      type: String,
      default: ''
    },
    isFlat: {
      type: Boolean,
      default: false
    },
    rowsCount: {
      type: String,
      default: '1'
    },
    multiLine: {
      type: Boolean,
      default: false
    },
    prependIcon: {
      type: String,
      default: ''
    },
    typeData: {
      type: String,
      default: 'text'
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    isClearable: {
      type: Boolean,
      default: false
    },
    itemText: {
      type: String,
      default: ''
    },
    itemValue: {
      type: String,
      default: ''
    },
    currentRules: {
      type: Array,
      default: () => ([])
    },
    isOutlined: {
      type: Boolean,
      default: false
    },
    indexArray: {
      type: Number
    },
    idObject: {
      type: [Number, String],
      required: true
    },
    idProperty: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      internalData: '',
      isFocused: false,
      dzData: [],
      dropzone_uploaded: [],
      loadedImages: [],
      viewOptions: {
        'movable': false,
        'zoomable': true,
        'rotatable': false,
        'scalable': false
      }
    }
  },
  mounted() {
    this.checkDropZoneFiles()
  },
  watch: {
    'deletedFile': {
      handler(newV, oldV) {
        if (newV !== oldV) {
          let index = this.dropzone_uploaded.findIndex(elem => elem.id === newV)
          if (index !== -1) {
            this.dropzone_uploaded.splice(index, 1)
          }
        }
      }
    }
  },
  computed: {
    ...mapState('Tabs', ['inputTypes']),

    isDropzoneNotEmpty() {
      return !!this.dropzone_uploaded.length
    },
    computedLabel() {
      return this.isDropzoneNotEmpty ? 'Загрузить еще' : 'Загрузить файлы'
    },

    currentData: {
      get() {
        if (this.data) {
          return this.data
        }
        return this.internalData
      },
      set(value) {
        if (!this.data) {
          this.internalData = value
        }
        this.$emit('update-field', value)
      }
    },
    onlyImages() {
      return this.dropzone_uploaded.filter(elem => elem.type === 'image/jpeg' || elem.type === 'image/png')
    }
  },
  methods: {
    ...mapActions('Tabs', ['removeFile']),

    onClick() {
      this.$emit('on-click')
    },
    focusStart() {
      this.isFocused = true
      this.$emit('focus-in')
    },
    focusEnd() {
      this.isFocused = false
      this.$emit('focus-out')
    },

    /* DROPZONE */
    checkDropZoneFiles() {
      if (this.type === 'fail' && Array.isArray(this.data) && this.data.length) {
        this.getDropzoneData()
      }
    },
    getDropzoneData() {
      this.$nextTick(() => {

        this.dropzone_uploaded = this.data.map(file => {
          return _clone(file)
        })
        this.dzData = this.data.map(file => {
          return _clone(file)
        })

        this.dropzone_uploaded.forEach(file => {
          this.$refs.dropzone.manuallyAddFile(file, this.$store.state.BASE_URL + file.full_path)
        })
      })
    },
    forceDropzone() {
      if (!this.isDropzoneNotEmpty) {
        this.$refs.dropzoneTemplate.click()
      }
    },
    sendingData(file, xhr, formData) {
      formData.append('uuid', file.upload.uuid)
      formData.append('id_object', parseInt(this.idObject))
      formData.append('id_object_property', parseInt(this.idProperty))

      if (this.codeProperty === 'osnovnoe-foto-obekta') {
        formData.append('main_photo_object', true)
      }
    },
    successData(file, response) {
      console.log('successData', response)
      const formatObj = Object.assign({}, response.data)
      this.dzData.push(formatObj)
      this.dropzone_uploaded.push(formatObj)

      this.$emit('uploaded-file', { data: formatObj, index: this.dropzone_uploaded.length - 1 })
    },
    async onRemoveFile(id) {
      this.loadedImages.push(id)

      await this.removeFile(id)
        .then(() => {
          let index = this.dropzone_uploaded.findIndex(elem => elem.id === id)
          if (index !== -1) {
            this.dropzone_uploaded.splice(index, 1)
            this.$emit('remove-file', id)
          }
        })
        .finally(() => {
          let index = this.dropzone_uploaded.findIndex(elem => elem.id === id)
          if (index !== -1) {
            this.loadedImages.splice(index, 1)
          }
        })
    },
    getLoadingImg(id) {
      return this.loadedImages.includes(id)
    }
  }
}
</script>

