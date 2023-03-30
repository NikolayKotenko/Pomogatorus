<template>
  <div>
    <dropzone
      class="styleUploadFiles"
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
      <!--<div v-if='isDropzoneNotEmpty' class='separator'></div>-->
      <div class='dropzone-label'>
        <v-icon color='#B3B3B3' large>mdi-cloud-upload</v-icon>
        <span>{{ ExternalPlaceholder }}</span>
      </div>
    </div>
    </dropzone>
  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
export default {
  name: "ButtonUploadFiles",
  props:{
  ExternalPlaceholder: {
    type: String,
    default: 'Загрузить файлы'
  },
  },

  components:{Dropzone,},
  methods: {
    sendingData(file, xhr, formData) {
      formData.append('uuid', file.upload.uuid)
      formData.append('id_object', parseInt(this.idObject))
      formData.append('id_object_property', parseInt(this.idProperty))

      if (this.codeProperty === 'osnovnoe-foto-obekta'){
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

},
}

</script>

<style lang="scss" scoped>
.styleUploadFiles {
  border-radius: 5px;
  border: dashed 6px #000000;
  color: #000000;
  min-width: 815px;
}
</style>
