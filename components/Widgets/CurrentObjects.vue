<template>
  <div class='current_object'>
    <SelectObjectStyled
      v-model='$store.state.currentObject'
      :custom-style='true'
      :data='$store.state.currentObject'
      :is-solo='true'
      :item-text="'address'"
      :item-value="'id'"
      :items='checkObjects'
      :placeholder="'Выберите объект'"
      title='Выберите объект'
      @update-input='callback'
    />
    <v-img class='current_object__image' title='Фотография объекта'>
      <v-icon class='current_object__image__icon' x-large>mdi-map-marker-outline</v-icon>
    </v-img>
    <section class='current_object__wrapper_info'>
      <span class='current_object__wrapper_info__text'>Площадь:</span>
      <span class='current_object__wrapper_info__value'>{{ $store.state.currentObject.total_area }}</span>
    </section>
    <section v-if='$store.state.currentObject.id_floor' class='current_object__wrapper_info'>
      <span class='current_object__wrapper_info__text'>Этажи:</span>
      <span class='current_object__wrapper_info__value'>{{ $store.state.currentObject.id_floor }}</span>
    </section>
    <section class='current_object__wrapper_info'>
      <span class='current_object__wrapper_info__text'>Параметры объекта:</span>
      <span class='current_object__wrapper_info__value'>13 из 22</span>
    </section>
    <section class='current_object__wrapper_info'>
      <span class='current_object__wrapper_info__text'>ТЗ объекта {{ $store.state.currentObject.name }}</span>
      <span class='current_object__wrapper_info__value'>7 из 130</span>
      <div class='current_object__wrapper_info__icon_wrapper'>
        <v-icon @click='state_tech_task_block = !state_tech_task_block'>
          mdi-chevron-down
        </v-icon>
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
          <v-btn :disabled='!$store.getters.stateObjectSelected'
                 :title="($store.getters.stateObjectSelected)
                    ? 'Техническое задание по инженерным системам'
                    : 'Выберите ваш объект для формирования документа'"
                 block
                 class='mt-5'
                 @click='downloadPDF()'
          >
            PDF
            <v-icon>mdi-tray-arrow-down</v-icon>
          </v-btn>
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
</template>

<script>
import InputStyled from '../Common/InputStyled'
import SelectStyled from '../Common/SelectStyled'
import PdfContent from '../PdfReports/PdfContent'
import SelectObjectStyled from '../Common/SelectObjectStyled'

export default {
  name: 'CurrentObjects',
  components: { SelectObjectStyled, InputStyled, SelectStyled, PdfContent },
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
  },
  computed: {
    checkObjects() {
      return Array.isArray(this.$store.state.AuthModule.userData.objects) ? this.$store.state.AuthModule.userData.objects : []
    }
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
.current_object {
  width: 260px;
  //max-height: 500px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  grid-row-gap: 1em;
  margin-left: 25px;

  &__image {
    width: 209px;
    height: 134px;
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
      font-weight: 300;
      font-size: 14px;
      line-height: 16px;
      color: #37392E;
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
}
</style>
