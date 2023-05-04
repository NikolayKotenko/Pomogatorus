<template>
  <div>
    <dropzone
      id="dropzone"
      ref="dropzone"
      :destroyDropzone="true"
      :include-styling="false"
      :options="$store.getters.optionsDropzone"
      :useCustomSlot="true"
      class="styleUploadFiles"
      @vdropzone-success="successData"
      @vdropzone-sending="sendingData"
    >
      <div ref="dropzoneTemplate" class="dropzone-custom-content">
        <!--<div v-if='isDropzoneNotEmpty' class='separator'></div>-->
        <div class="dropzone-label">
          <v-icon color="#B3B3B3" large>mdi-cloud-upload</v-icon>
          <span>{{ ExternalPlaceholder }}</span>
        </div>
      </div>
    </dropzone>
  </div>
</template>

<script>
import Dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";

export default {
  name: "ButtonUploadFiles",
  props: {
    ExternalPlaceholder: {
      type: String,
      default: "Загрузить файлы"
    }
  },

  components: { Dropzone },
  methods: {
    sendingData(file, xhr, formData) {
      formData.append("uuid", file.upload.uuid);
      formData.append("id_object", parseInt(this.idObject));
      formData.append("id_object_property", parseInt(this.idProperty));

      if (this.codeProperty === "osnovnoe-foto-obekta") {
        formData.append("main_photo_object", true);
      }
    },
    successData(file, response) {
      console.log("successData", response);
      const formatObj = Object.assign({}, response.data);
      this.dzData.push(formatObj);
      this.dropzone_uploaded.push(formatObj);

      this.$emit("uploaded-file", { data: formatObj, index: this.dropzone_uploaded.length - 1 });
    }

  }
};

</script>

<style lang="scss" scoped>
.styleUploadFiles {
  //border-radius: 5px;
  //border: dashed 6px #000000;
  //color: #000000;
  //min-width: 815px;

  background-image: repeating-linear-gradient(-1deg, #b3b3b3, #b3b3b3 9px, transparent 0, transparent 22px, #b3b3b3 0), repeating-linear-gradient(89deg, #b3b3b3, #b3b3b3 9px, transparent 0, transparent 22px, #b3b3b3 0), repeating-linear-gradient(179deg, #b3b3b3, #b3b3b3 9px, transparent 0, transparent 22px, #b3b3b3 0), repeating-linear-gradient(269deg, #b3b3b3, #b3b3b3 9px, transparent 0, transparent 22px, #b3b3b3 0);
  background-size: 2px 100%, 100% 2px, 2px 100%, 100% 2px;
  background-position: 0 0, 0 0, 100% 0, 0 100%;
  background-repeat: no-repeat;
  margin: 0 0 10px 0;
  padding: 10px;
}
</style>
