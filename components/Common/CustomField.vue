<template>
  <div
    :class="{'input-file-padding': (type === 'fail' && dropzone_uploaded.length > 2)}"
    class="tab-content__input"
  >
    <div
      ref="customField"
      :class="{'custom-fields-padding': (type === 'fail' && dropzone_uploaded.length > 2)}"
      class="custom-fields"
    >
      <template v-if="type === 'cislo'">
        <v-text-field
          v-model="currentData"
          :append-icon="appendIcon"
          :autofocus="isAutofocus"
          :disabled="isDisabled"
          :flat="isFlat"
          :label="label"
          :loading="isLoading"
          :placeholder="placeholder"
          :prepend-inner-icon="prependIconInner"
          :readonly="isReadonly"
          :solo="isSolo"
          dense
          outlined
          hide-details
          type="number"
          @click="onClick"
          @focus="focusStart"
          @focusout="focusEnd"
        />
      </template>

      <template v-else-if="type === 'stroka'">
        <v-textarea
          v-model="currentData"
          :append-icon="appendIcon"
          :autofocus="isAutofocus"
          :clearable="isClearable"
          :disabled="isDisabled"
          :flat="isFlat"
          :hide-details="!currentRules.length"
          :label="label"
          :loading="isLoading"
          :multi-line="multiLine"
          :outlined="isOutlined"
          :placeholder="placeholder"
          :prepend-icon="prependIcon"
          :prepend-inner-icon="prependIconInner"
          :readonly="isReadonly"
          :required="isRequired"
          :rows="rowsCount"
          :rules="currentRules"
          :solo="isSolo"
          :type="typeData"
          auto-grow
          dense
          @click="onClick"
          @focus="focusStart"
          @focusout="focusEnd"
        />
      </template>

      <!--      <template v-else-if="type === 'fail'"> -->
      <!--        <div -->
      <!--          :class="{'dropzone-column': isDropzoneNotEmpty}" -->
      <!--          class="dropzone-files" -->
      <!--          @dragenter="onDragEnter" -->
      <!--          @dragleave="onDragLeave" -->
      <!--          @dragover="checkDrop" -->
      <!--          @drop.prevent="onDrop" -->
      <!--        > -->
      <!--          <v-autocomplete -->
      <!--            v-model="sortedDropzone" -->
      <!--            :append-icon="appendIcon" -->
      <!--            :autofocus="isAutofocus" -->
      <!--            :disabled="isDropzoneNotEmpty" -->
      <!--            :flat="isFlat" -->
      <!--            :items="dzData" -->
      <!--            :label="label" -->
      <!--            :loading="isLoading" -->
      <!--            :placeholder="placeholder" -->
      <!--            :prepend-inner-icon="prependIconInner" -->
      <!--            :solo="isSolo" -->
      <!--            outlined -->
      <!--            dense -->
      <!--            hide-details -->
      <!--            item-value="id" -->
      <!--            multiple -->
      <!--            readonly -->
      <!--            @click="forceDropzone" -->
      <!--            @focus="focusStart" -->
      <!--            @focusout="focusEnd" -->
      <!--          > -->
      <!--            <template #selection="data"> -->
      <!--              <div class="uploaded-image" v-bind="data.attrs"> -->
      <!--                <div v-if="data.item.type === 'text/plain'" class="img-activator"> -->
      <!--                  <a :href="$store.state.BASE_URL + data.item.full_path" class="img-container" target="_blank"> -->
      <!--                    <img -->
      <!--                      :src="require(`~/assets/images/txt_doc_type.png`)" -->
      <!--                      class="img-hover" -->
      <!--                      style="object-fit: contain;" -->
      <!--                    > -->
      <!--                  </a> -->
      <!--                </div> -->
      <!--                <div v-else-if="data.item.type === 'application/pdf'" class="img-activator"> -->
      <!--                  <a :href="$store.state.BASE_URL + data.item.full_path" class="img-container" target="_blank"> -->
      <!--                    <img :src="require(`~/assets/svg/pdf_icon.svg`)" class="img-hover" style="object-fit: contain;"> -->
      <!--                  </a> -->
      <!--                </div> -->

      <!--                &lt;!&ndash; КОСТЫЛЬ, чтобы передать массив изображений для нашей либы просмотрщика фоток &ndash;&gt; -->
      <!--                <template v-else> -->
      <!--                  <ViewerStyled -->
      <!--                    v-if="data.index === 0" -->
      <!--                    :images="onlyImages" -->
      <!--                    :options="viewOptions" -->
      <!--                  > -->
      <!--                    <div class="uploaded-image__image-container"> -->
      <!--                      <div -->
      <!--                        v-for="(image, index) in onlyImages" -->
      <!--                        :key="index" -->
      <!--                        class="uploaded-image__image-container__block img-activator" -->
      <!--                      > -->
      <!--                        <img -->
      <!--                          :alt="image.alt_image" -->
      <!--                          :src="$store.state.BASE_URL + image.full_path" -->
      <!--                          class="list-files-img img-hover" -->
      <!--                        > -->

      <!--                        <div class="uploaded-image__image-container__block__name"> -->
      <!--                          {{ image.filename }} -->
      <!--                        </div> -->

      <!--                        <v-tooltip top> -->
      <!--                          <template #activator="{ on, attrs }"> -->
      <!--                            <div class="uploaded-image__image-container__block__remove" v-bind="attrs" v-on="on"> -->
      <!--                              <v-icon color="#000000" @click="onRemoveFile(image.id)"> -->
      <!--                                mdi-trash-can -->
      <!--                              </v-icon> -->
      <!--                            </div> -->
      <!--                          </template> -->
      <!--                          <span>Удалить файл</span> -->
      <!--                        </v-tooltip> -->

      <!--                        <v-overlay -->
      <!--                          :absolute="true" -->
      <!--                          :value="getLoadingImg(image.id)" -->
      <!--                          :z-index="2" -->
      <!--                        > -->
      <!--                          <v-progress-circular -->
      <!--                            v-if="getLoadingImg(image.id)" -->
      <!--                            :indeterminate="true" -->
      <!--                            :size="30" -->
      <!--                            color="#95D7AE" -->
      <!--                            style="margin: auto" -->
      <!--                            width="4" -->
      <!--                          /> -->
      <!--                        </v-overlay> -->
      <!--                      </div> -->
      <!--                    </div> -->
      <!--                  </ViewerStyled> -->
      <!--                </template> -->

      <!--                <template v-if="data.item.type === 'text/plain' || data.item.type === 'application/pdf'"> -->
      <!--                  <div class="uploaded-image__name"> -->
      <!--                    {{ data.item.filename }} -->
      <!--                  </div> -->

      <!--                  <v-tooltip top> -->
      <!--                    <template #activator="{ on, attrs }"> -->
      <!--                      <div class="uploaded-image__remove" v-bind="attrs" v-on="on"> -->
      <!--                        <v-icon color="#000000" @click="onRemoveFile(data.item.id)"> -->
      <!--                          mdi-trash-can -->
      <!--                        </v-icon> -->
      <!--                      </div> -->
      <!--                    </template> -->
      <!--                    <span>Удалить файл</span> -->
      <!--                  </v-tooltip> -->

      <!--                  <v-overlay -->
      <!--                    :absolute="true" -->
      <!--                    :value="getLoadingImg(data.item.id)" -->
      <!--                    :z-index="2" -->
      <!--                  > -->
      <!--                    <v-progress-circular -->
      <!--                      v-if="getLoadingImg(data.item.id)" -->
      <!--                      :indeterminate="true" -->
      <!--                      :size="30" -->
      <!--                      color="#95D7AE" -->
      <!--                      style="margin: auto" -->
      <!--                      width="4" -->
      <!--                    /> -->
      <!--                  </v-overlay> -->
      <!--                </template> -->
      <!--              </div> -->
      <!--            </template> -->
      <!--          </v-autocomplete> -->
      <!--          <dropzone -->
      <!--            id="dropzone" -->
      <!--            ref="dropzone" -->
      <!--            :destroy-dropzone="true" -->
      <!--            :include-styling="false" -->
      <!--            :options="$store.getters.optionsDropzone" -->
      <!--            :use-custom-slot="true" -->
      <!--            @vdropzone-success="successData" -->
      <!--            @vdropzone-sending="sendingData" -->
      <!--          > -->
      <!--            <div ref="dropzoneTemplate" class="dropzone-custom-content"> -->
      <!--              &lt;!&ndash;              <div v-if='isDropzoneNotEmpty' class='separator'></div> &ndash;&gt; -->
      <!--              <div :class="{'animated': dragging}" class="dropzone-label"> -->
      <!--                <v-icon :color="dragging ? 'blue' : '#B3B3B3'" large> -->
      <!--                  mdi-cloud-upload -->
      <!--                </v-icon> -->
      <!--                <span :style="dragging ? 'color: #2196F3 ' : ''">{{ computedLabel }}</span> -->
      <!--              </div> -->
      <!--            </div> -->
      <!--          </dropzone> -->
      <!--        </div> -->
      <!--      </template> -->

      <template v-else-if="type === 'vybor-iz-spravocnika'">
        <v-select
          v-model="currentData"
          :append-icon="appendIcon"
          :autofocus="isAutofocus"
          :clearable="isClearable"
          :disabled="isDisabled"
          :flat="isFlat"
          :hide-details="!currentRules.length"
          :items="items"
          :label="label"
          :loading="isLoading"
          :menu-props="{
            closeOnContentClick: true,
            bottom: true,
            offsetY: true,
          }"
          :outlined="isOutlined"
          :placeholder="placeholder"
          :prepend-icon="prependIcon"
          :prepend-inner-icon="prependIconInner"
          :readonly="isReadonly"
          :rules="currentRules"
          :solo="isSolo"
          dense
          item-text="value"
          item-value="name"
          @click="onClick"
          @focus="focusStart"
          @focusout="focusEnd"
        >
          <template #append>
            <template v-if="!isFocused">
              <v-icon>mdi-chevron-down</v-icon>
            </template>
            <template v-else>
              <v-icon>mdi-minus</v-icon>
            </template>
          </template>
          <template #no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Не найдено заполненных параметров справочника</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
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
import generateUUID from '../../utils/generateUUID'
import ViewerStyled from './ViewerStyled'
import _clone from '@/helpers/deepClone'

export default {
  name: 'CustomField',
  components: {
    ViewerStyled,
    Dropzone
  },
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
      default: true
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
      },
      dragging: false
    }
  },
  watch: {
    'deletedFile': {
      handler(newV, oldV) {
        if (newV !== oldV) {
          const index = this.dropzone_uploaded.findIndex(elem => elem.id === newV)
          if (index !== -1) {
            this.dropzone_uploaded.splice(index, 1)
          }
        }
      }
    },
    'dragging': {
      handler(v) {
        if (v) {
          this.$refs.customField.style.setProperty(
            '--border-color',
            '#2196F3'
          )
        } else {
          this.$refs.customField.style.setProperty(
            '--border-color',
            '#B3B3B3'
          )
        }
      }
    }
  },
  mounted() {
    // this.checkDropZoneFiles()
  },
  computed: {
    ...mapState('Tabs', ['inputTypes']),

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
    // onlyImages() {
    //   return this.dropzone_uploaded.filter(elem => elem.type === 'image/jpeg' || elem.type === 'image/png').sort((a, b) => {
    //     if (parseInt(a.id) > parseInt(b.id)) {
    //       return -1
    //     } else {
    //       return 1
    //     }
    //   })
    // },
    // sortedDropzone() {
    //   const dropzoneFiles = this.dropzone_uploaded.slice()
    //   return dropzoneFiles.sort((a, b) => {
    //     if (a.type === 'image/jpeg' || a.type === 'image/png') {
    //       return -1
    //     } else {
    //       return 1
    //     }
    //   })
    // }
  },
  methods: {
    ...mapActions('Tabs', ['removeFile']),
    ...mapActions(['addFile']),

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
    // checkDropZoneFiles() {
    //   if (this.type === 'fail' && Array.isArray(this.data) && this.data.length) {
    //     this.getDropzoneData()
    //   }
    // },
    // getDropzoneData() {
    //   this.$nextTick(() => {
    //
    //     this.dropzone_uploaded = this.data.map(file => {
    //       return _clone(file)
    //     })
    //     this.dzData = this.data.map(file => {
    //       return _clone(file)
    //     })
    //
    //     this.dropzone_uploaded.forEach(file => {
    //       this.$refs.dropzone.manuallyAddFile(file, this.$store.state.BASE_URL + file.full_path)
    //     })
    //   })
    // },
    // forceDropzone() {
    //   if (!this.isDropzoneNotEmpty) {
    //     this.$refs.dropzoneTemplate.click()
    //   }
    // },
    // sendingData(file, xhr, formData) {
    //   formData.append('uuid', file.upload.uuid)
    //   formData.append('id_object', parseInt(this.idObject))
    //   formData.append('id_object_property', parseInt(this.idProperty))
    //
    //   if (this.codeProperty === 'osnovnoe-foto-obekta') {
    //     formData.append('main_photo_object', true)
    //   }
    // },
    // successData(file, response) {
    //   console.log('successData', response)
    //   const formatObj = Object.assign({}, response.data)
    //   this.dzData.push(formatObj)
    //   this.dropzone_uploaded.push(formatObj)
    //
    //   this.$emit('uploaded-file', { data: formatObj, index: this.dropzone_uploaded.length - 1 })
    // },
    // async onRemoveFile(id) {
    //   this.loadedImages.push(id)
    //
    //   await this.removeFile(id)
    //     .then(() => {
    //       const index = this.dropzone_uploaded.findIndex(elem => elem.id === id)
    //       if (index !== -1) {
    //         this.dropzone_uploaded.splice(index, 1)
    //         this.$emit('remove-file', id)
    //       }
    //     })
    //     .finally(() => {
    //       const index = this.dropzone_uploaded.findIndex(elem => elem.id === id)
    //       if (index !== -1) {
    //         this.loadedImages.splice(index, 1)
    //       }
    //     })
    // },
    // getLoadingImg(id) {
    //   return this.loadedImages.includes(id)
    // },
    // // TODO: Если еще будем работать с дропзоной - всю эту логику надо закинуть в миксин или отдельный компонент для дропзоны
    // async onDrop(e) {
    //   e.preventDefault()
    //
    //   const files = e.target.files || e.dataTransfer.files
    //
    //   if (files.length) {
    //     for (const file of files) {
    //       const data = await this.addFile({
    //         uuid: generateUUID(),
    //         id_object: parseInt(this.idObject),
    //         id_object_property: parseInt(this.idProperty),
    //         codeProperty: this.codeProperty,
    //         file
    //       })
    //
    //       if (data) {
    //         const formatObj = Object.assign({}, data.data)
    //         this.dzData.push(formatObj)
    //         this.dropzone_uploaded.push(formatObj)
    //         this.$refs.dropzone.manuallyAddFile(formatObj, this.$store.state.BASE_URL + formatObj.full_path)
    //
    //         this.$emit('uploaded-file', { data: formatObj, index: this.dropzone_uploaded.length - 1 })
    //       }
    //     }
    //
    //     this.dragging = false
    //   }
    // },
    // checkDrop(e) {
    //   if (e) {
    //     e.preventDefault()
    //   }
    // },
    // onDragEnter(e) {
    //   this.dragging = true
    // },
    // onDragLeave(e) {
    //   if (!this.dragging) {
    //     this.dragging = true
    //   }
    //
    //   if (e.currentTarget.contains(e.relatedTarget)) {
    //     return
    //   }
    //
    //   this.dragging = false
    // }
  }
}
</script>
