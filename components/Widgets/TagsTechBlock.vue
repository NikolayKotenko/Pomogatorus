<template>
  <span class="current_object__wrapper_info__hide_block">
    <div v-if="$store.state.list_tags.length">
      <v-checkbox
        v-for="(tag, key) in $store.state.list_tags"
        :key="key"
        v-model="selected_ids_tags"
        :disabled="!$store.getters['Objects/stateObjectSelected']"
        :label="tag.name"
        :value="tag.id"
        class="current_object__wrapper_info__hide_block__checkbox"
        hide-details
      />
    </div>
    <div>
      <TooltipStyled
        :title="$store.getters['Objects/stateObjectSelected']
          ? 'Техническое задание по инженерным системам'
          : 'Выберите ваш объект для формирования документа'"
      >
        <ButtonStyled
          :custom-slot="true"
          :is-disabled="!$store.getters['Objects/stateObjectSelected']"
          local-class="style_button downloadPDF"
          @click-button="downloadPDF()"
        >
          <span>Скачать PDF</span>
        </ButtonStyled>
      </TooltipStyled>
      <!-- Генерация пдф -->
      <client-only>
        <vue-html2pdf
          ref="html2Pdf"
          :enable-download="true"
          :html-to-pdf-options="$store.getters['PdfDataModule/htmlToPdfOptions']('Техническое задание')"
          :manual-pagination="true"
          :pdf-quality="2"
          :show-layout="false"
          pdf-content-width="100%"
        >
          <section slot="pdf-content">
            <!-- content -->
            <pdf-content />
            <!-- /content -->
          </section>
        </vue-html2pdf>
      </client-only>
      <v-alert
        v-if="alert.state"
        type="error"
      >
        <span v-html="alert.message" />
      </v-alert>
    </div>
</span>
</template>

<script>
import TooltipStyled from "~/components/Common/TooltipStyled";
import PdfContent from "~/components/PdfReports/PdfContent";
import ButtonStyled from "~/components/Common/ButtonStyled";

export default {
  name: "TagsTechBlock",
  components: { TooltipStyled, PdfContent, ButtonStyled },
  data() {
    return {
      selected_ids_tags: [],
      alert: {
        state: false,
        message: ""
      }
    };
  },
  mounted() {
    this.$store.dispatch("getListTags");
  },
  methods: {
    async downloadPDF() {
      const response = await this.$store.dispatch("PdfDataModule/getBodyData", { ids_tags: this.selected_ids_tags });
      // console.log("WTF", response);
      if (response.codeResponse === 200) {
        this.$refs.html2Pdf.generatePdf();
        this.alert.state = false;
        this.alert.message = "";
      } else {
        this.alert.state = true;
        this.alert.message = response.message;
      }
    }
  }
};
</script>

<style lang="scss" scoped>

.current_object__wrapper_info__hide_block {
  display: grid;
  //grid-row-gap: 5px;

  &__checkbox {
    margin: unset;
    padding: unset;

    label {
      height: 100% !important;
    }
  }
}

.downloadPDF {
  margin-top: 10px;
  width: 100%;
  max-width: unset;
}
</style>
