<template>
  <v-container
    :class='{"dropzone-empty": !isDropzoneNotEmpty}'
    class='list-files-styled files-dashed-border'
  >
    <div v-if='isDropzoneNotEmpty' class='dropzone-files'>
      <v-autocomplete
        v-model='sortedDropzone'
        :append-icon='appendIcon'
        :autofocus='isAutofocus'
        :disabled='isDropzoneNotEmpty'
        :flat='isFlat'
        :items='getFilesFromObject'
        :label='label'
        :loading='isLoading'
        :placeholder='placeholder'
        :prepend-inner-icon='prependIconInner'
        :solo='isSolo'
        dense
        hide-details
        multiple
        readonly
      >
        <template v-slot:selection='data'>
          <div v-if='data.item.main_photo_object === false' class='uploaded-image' v-bind='data.attrs'>

            <div v-if="data.item.type === 'text/plain'" class='img-activator'>
              <a :href='$store.state.BASE_URL + data.item.full_path' class='img-container' target='_blank'>
                <img :src='require(`~/assets/images/txt_doc_type.png`)' class='img-hover'
                     style='object-fit: contain;' />
              </a>
            </div>
            <div v-else-if="data.item.type === 'application/pdf'" class='img-activator'>
              <a :href='$store.state.BASE_URL + data.item.full_path' class='img-container' target='_blank'>
                <img :src='require(`~/assets/svg/pdf_icon.svg`)' class='img-hover' style='object-fit: contain;' />
              </a>
            </div>

            <!-- КОСТЫЛЬ, чтобы передать массив изображений для нашей либы просмотрщика фоток -->
            <template v-else>
              <!-- TODO: вынести в отедльный компонент, если понадобиться хоть еще где-то -->
              <viewer v-if='data.index === 0' :images='onlyImages' :options='viewOptions'
                      class='uploaded-image__image-container'>
                <div v-for='(image, index) in onlyImages' :key='index'
                     class='uploaded-image__image-container__block img-activator'>
                  <img :alt='image.alt_image'
                       :src='$store.state.BASE_URL + image.full_path'
                       class='list-files-img img-hover'>

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
    </div>
    <span v-else class='empty-placeholder'>Здесь будут прикрепленные документы вашего объекта</span>
  </v-container>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import { mapActions, mapState } from 'vuex'

import Vue from 'vue'
import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.use(VueViewer)

export default {
  name: 'ListFilesStyled',
  components: {
    Dropzone
  },
  props: {
    idObject: {
      type: [Number, String],
      required: true
    },
    data: {
      type: Object,
      required: true
    },

    appendIcon: {
      type: String,
      default: ''
    },
    isAutofocus: {
      type: Boolean,
      default: false
    },
    isFlat: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    prependIconInner: {
      type: String,
      default: ''
    },
    isSolo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loadedImages: [],
      fileCodes: {},
      viewOptions: {
        'movable': false,
        'zoomable': true,
        'rotatable': false,
        'scalable': false
      }
    }
  },
  computed: {
    ...mapState('Tabs', ['allTabData']),

    getFilesTabs() {
      if (!this.allTabData || !this.allTabData.length) {
        return []
      }

      return this.allTabData.filter(tab => {
        return (tab.d_property_objects) ? (tab.d_property_objects.code === 'fail') : []
      })
    },
    getFilesFromObject() {
      if (!this.data || !Object.keys(this.data).length) {
        return []
      }

      let result = []
      this.getFilesTabs.forEach(tab => {
        if (this.data[tab.code] && Object.keys(this.data[tab.code]).length) {
          this.data[tab.code].forEach(file => {
            result.push(file)
            this.fileCodes[file.id] = tab.code
          })
        }
      })
      return result
    },
    isDropzoneNotEmpty() {
      if (!this.getFilesFromObject.length) return false

      return this.getFilesFromObject.some((object) => {
        return object.main_photo_object === false
      })
    },

    onlyImages() {
      return this.getFilesFromObject.filter(elem => elem.type === 'image/jpeg' || elem.type === 'image/png').sort((a, b) => {
        if (parseInt(a.id) > parseInt(b.id)) {
          return -1
        } else {
          return 1
        }
      })
    },
    sortedDropzone() {
      return this.getFilesFromObject.sort((a, b) => {
        if (a.type === 'image/jpeg' || a.type === 'image/png') {
          return -1
        } else {
          return 1
        }
      })
    }
  },
  methods: {
    ...mapActions('Tabs', ['removeFile']),

    async onRemoveFile(id) {
      this.loadedImages.push(id)

      await this.removeFile(id)
        .then(() => {
          let code = this.fileCodes[id]
          this.$emit('remove-from-global', { key: code, value: id })
        })
        .finally(() => {
          let index = this.loadedImages.findIndex(elem => elem === id)
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

<style lang='scss'>
</style>
