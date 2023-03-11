<template>
  <v-container class='object-wrapper-documents__docs__dropzone custom-fields'>
    <div :class='{"dropzone-column": isDropzoneNotEmpty}' class='dropzone-files'>
      <v-autocomplete
        v-model='getFilesFromObject'
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
          <div class='uploaded-image' v-bind='data.attrs'>
            <viewer :options='viewOptions'>
              <img :alt='data.item.alt_image' :src='$store.state.BASE_URL + data.item.full_path'>
            </viewer>

            <div class='uploaded-image__name'>
              {{ data.item.filename }}
            </div>

            <div class='uploaded-image__remove'>
              <v-icon color='#000000' @click='onRemoveFile(data.item.id)'>mdi-trash-can</v-icon>
            </div>

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
          </div>
        </template>
      </v-autocomplete>
    </div>
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
      dropzone_uploaded: [],
      dzData: [],
      loadedImages: [],
      fileCodes: {},
      viewOptions: {
        'movable': false,
        'zoomable': true
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
           return (tab.d_property_objects) ? (tab.d_property_objects.code === 'fail') : [];
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
      return !!this.getFilesFromObject.length
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

<style lang='scss' scoped>
$max-height-image: 100%;
$max-width-image: 220px;

.custom-fields .dropzone-files{
  height: 100%;
  margin: unset;

  .uploaded-image {
    max-height: $max-height-image;
    max-width: $max-width-image;

    img {
      max-height: $max-height-image;
      max-width: $max-width-image;
    }
  }
}
</style>
