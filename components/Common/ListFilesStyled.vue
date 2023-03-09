<template>
  <v-container class='object-wrapper-documents__docs__dropzone custom-fields'>
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
        multiple
        readonly
        @click='forceDropzone'
        @focus='focusStart'
        @focusout='focusEnd'
      >
        <template v-slot:selection='data'>
          <div class='uploaded-image' v-bind='data.attrs'>
            <img :alt='data.item.alt_image' :src='$store.state.BASE_URL + data.item.full_path'>
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
<!--      <dropzone-->
<!--        id='dropzone_list_files'-->
<!--        ref='dropzone_list_files'-->
<!--        :destroyDropzone='true'-->
<!--        :include-styling='false'-->
<!--        :options='$store.getters.optionsDropzone'-->
<!--        :useCustomSlot='true'-->
<!--        @vdropzone-success='successData'-->
<!--        @vdropzone-sending='sendingData'-->
<!--      >-->
<!--        <div ref='dropzoneTemplate' class='dropzone-custom-content'>-->
<!--          <div v-if='isDropzoneNotEmpty' class='separator'></div>-->
<!--          <div class='dropzone-label'>-->
<!--            <v-icon color='#B3B3B3' large>mdi-cloud-upload</v-icon>-->
<!--            <span>Список файлов</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </dropzone>-->
    </div>
  </v-container>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import { mapActions } from "vuex";

export default {
  name: "ListFilesStyled",
  components: {
    Dropzone
  },
  props:{
    idObject: {
      type: [Number, String],
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
    },
  },
  data() {
    return {
      dropzone_uploaded: [],
      dzData: [],
      loadedImages: []
    }
  },
  computed:{
    isDropzoneNotEmpty() {
      return !!this.dropzone_uploaded.length
    },
  },
  async mounted() {
    const response = await this.$store.dispatch('getFilesByFilter', {
      'id_object': parseInt(this.idObject),
    })
    this.dzData = response.data;
    this.dropzone_uploaded = response.data;
    console.log('response', response)
  },
  methods:{
    ...mapActions('Tabs', ['removeFile']),

    sendingData(file, xhr, formData) {
      formData.append('uuid', file.upload.uuid)
      formData.append('id_object', parseInt(this.idObject))
    },
    successData(file, response) {
      console.log('successData', response)
      const formatObj = Object.assign({}, response.data)
      this.dzData.push(formatObj)
      // this.dropzone_uploaded.push(formatObj)

      this.$emit('uploaded-file', formatObj.full_path)
    },
    focusStart() {
      this.isFocused = true
      this.$emit('focus-in')
    },
    focusEnd() {
      this.isFocused = false
      this.$emit('focus-out')
    },
    async onRemoveFile(id) {
      this.loadedImages.push(id)

      await this.removeFile(id)
        .then(() => {
          let index = this.dropzone_uploaded.findIndex(elem => elem.id === id)
          if (index !== -1) {
            this.dropzone_uploaded.splice(index, 1)
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
    },
    forceDropzone() {
      if (!this.isDropzoneNotEmpty) {
        this.$refs.dropzoneTemplate.click()
      }
    },
  }
};
</script>

<style lang="scss" scoped>
$max-height-image: 120px;

.custom-fields .dropzone-files .uploaded-image{
  max-height: $max-height-image;
  img{
    max-height: $max-height-image;
  }
}
</style>
