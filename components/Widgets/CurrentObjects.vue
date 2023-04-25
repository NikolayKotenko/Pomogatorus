<template>
  <div class="wrapper_current_object">
    <div class='current_object'>
      <div class="current_object__label">
        <span>Текущий объект</span>
        <v-divider></v-divider>
      </div>

      <TooltipStyled :title="'Выбрать объект или создать новый'">
        <SelectObjectStyled
          v-model='$store.state.currentObject'
          :custom-style='true'
          :data='$store.state.currentObject'
          :have-trigger='true'
          :is-solo='true'
          :item-text="'address'"
          :item-value="'id'"
          :items='$store.state.Objects.listObjects'
          :is-loading="$store.getters.stateAuth ? $store.state.Objects.isLoadingObjects : false"
          :is-disabled="$store.getters.stateAuth ? $store.state.Objects.isLoadingObjects : true"
          :placeholder="$store.getters.stateAuth ? 'Выберите объект' : 'Войдите в учет. запись'"
          title='Выберите объект'
          @update-input='callback'
        />
      </TooltipStyled>

      <TooltipStyled :title="'Фотография объекта'">
        <v-img class='current_object__image'
        >
          <v-icon class='current_object__image__icon' x-large>mdi-map-marker-outline</v-icon>
        </v-img>
      </TooltipStyled>

      <!-- Циклом параметры по булеву "транслировать в сниппет" -->
      <section class='current_object__wrapper_info'
               v-for="(obj, key) in $store.state.list_broadcast_snippet"
      >
        <span class='current_object__wrapper_info__text'>{{ obj.name }}:</span>
        <span class='current_object__wrapper_info__value'>{{ $store.state.currentObject[obj.code] }}</span>
      </section>

      <section class='current_object__wrapper_info'>
        <span class='current_object__wrapper_info__text'>Параметры объекта:</span>
        <span class='current_object__wrapper_info__value'>13 из 22</span>
      </section>
      <section class='current_object__wrapper_info'>
        <span class='current_object__wrapper_info__text'>ТЗ объекта: {{ $store.state.currentObject.name }}</span>
        <span class='current_object__wrapper_info__value'>7 из 130</span>
        <div class="wrapper_button">
          <TooltipStyled :title="'Перейти к объекту'">
            <ButtonStyled
              :local-text="'Открыть'"
              local-class="style_button"
              :href="$store.getters.stateObjectSelected ? '/objects/'+$store.state.currentObject.id : ''"
            ></ButtonStyled>
          </TooltipStyled>
          <TooltipStyled :title="'Сгенерировать PDF Технического Задания'">
            <ButtonStyled
              local-class="style_button"
              @click-button='state_tech_task_block = !state_tech_task_block'
              :custom-slot="true"
            >
              <span>{{ state_tech_task_block ? 'Скрыть&nbsp; ТЗ' : 'Создать ТЗ' }}</span>
              <v-icon>{{state_tech_task_block ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
            </ButtonStyled>
          </TooltipStyled>
        </div>

        <span v-show='state_tech_task_block' class='current_object__wrapper_info__hide_block'>
          <v-checkbox
            v-for='(tag, key) in $store.state.list_tags'
            v-if='$store.state.list_tags.length'
            :key='key'
            v-model='selected_ids_tags'
            :disabled='!$store.getters.stateObjectSelected'
            :label='tag.name'
            :value='tag.id'
            class='current_object__wrapper_info__hide_block__checkbox'
            hide-details
          ></v-checkbox>
          <div>
            <TooltipStyled :title="$store.getters.stateObjectSelected
                      ? 'Техническое задание по инженерным системам'
                      : 'Выберите ваш объект для формирования документа'"
            >
              <ButtonStyled
                local-class="style_button downloadPDF"
                @click-button='downloadPDF()'
                :custom-slot="true"
                :is-disabled="!$store.getters.stateObjectSelected"
              >
                <span>Скачать PDF</span>
              </ButtonStyled>
            </TooltipStyled>
            <!-- Генерация пдф -->
            <client-only>
              <vue-html2pdf
                ref='html2Pdf'
                :enable-download='true'
                :html-to-pdf-options="$store.getters['PdfDataModule/htmlToPdfOptions']('Техническое задание')"
                :manual-pagination='true'
                :pdf-quality='2'
                :show-layout='false'
                pdf-content-width='100%'
              >
                <section slot='pdf-content'>
                  <!-- content -->
                  <pdf-content></pdf-content>
                  <!-- /content -->
                </section>
              </vue-html2pdf>
            </client-only>
            <v-alert
              v-if='alert.state'
              type='error'
            >
              <span v-html='alert.message'></span>
            </v-alert>
          </div>
        </span>
      </section>
    </div>
  </div>
</template>

<script>
import InputStyled from '../Common/InputStyled'
import SelectStyled from '../Common/SelectStyled'
import PdfContent from '../PdfReports/PdfContent'
import SelectObjectStyled from '../Common/SelectObjectStyled'
import TooltipStyled from "~/components/Common/TooltipStyled";
import ButtonStyled from "~/components/Common/ButtonStyled";

export default {
  name: 'CurrentObjects',
  components: { ButtonStyled, TooltipStyled, SelectObjectStyled, InputStyled, SelectStyled, PdfContent },
  data() {
    return {
      state_tech_task_block: false,
      selected_ids_tags: [],
      alert: {
        state: false,
        message: ''
      }
    }
  },
  mounted() {
    this.$store.dispatch('getListTags')
    this.$store.dispatch('getListBroadcastSnippet')
  },
  watch:{
    '$store.getters.stateAuth': {
      handler(state) {
        if (state) {
          this.$store.dispatch('getListBroadcastSnippet')
        } else {
          this.$store.commit('set_list_broadcast_snippet', [])
        }
      }
    }
  },
  computed: {
  },
  methods: {
    callback(data) {
      this.$store.commit('set_currentObject', data)
    },
    async downloadPDF() {
      const response = await this.$store.dispatch('PdfDataModule/getBodyData', { ids_tags: this.selected_ids_tags })
      console.log('WTF', response)
      if (response.codeResponse === 200) {
        this.$refs.html2Pdf.generatePdf()
        this.alert.state = false
        this.alert.message = ''
      } else {
        this.alert.state = true
        this.alert.message = response.message
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import "@/assets/styles/global.scss";

.wrapper_current_object {
  height: 1px;
  //width: 1px;
  top: 15px;
  position: sticky;
  .current_object {
    top: 0;
    //right: -320px;
    position: absolute;
    overflow-y: overlay;
    height: auto;
    max-height: 768px;
    width: 290px;
    //max-height: 500px;
    display: flex;
    flex-direction: column;
    align-self: baseline;
    grid-row-gap: 1em;
    padding: 20px !important;

    &:hover {
      @extend .border-hover;
      @extend .background-hover;
    }

    &__label {
      font-size: 1.25em;

      hr {
        margin-top: 10px;
        border-color: black;
      }
    }

    &__image {
      width: 100%;
      height: 150px;
      background: rgba(196, 196, 196, 0.5);
      border-radius: 5px;

      &__icon {
        position: absolute;
        margin: auto;
        width: 100%;
        height: 100%;
      }
    }

    &__wrapper_info {
      &__text {
        font-style: normal;
        //font-weight: 300;
        font-size: 16px;
        line-height: 16px;
        //color: #37392E;
      }

      &__value {
      }

      &__info {
        display: grid;
      }

      &__icon_wrapper {
        text-align: center;
      }

      &__hide_block {
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
    }

    .wrapper_button {
      margin: 1em 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 1em;
      font-size: 14px;

      .style_button {
        min-width: unset !important;
        width: 100%;
      }
    }
    .downloadPDF{
      margin-top: 10px;
      width: 100%;
      max-width: unset;
    }
  }
}
</style>
