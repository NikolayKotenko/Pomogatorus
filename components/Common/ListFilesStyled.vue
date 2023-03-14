<template>
  <v-container
    class='list-files-styled files-dashed-border'
    :class='{"dropzone-empty": !isDropzoneNotEmpty}'
  >
    <div class='dropzone-files' v-if="isDropzoneNotEmpty">
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

            <div v-if="data.item.type === 'text/plain'">
              <a :href="$store.state.BASE_URL + data.item.full_path" target="_blank">
                <img style="object-fit: contain;" :src='require(`~/assets/images/txt_doc_type.png`)' />
              </a>
            </div>
            <div v-if="data.item.type === 'application/pdf'">
              <a :href="$store.state.BASE_URL + data.item.full_path" target="_blank">
                <img style="object-fit: contain;" :src='require(`~/assets/svg/pdf_icon.svg`)' />
              </a>
            </div>
            <viewer v-if="data.item.type === 'image/png'" :options='viewOptions'>
              <img :alt='data.item.alt_image' :src='$store.state.BASE_URL + data.item.full_path' class='list-files-img'>
            </viewer>

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
          </div>
        </template>
      </v-autocomplete>
    </div>
    <span v-else class="empty-placeholder">Здесь будут прикрепленные документы вашего объекта</span>
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

<style lang='scss'>
$height-image: 186px;
$width-image: 263px;

.list-files-styled {
  height: 246px;
  padding-bottom: 15px;

  .dropzone-files {
    height: 100%;
    margin: unset;
    overflow-x: overlay;
    /* width */
    &::-webkit-scrollbar {
      width: 10px;
      height: 12px;
    }
    /* Track */
    &::-webkit-scrollbar-track {
      background: #FFFFFF;
      border: unset;
      box-shadow: unset;
    }
    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #BABABA;
      border-radius: 2px;
      width: 100px;
    }
    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: darken(#BABABA, 5%);
    }


    .uploaded-image {
      max-height: 188px;
      position: relative;
      cursor: pointer;

      img {
        float: left;
        object-fit: cover;
        height: $height-image;
        width: $width-image;
      }

      .list-files-img {
      }

      &__remove {
        position: absolute;
        top: 0;
        right: 0;
        opacity: 0.5;
        transition: all 0.4s ease-in-out;
        background: white;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.4);
        padding: 5px;

        &:hover {
          opacity: 1;
          transform: scale(1.1);
        }

        .v-icon {
          margin: 0;
        }
      }

      &__name {
        height: 45px;
        position: absolute;
        bottom: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.6);
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
        opacity: 0;
        transform: translateY(5px);
        transition: all 0.4s ease-in-out;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: black;
      }

      &:hover .uploaded-image__name {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .v-input{
      margin: unset;
    }
    .v-select__selections {
      display: inline-flex;
      flex-wrap: nowrap;
      grid-column-gap: 1em;

    }
  }

  &.dropzone-empty{
    background: rgba(217, 217, 217, 1);
    .empty-placeholder{
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;

      font-size: 1.3em;
      text-align: center;
      color: #000000;
    }
  }
}
</style>
