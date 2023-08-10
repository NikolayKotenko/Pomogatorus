<template>
  <div
    :class="{'dropzone-column': isDropzoneNotEmpty, 'dropzone-question': !objectTemplate}"
    class="dropzone-files"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragover="checkDrop"
    @drop.prevent="onDrop"
  >
    <template v-if="objectTemplate">
      <v-autocomplete
        v-model="sortedDropzone"
        :append-icon="appendIcon"
        :autofocus="isAutofocus"
        :disabled="isDropzoneNotEmpty"
        :flat="isFlat"
        :items="dzData"
        :label="label"
        :loading="isLoading"
        :placeholder="placeholder"
        :prepend-inner-icon="prependIconInner"
        :solo="isSolo"
        dense
        hide-details
        item-value="id"
        multiple
        readonly
        @click="forceDropzone"
        @focus="focusStart"
        @focusout="focusEnd"
      >
        <template #selection="data">
          <div class="uploaded-image" v-bind="data.attrs">
            <div v-if="data.item.type === 'text/plain'" class="img-activator">
              <a :href="$store.state.BASE_URL + data.item.full_path" class="img-container" target="_blank">
                <img
                  :src="require(`~/assets/images/txt_doc_type.png`)"
                  class="img-hover"
                  style="object-fit: contain;"
                >
              </a>
            </div>
            <div v-else-if="data.item.type === 'application/pdf'" class="img-activator">
              <a :href="$store.state.BASE_URL + data.item.full_path" class="img-container" target="_blank">
                <img :src="require(`~/assets/svg/pdf_icon.svg`)" class="img-hover" style="object-fit: contain;">
              </a>
            </div>

            <!-- КОСТЫЛЬ, чтобы передать массив изображений для нашей либы просмотрщика фоток -->
            <template v-else>
              <ViewerStyled
                v-if="data.index === 0"
                :images="onlyImages"
              >
                <div class="uploaded-image__image-container">
                  <div
                    v-for="(image, index) in onlyImages"
                    :key="index"
                    class="uploaded-image__image-container__block img-activator"
                  >
                    <img
                      :alt="image.alt_image"
                      :src="$store.state.BASE_URL + image.full_path"
                      class="list-files-img img-hover"
                    >

                    <div class="uploaded-image__image-container__block__name">
                      {{ image.filename }}
                    </div>

                    <v-tooltip top>
                      <template #activator="{ on, attrs }">
                        <div class="uploaded-image__image-container__block__remove" v-bind="attrs" v-on="on">
                          <v-icon color="#000000" @click="onRemoveFile(image.id)">
                            mdi-trash-can
                          </v-icon>
                        </div>
                      </template>
                      <span>Удалить файл</span>
                    </v-tooltip>

                    <v-overlay
                      :absolute="true"
                      :value="getLoadingImg(image.id)"
                      :z-index="2"
                    >
                      <v-progress-circular
                        v-if="getLoadingImg(image.id)"
                        :indeterminate="true"
                        :size="30"
                        color="#95D7AE"
                        style="margin: auto"
                        width="4"
                      />
                    </v-overlay>
                  </div>
                </div>
              </ViewerStyled>
            </template>

            <template v-if="data.item.type === 'text/plain' || data.item.type === 'application/pdf'">
              <div class="uploaded-image__name">
                {{ data.item.filename }}
              </div>

              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <div class="uploaded-image__remove" v-bind="attrs" v-on="on">
                    <v-icon color="#000000" @click="onRemoveFile(data.item.id)">
                      mdi-trash-can
                    </v-icon>
                  </div>
                </template>
                <span>Удалить файл</span>
              </v-tooltip>

              <v-overlay
                :absolute="true"
                :value="getLoadingImg(data.item.id)"
                :z-index="2"
              >
                <v-progress-circular
                  v-if="getLoadingImg(data.item.id)"
                  :indeterminate="true"
                  :size="30"
                  color="#95D7AE"
                  style="margin: auto"
                  width="4"
                />
              </v-overlay>
            </template>
          </div>
        </template>
      </v-autocomplete>
    </template>
    <dropzone
      id="dropzone"
      ref="dropzone"
      :destroy-dropzone="true"
      :include-styling="false"
      :options="$store.getters.optionsDropzone"
      :use-custom-slot="true"
      @vdropzone-success="successData"
      @vdropzone-sending="sendingData"
    >
      <template v-if="objectTemplate">
        <div ref="dropzoneTemplate" class="dropzone-custom-content">
          <div :class="{'animated': dragging}" class="dropzone-label">
            <v-icon :color="dragging ? 'blue' : '#B3B3B3'" large>
              mdi-cloud-upload
            </v-icon>
            <span :style="dragging ? 'color: #2196F3 ' : ''">{{ computedLabel }}</span>
          </div>
        </div>
      </template>
      <template v-else>
        <div ref="dropzoneTemplate" class="dropzone-custom-content-question">
          <div :class="{'animated': dragging}" class="dropzone-label">
            <v-icon :color="dragging ? 'blue' : '#B3B3B3'" large>
              mdi-cloud-upload
            </v-icon>
            <span :style="dragging ? 'color: #2196F3 ' : ''">{{ computedLabel }}</span>
          </div>
        </div>
      </template>
    </dropzone>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Dropzone from 'nuxt-dropzone'
import ViewerStyled from './ViewerStyled'

import generateUUID from '@/utils/generateUUID'
import _clone from '@/helpers/deepClone'

import 'nuxt-dropzone/dropzone.css'

export default {
  name: 'DropzoneInput',
  components: {
    ViewerStyled,
    Dropzone
  },
  props: {
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
    prependIcon: {
      type: String,
      default: ''
    },
    idObject: {
      type: [Number, String],
      required: true
    },
    idAnswer: {
      type: [Number, String],
      default: 0
    },
    idProperty: {
      type: [Number, String],
      default: null
    },
    objectTemplate: {
      type: Boolean,
      default: true
    },
    questionType: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dzData: [],
    dropzone_uploaded: [],
    loadedImages: [],
    dragging: false
  }),
  computed: {
    isDropzoneNotEmpty() {
      return !!this.dropzone_uploaded.length
    },
    computedLabel() {
      return this.isDropzoneNotEmpty ? 'Загрузить еще' : 'Загрузить файлы'
    },
    onlyImages() {
      return this.dropzone_uploaded.filter(elem => elem.type === 'image/jpeg' || elem.type === 'image/png').sort((a, b) => {
        if (parseInt(a.id) > parseInt(b.id)) {
          return -1
        } else {
          return 1
        }
      })
    },
    sortedDropzone() {
      const dropzoneFiles = this.dropzone_uploaded.slice()
      return dropzoneFiles.sort((a, b) => {
        if (a.type === 'image/jpeg' || a.type === 'image/png') {
          return -1
        } else {
          return 1
        }
      })
    }
  },
  methods: {
    ...mapActions(['addFile']),
    ...mapActions('Tabs', ['removeFile']),

    checkDropZoneFiles() {
      if (Array.isArray(this.data) && this.data.length) {
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
      if (!this.questionType) {
        formData.append('id_object', parseInt(this.idObject))
      } else {
        formData.append('id_answer', parseInt(this.idAnswer))
      }
      if (this.idProperty) {
        formData.append('id_object_property', parseInt(this.idProperty))
      }

      if (this.codeProperty === 'osnovnoe-foto-obekta') {
        formData.append('main_photo_object', true)
      }

      setTimeout(() => {
        this.dragging = false
      }, 300)
    },
    successData(file, response) {
      const formatObj = Object.assign({}, response.data)
      this.dzData.push(formatObj)
      this.dropzone_uploaded.push(formatObj)

      this.$emit('uploaded-file', { data: formatObj, index: this.dropzone_uploaded.length - 1 })
    },
    async onRemoveFile(id) {
      this.loadedImages.push(id)

      await this.removeFile(id)
        .then(() => {
          const index = this.dropzone_uploaded.findIndex(elem => elem.id === id)
          if (index !== -1) {
            this.dropzone_uploaded.splice(index, 1)
            this.$emit('remove-file', id)
          }
        })
        .finally(() => {
          const index = this.dropzone_uploaded.findIndex(elem => elem.id === id)
          if (index !== -1) {
            this.loadedImages.splice(index, 1)
          }
        })
    },
    getLoadingImg(id) {
      return this.loadedImages.includes(id)
    },
    async onDrop(e) {
      e.preventDefault()

      setTimeout(() => {
        this.dragging = false
      }, 300)

      const files = e.target.files || e.dataTransfer.files

      if (files.length) {
        for (const file of files) {
          const query = {}

          query.uuid = generateUUID()
          query.file = file
          query.codeProperty = this.codeProperty

          if (this.questionType) {
            query.id_answer = parseInt(this.idAnswer) ?? null
          } else {
            query.id_object = parseInt(this.idObject)
            query.id_object_property = this.idProperty ? parseInt(this.idProperty) : null
          }

          const data = await this.addFile(query)

          if (data) {
            const formatObj = Object.assign({}, data.data)
            this.dzData.push(formatObj)
            this.dropzone_uploaded.push(formatObj)
            this.$refs.dropzone.manuallyAddFile(formatObj, this.$store.state.BASE_URL + formatObj.full_path)

            this.$emit('uploaded-file', { data: formatObj, index: this.dropzone_uploaded.length - 1 })
          }
        }

        this.dragging = false
      }
    },
    checkDrop(e) {
      if (e) {
        e.preventDefault()
      }
    },
    onDragEnter(e) {
      this.dragging = true
    },
    onDragLeave(e) {
      if (!this.dragging) {
        this.dragging = true
      }

      if (e.currentTarget.contains(e.relatedTarget)) {
        return
      }

      this.dragging = false
    },

    focusStart() {
      this.isFocused = true
      this.$emit('focus-in')
    },
    focusEnd() {
      this.isFocused = false
      this.$emit('focus-out')
    }
  }
}
</script>
