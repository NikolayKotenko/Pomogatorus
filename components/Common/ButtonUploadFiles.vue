<template>
  <div>
    <template v-if="isAvatar">
      <dropzone
        id="dropzone"
        ref="dropzone"
        class="dropzone_avatar_wrapper"
        :options="$store.getters.optionsDropzone"
        :use-custom-slot="true"
        :include-styling="false"
        @vdropzone-success="successData"
        @vdropzone-error="handleError"
        @vdropzone-sending="sendingData"
        @vdropzone-removed-file="handleRemovedFile"
      >
        <div ref="dropzoneTemplate" class="dropzone-custom-content">
          <!-- <div v-if='isDropzoneNotEmpty' class='separator'></div> -->
          <div class="dropzone-label">
            <v-icon color="#857885" large>
              mdi-cloud-upload
            </v-icon>
            <span>{{ externalPlaceholder }}</span>
          </div>
        </div>
      </dropzone>
    </template>
    <template v-else>
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
            <span>{{ externalPlaceholder }}</span>
          </div>
        </div>
      </dropzone>
    </template>
  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone';
import 'nuxt-dropzone/dropzone.css';

export default {
  name: 'ButtonUploadFiles',
  components: { Dropzone },
  props: {
    externalPlaceholder: {
      type: String,
      default: 'Загрузить фото'
    },
    isAvatar: {
      type: Boolean,
      default: false
    },
    currentUserId: {
      type: [String, Number],
      default: null
    },
    existedFile:{
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dzData: [],
      dropzone_uploaded: [],
    }
  },
  mounted() {
    if (this.existedFile) {
      this.$refs.dropzone.manuallyAddFile(
        this.existedFile,
        this.$store.state.BASE_URL + this.existedFile.full_path
      )
    }
  },
  methods: {
    sendingData(file, xhr, formData) {
      console.log('zxcvb', file, xhr, formData)

      if (this.currentUserId) {
        formData.append('id_user', this.currentUserId)
      }

      formData.append('uuid', file.upload.uuid);
    },
    successData(file, response) {
      console.log('qwerty', file, response)
      const formatObj = Object.assign({}, response.data);
      this.dzData.push(formatObj);
      this.dropzone_uploaded.push(formatObj);

      this.$emit('uploaded-file', { data: formatObj, index: this.dropzone_uploaded.length - 1 });
    },

    openDropzone() {
      // Открываем vue2-dropzone при клике на v-avatar
      this.$refs.dropzone.manuallyAddFile();
    },
    handleSuccess(file) {
      // Обработчик успешной загрузки файла
      this.avatarUrl = response.url; // Предполагается, что сервер возвращает URL загруженного изображения
    },
    handleError(file, errorMessage) {
      // Обработчик ошибки загрузки файла
      console.error('Ошибка загрузки файла:', errorMessage);
      // Возможно, нужно показать пользователю сообщение об ошибке
    },
    handleRemovedFile(file) {
      // Обработчик удаления файла
      this.avatarUrl = null; // Сбрасываем URL изображения
    },
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
.dropzone_avatar_wrapper {
  width: 100px;
  height: 100px;
  align-items: center;
}
</style>
