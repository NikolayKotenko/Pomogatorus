<template>
  <div>
    <dropzone
      id="dropzone"
      ref="dropzone"
      :destroy-dropzone="true"
      :include-styling="false"
      :options="$store.getters.optionsDropzone"
      :use-custom-slot="true"
      class="styleUploadFiles"
      @vdropzone-success="successData"
      @vdropzone-sending="sendingData"
    >
      <div ref="dropzoneTemplate" class="dropzone-custom-content">
        <!-- <div v-if='isDropzoneNotEmpty' class='separator'></div> -->
        <div class="dropzone-label">
          <v-icon color="#857885" large>
            mdi-cloud-upload
          </v-icon>
          <span>{{ ExternalPlaceholder }}</span>
        </div>
      </div>
    </dropzone>
  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone';
import 'nuxt-dropzone/dropzone.css';

export default {
  name: 'ButtonUploadFiles',

  components: { Dropzone },
  props: {
    ExternalPlaceholder: {
      type: String,
      default: 'Загрузить файлы'
    }
  },
  methods: {
    sendingData(file, xhr, formData) {
      formData.append('uuid', file.upload.uuid);
      formData.append('id_object', parseInt(this.idObject));
      formData.append('id_object_property', parseInt(this.idProperty));

      if (this.codeProperty === 'osnovnoe-foto-obekta') {
        formData.append('main_photo_object', true);
      }
    },
    successData(file, response) {
      const formatObj = Object.assign({}, response.data);
      this.dzData.push(formatObj);
      this.dropzone_uploaded.push(formatObj);

      this.$emit('uploaded-file', { data: formatObj, index: this.dropzone_uploaded.length - 1 });
    }

  }
};

</script>

<style lang="scss" scoped>
.styleUploadFiles {
  border: 0.5px dashed #857885;
  border-radius: 5px;
  color: #857885;
  font-weight: 400;
  font-size: 1em;
  text-transform: unset !important;
  width: 100%;
  height: auto;

}
</style>
