<template>
  <v-card class="object_wrapper">
    <div class="object_title_container">
      <span class="title">Объект:</span>
      <div class="select_object">
        <SelectObjectStyled
          v-if="stateSelectEditNameObject"
          :custom-style="true"
          :data="object"
          :is-solo="true"
          :item-text="'name'"
          :item-value="'id'"
          :items="listObjects"
          :placeholder="'Выберите объект'"
          title="Выберите объект"
          @update-input="callback"
        />
        <InputStyled
          v-else
          :data="modalCurrentObject.name"
          :is-outlined="true"
          :placeholder="'Введите наименование объекта'"
          style="margin-left: 10px;"
          @update-input="setNameField"
        />
        <TooltipStyled
          :title="stateSelectEditNameObject
            ? 'Режим редактирования наименования объекта'
            : 'Режим выбора объекта'"
        >
          <v-icon
            style="margin-left: 10px;"
            :color="stateSelectEditNameObject ? '' : '#000000'"
            @click="setStateSelectedEditName()"
          >
            mdi-lead-pencil
          </v-icon>
        </TooltipStyled>
      </div>
      <v-icon style="margin-left: auto" color="#000000" @click="closeModal">
        mdi-close
      </v-icon>
    </div>

    <v-divider style="border-color: #DDDDDD;"/>

    <div class="object_map">
      <div class="map_title">
        Адрес:
      </div>
      <div class="address">
        <SelectGeo v-if="notEmptyObject" :data="modalCurrentObject" :outer-coords="getCoords" @set-new-address="setAddressMap"/>
      </div>
    </div>

    <div class="images_wrapper">
      <div class="main_photo">
        <DropzoneInput
          :id-object="modalCurrentObject.id"
          :data="$store.getters['Objects/getPhotosObject']"
          :object-template="false"
          :is-avatar="true"
          class="dropzone_style"
          @uploaded-file="changePhotoData"
          @remove-file="removeObjectPhoto"
        />
        <v-img
          v-if="$store.getters['Objects/getLastObjectPhoto']"
          :src="$store.getters['Objects/getLastObjectPhoto']"
          class="img"
          height="100%"
        />
        <span v-else class="empty_placeholder"/>
      </div>

      <div v-if="modalCurrentObject.id" class="object_documents_wrapper">
        <DropzoneInput
          :data="$store.getters['Objects/getObjectFiles']"
          :object-template="false"
          :is-avatar="true"
          class="dropzone_style"
          @uploaded-file="changePhotoData"
          @remove-file="removeObjectPhoto"
        />
        <div
          v-if="$store.getters['Objects/getObjectFiles']"
          class="files_wrapper"
        >
          <div
            v-for="(name, index) in $store.getters['Objects/getObjectFiles']"
            :key="index"
          >
            {{ name }}
          </div>
        </div>
        <span v-else class="empty_placeholder"/>
      </div>
    </div>

    <div class="tabs_wrapper">
      <v-tabs color="#FF6347" hide-slider>
        <v-tab :key="0">
          Параметры объекта
        </v-tab>
        <v-tab :key="1">
          Оборудование объекта
        </v-tab>
        <v-tab :key="2">
          Люди на объекте
        </v-tab>
        <v-tab-item :key="0">
          <v-expansion-panels ref="tabContent" accordion flat>
            <v-expansion-panel
              v-for="(panel, index) in tabs"
              :key="index"
              @update-prop="setField"
              @update-file="setFileField"
              @change-tab="changeTab"
              @remove-file="removeFile"
              @focus-out-field="animationSaveBtn"
              @change="changeTab(panel.code)"
            >
              <v-expansion-panel-header>
                {{ panel.name }}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <template v-if="isLoadingData || !modalCurrentObject || !Object.keys(modalCurrentObject).length">
                  <v-progress-circular
                    :size="30"
                    color="#FF6347"
                    indeterminate
                    style="margin: 20px auto 40px auto"
                  />
                </template>

                <template v-else>
                  <div
                    v-for="(tabItem, index) in tabData"
                    :key="index"
                    class="obj_prop_style"
                  >
                    <CustomField
                      :code-property="tabItem.code"
                      :data="getObjectProperty(tabItem.code)"
                      :deleted-file="deletedFile"
                      :id-object="modalCurrentObject.id"
                      :id-property="tabItem.id"
                      :items="getItems(tabItem)"
                      :label="tabItem.name"
                      :type="getInputType(tabItem)"
                      @update-field="changeAnswer($event, tabItem.code)"
                      @uploaded-file="changeFileData($event, tabItem.code)"
                      @remove-file="removeFile($event, tabItem.code)"
                      @focus-in="focusIn(tabItem)"
                      @focus-out="focusOut(tabItem)"
                      @mousedown.native.stop
                    />
                  </div>
                </template>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tab-item>
        <v-tab-item :key="1">
          <v-expansion-panels
            accordion
            flat
          >
            <v-expansion-panel>
              <v-expansion-panel-header>
                Добавленно в объект
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="favorites_products_list">
                  <div
                    v-for="(product, index) in $store.state.NomenclatureModule.listFavoriteNomenclature"
                    :key="index"
                    class="favorite_product_card"
                  >
                    <v-img
                      v-if="product.nomenclature._family.photos.length"
                      :src="product.nomenclature._family.photos[0].url"
                      class="img"
                      height="100%"
                    />
                    <div v-else class="empty_placeholder"/>
                    <div class="product_name_container">
                      {{ product.nomenclature.name }}
                    </div>
                    <TooltipStyled
                      :is-top="true"
                      :title="'Удалить из добавленного'"
                    >
                      <img
                        :src="require(`~/assets/svg/icons/delete_icon.svg`)"
                        alt="Удалить"
                        style="cursor: pointer;"
                        @click="deleteProduct(product.id_nomenclature)"
                      >
                    </TooltipStyled>
                  </div>
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                Купленное оборудование
              </v-expansion-panel-header>
              <v-expansion-panel-content/>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header>
                Установленное оборудование
              </v-expansion-panel-header>
              <v-expansion-panel-content/>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tab-item>
        <v-tab-item :key="2"/>
      </v-tabs>
    </div>

    <div class="footer">
      <v-divider style="border-color: #DDDDDD;"/>
      <div class="object_footer_buttons">
        <DropDownMenuStyled :is-left="true" :is-offset-y="true" :is-top="true" :nudge-top="0" :nudge-right="10">
          <template #icon>
            <ButtonStyled
              :custom-slot="true"
              local-class="red_style_button"
            >
              <span>
                Сгенерировать PDF
              </span>
            </ButtonStyled>
          </template>
          <template #content>
            <TagsTechBlock/>
          </template>
        </DropDownMenuStyled>
        <ButtonStyled
          :is-animation="animationBtn"
          :is-loading="isLoadingObjects"
          local-class="red_style_button"
          local-text="Сохранить"
          @click-button="onSave"
        />
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import Vue from 'vue';
import SelectObjectStyled from '../Common/SelectObjectStyled';
import SelectGeo from '../Common/SelectGeo';
import ButtonStyled from '../Common/ButtonStyled';
import TooltipStyled from '../Common/TooltipStyled.vue';
import CustomField from '../Common/CustomField.vue';
import TagsTechBlock from '../Widgets/TagsTechBlock.vue'
import DropDownMenuStyled from '../Common/DropDownMenuStyled.vue'
import DropzoneInput from '../Common/DropzoneInput.vue'
import InputStyled from '~/components/Common/InputStyled';

export default {
  name: 'ObjectGlobal',
  components: {
    DropzoneInput,
    DropDownMenuStyled,
    TagsTechBlock,
    CustomField,
    InputStyled,
    TooltipStyled,
    ButtonStyled,
    SelectGeo,
    SelectObjectStyled,
  },
  props: {
    objectData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    object: {},
    updateProperties: {},
    deletedFile: 0,

    minHeightInput: 76,
    scrollHeight: null,
    maxScroll: null,
    animationBtn: false,
    debounceTimeout: null,
    startScroll: 0,
    isMoving: false,
    stateSelectEditNameObject: true,
    stateTagsTechBlock: false
  }),
  watch: {
    'objectData': {
      handler(v) {
        console.log('ASDAS', v)
        if (!v) return false;

        this.object = v;
      }
    },
    'getUserId': {
      handler(oldV, newV) {
        if (oldV !== newV && !this.listObjects.length) {
          this.getListObjectsByUserId();
        }
      }
    },
    '$store.state.Objects.listObject': {
      async handler(v) {
        await this.set_modal_current_object();
      }
    }
  },
  computed: {
    ...mapState('Objects', ['isLoadingObjects', 'listObjects', 'modalCurrentObject']),
    ...mapGetters(['getUserId']),
    ...mapState('Tabs', ['tabs', 'isLoading', 'tabData', 'isLoadingData']),

    notEmptyObject() {
      return !!Object.keys(this.modalCurrentObject).length;
    },
    getCoords() {
      return this.object?.long && this.object?.lat ? [this.modalCurrentObject.lat, this.modalCurrentObject.long] : [55.753215, 37.622504];
    },
    showMore() {
      return ((this.parentHeight + this.scrollHeight + this.minHeightInput) <= this.maxScroll);
    },
    isMobile() {
      return this.$device.isMobile;
    },
    stateFilledImageObject() {
      if (!this.modalCurrentObject.hasOwnProperty('osnovnoe-foto-obekta')) return false;

      return this.modalCurrentObject['osnovnoe-foto-obekta'].length;
    },
  },
  async mounted() {
    if (Object.keys(this.objectData).length) {
      this.set_modal_current_object(this.objectData);
    }

    await this.$store.dispatch('NomenclatureModule/getListFavoriteNomenclatureByUserAndObjectId')

    this.getObjectFromProp();

    await this.getTabData()

    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client && this.$refs.scrollParent) {
      const tabContent = this.$refs.scrollParent;
      tabContent.addEventListener('scroll', this.scrollWindow);
      if (this.isMobile) {
        tabContent.addEventListener('scroll', this.scrollHeader, false);
      }
      this.scrollWindow();
    }
    await this.$store.getters['Objects/getObjectFiles']

    await this.$store.getters['Objects/getLastObjectPhoto']

    await this.$store.dispatch('Objects/setListObjectFiles')
  },

  methods: {
    ...mapActions('Tabs', ['getTabs', 'getTabInfo', 'getInputTypes']),
    ...mapActions('Objects', ['saveObjData', 'getListObjectsByUserId']),
    ...mapMutations('Tabs', ['setLoadingData', 'setTabData']),
    ...mapMutations('Objects', ['set_modal_current_object']),

    scrollBot() {
      this.$refs.scrollParent.scrollTo({
        top: this.scrollHeight + this.minHeightInput + 20,
        left: 0,
        behavior: 'smooth'
      });
    },
    scrollHeader() {
      const st = this.$refs.scrollParent.scrollTop;

      if (!this.showMore) {
        return;
      }

      if (st > this.startScroll) {
        // console.log('down')
        this.isMoving = true;
      } else if (st < this.startScroll) {
        // console.log('up')
        this.isMoving = false;
      }
      this.startScroll = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    },
    scrollWindow() {
      setTimeout(() => {
        if (this.$refs.scrollParent) {
          this.maxScroll = this.$refs.scrollParent.scrollHeight;
          this.scrollHeight = this.$refs.scrollParent.scrollTop;
          this.parentHeight = this.$refs.scrollParent.offsetHeight;
        }
      }, 400);
    },
    async getTabData() {
      await this.getTabs()
      await this.getInputTypes()
      if (this.tabs && this.tabs.length) {
        await this.changeTab('all')
      }
    },
    changeTab(code) {
      this.getTabInfo(code)
      this.$emit('change-tab')
    },
    async onSave() {

      await this.saveObjData({ id: this.modalCurrentObject.id, keys: this.updateProperties });
      // Для обновления списка который прокидываем в SelectObjectStyled
      await this.getListObjectsByUserId();
      // Для переключения режима редактирования выбора того же селекта
      this.stateSelectEditNameObject = true;

      this.closeModal();

      this.$toast.success('Данные сохранены', { duration: 5000 });
    },
    closeModal() {
      this.$emit('close-modal');
    },
    animationSaveBtn() {
      this.animationBtn = true;
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.animationBtn = false;
      }, 2000);
    },
    setNameField(name) {
      this.modalCurrentObject.name = name;
      this.updateProperties.name = name;
    },
    setStateSelectedEditName() {
      if (!this.stateSelectEditNameObject) {
        this.onSave();
      }
      this.stateSelectEditNameObject = !this.stateSelectEditNameObject;
    },
    setField(data, code) {
      this.modalCurrentObject[data.key] = data.value;
      this.updateProperties[data.key] = data.value;

      if (code === 'tip-obekta') {
        this.getTabs()
      }
    },
    changeAnswer(value, code) {
      this.setField({ key: code, value } )

      if (code === 'tip-obekta') {
        this.getTabs()
      }
    },
    setFileField(data) {
      if (!this.modalCurrentObject[data.key]) {
        Vue.set(this.object, data.key, [data.value]);
      } else {
        this.object[data.key].push(data.value);
      }
      this.updateProperties[data.key] = data.value;
    },
    changeFileData(value, code) {
      this.setFileField({ key: code, value: value.data, index: value.index })
      // КОСТЫЛЬ, чтобы реактивность во vue заработала
      this.setTabData(this.tabData)
    },
    removeFile(data) {
      const index = this.modalCurrentObject[data.key].findIndex(file => file.id === data.value);

      if (index !== -1) {
        this.modalCurrentObject[data.key].splice(index, 1);
      }
    },
    // changePhotoData(value, code) {
    //   this.set_modal_current_object(this.object)
    // },
    // removeObjectPhoto(id) {
    //   const index = this.files.findIndex(elem => elem.data.id === id)
    //   if (index !== -1) {
    //     this.files.splice(index, 1)
    //     this.uploadedFiles = [...this.files]
    //   }
    // },
    removeFromGlobal(data) {
      this.removeFile(data);

      this.deletedFile = data.value;
    },
    getObjectFromProp() {
      this.object = this.objectData;
    },
    callback(value) {
      if (!value) return false;

      this.setLoadingData(true);
      this.set_modal_current_object(value)

      // TODO: Отрефакторить, но завтра сдаваться
      this.$nextTick(() => {
        this.setLoadingData(false);
      });
      // Событие изменение селекта прокидываем выше
      this.$emit('change-select-object', value);
    },
    setAddressMap(data) {
      this.modalCurrentObject.address = data.address;
      this.modalCurrentObject.lat = data.coords[0];
      this.modalCurrentObject.long = data.coords[1];

      this.updateProperties.address = data.address;
      this.updateProperties.lat = data.coords[0];
      this.updateProperties.long = data.coords[1];
    },
    getObjectProperty(key) {
      return this.modalCurrentObject[key] ? this.modalCurrentObject[key] : null
    },
    getItems(input) {
      return input?.d_dictionaries?.d_dictionary_attributes && input?.d_dictionaries?.d_dictionary_attributes.length ? input?.d_dictionaries?.d_dictionary_attributes : []
    },
    getInputType(input) {
      return input?.d_property_objects?.code ? input.d_property_objects.code : 'stroka'
    },

    focusIn(item) {
      item.active = true
    },
    focusOut(item) {
      item.active = false
      this.$emit('focus-out-field')
    },

    async deleteProduct(productId) {
      await this.$store.dispatch('NomenclatureModule/deleteOneFavoriteNomenclature', productId)

      this.$toast.success('Оборудование удаленно')
    },
    async changePhotoData(value, code) {
      await this.$store.dispatch('Objects/getListObjectsByUserId')
      await this.$store.dispatch('Objects/setListObjectFiles')
      await this.$store.dispatch('Objects/getObjectById', this.modalCurrentObject.id)
    },
    removeObjectPhoto() {

    }
  },

  destroyed() {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client) {
      window.removeEventListener('scroll', this.scrollWindow);
    }
  },

};
</script>

<style lang="scss">
.v-expansion-panel-header__icon {
  margin-left: 10px !important;
}
</style>

<style lang="scss" scoped>
@import 'assets/styles/style';

.object_wrapper {
  font-family: 'Inter', sans-serif;
  display: flex;
  min-height: 800px !important;
  max-height: 800px !important;
  .object_title_container {
    padding: 20px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 1.25em;
      font-weight: 600;
    }
    .select_object {
      display: flex;
      min-width: 300px;
      align-items: center;
      font-size: 1.25em !important;
      font-weight: 600;
    }
  }
  .object_map {
    display: flex;
    align-items: center;
    padding: 15px 40px;
    .map_title {
      margin-right: 10px;
    }
    .address {
      border-radius: 15px;
      border: 2px solid var(--gray_1, #DDD);
      width: 100%;
      padding: 0 10px;

    }
  }
  .images_wrapper {
    display: flex;
    padding: 0 40px 20px;
    grid-column-gap: 40px;
    .main_photo {
      position: relative;
      min-height: 200px;
      min-width: 300px;
      .dropzone_style {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #d9d9d9;
        opacity: 0;
        transition: $transition;
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-radius: 15px;
        z-index: 9;
        &:hover {
          opacity: 0.8;
        }
      }
      .img {
        width: 300px;
        height: 200px;
        min-width: 300px;
        min-height: 200px;
        max-height: 200px;
        border-radius: 15px;
        border: 2px solid #DDDDDD;
        position: absolute;
        z-index: 5;
      }
      .empty_placeholder {
        background-color: #DDDDDD;
        min-width: 300px;
        min-height: 200px;
        background-image: url("assets/svg/icons/no_img_icon.svg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 50%;
        border-radius: 15px;
        display: flex;
      }
    }
    .object_documents_wrapper {
      background-color: #d9d9d9;
      border-radius: 15px;
      width: 100%;
      position: relative;
      .dropzone_style {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #d9d9d9;
        opacity: 0;
        transition: $transition;
        cursor: pointer;
        width: 100%;
        height: 100%;
        min-height: 200px;
        border-radius: 15px;
        z-index: 9;
        &:hover {
          opacity: 0.8;
        }
      }
      .files_wrapper {
        width: 100%;
        height: 100%;
        padding: 20px;
        border-radius: 15px;
        position: absolute;
        z-index: 5;
        overflow: auto;
      }
      .empty_placeholder {
        background-color: #DDDDDD;
        width: 100%;
        height: 100%;
        background-image: url("assets/svg/icons/no_img_icon.svg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 50%;
        border-radius: 15px;
        display: flex;
      }
    }

  }
  .tabs_wrapper {
    padding: 20px 40px;
    overflow: auto;
    .v-tab {
      color: #777777;
      max-height: 25px;
      margin: 0 20px 0 0!important;
      padding: 0 !important;
      border-bottom: 3px solid #FFFFff;
    }
    .v-tab:before {
      color: #000000;
    }
    .v-tab--active {
      color: #000000;
      border-bottom: 3px solid #FF6347;
    }

    .obj_prop_style {
      margin-bottom: 10px;

    }
    .v-expansion-panel-header {
      padding: 0 !important;
    }
  }

  .favorites_products_list {
    display: grid;
    grid-row-gap: 20px;
    .favorite_product_card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      grid-column-gap: 10px;
      .img {
        width: 60px;
        height: 60px;
        min-width: 60px;
        min-height: 60px;
        border-radius: 8px;
        border: 2px solid #DDDDDD;
      }
      .empty_placeholder {
        background-color: #DDDDDD;
        min-width: 60px;
        min-height: 60px;
        background-image: url("assets/svg/icons/no_img_icon.svg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: 50%;
        border-radius: 8px;
        display: flex;
      }
      .product_name_container {
        border-radius: 15px;
        border: 2px solid var(--gray_1, #DDD);
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        padding: 0 20px;
      }
    }
  }

  .footer {
    margin-top: auto;
    .object_footer_buttons {
      display: flex;
      grid-column-gap: 20px;
      justify-content: flex-end;
      padding: 20px 40px;

    }
  }

}



.object-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 1000px !important;
  max-height: 1000px !important;
  overflow: auto;

  &-top {
    display: inline-flex;
    //grid-template-columns: 30% 1fr;
    //column-gap: 10rem;
    padding: 20px 0 !important;
    align-items: center;
    position: sticky;
    background: #FFFFFF;
    top: 0;
    grid-column-gap: 1rem;
    z-index: 1;
    min-height: 78px;

    &__selector {
      display: flex;
      column-gap: 1rem;
      align-items: center;
      position: relative;
      min-width: 393px;

      &__title {
        font-weight: 400;
        font-size: 20px;
        color: #37392E;
      }

      &__select {
        width: 220px;
      }
    }

    &__map {
      width: 100%;
      height: 26px;
    }

    &__share {
      display: inline-flex;
      align-items: center;
      grid-column-gap: 0.5em;
      position: relative;
    }
  }

  &-documents {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    column-gap: 1rem;
    margin-bottom: 2em;

    %header_column {
      font-size: 16px;
      color: #37392E;
    }

    &__img-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      grid-row-gap: 1em;
      min-width: 393px;
      max-width: 393px;

      span {
        @extend %header_column;
      }

      .list-files-styled-wrapper {
        width: 393px;
        max-width: 393px;
        height: 246px;
        max-height: 246px;
      }

      &__img {
        //width: 400px;
        //height: 300px;
        border-radius: 5px;

        img {
          float: left;
          width: 393px;
          height: 246px;
          object-fit: cover;
        }
      }
    }

    &__docs {
      display: flex;
      flex-wrap: wrap;
      grid-row-gap: 1em;
      overflow: hidden;
      width: 100%;

      span {
        @extend %header_column;
      }

      &__dropzone {
        width: 100%;
        height: 100%;
        background: darkgrey;
        border-radius: 5px;
      }
    }
  }

  &-tabs {
    min-height: 300px;
    margin-bottom: 1rem;
    margin-top: 0.5rem;
    position: relative;
  }

  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    bottom: 0;
    background: white;
    padding: 15px 30px 15px 0;

    &__left {
      display: flex;
      column-gap: 3rem;
      align-items: center;
    }
  }
}

.object-wrapper-main {
  padding: 0 !important;
  margin-top: 15px;
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
}

@media (max-width: 768px) {
  .object-wrapper {

    &-top {
      display: flex;
      flex-direction: column;
      row-gap: 1rem;
      padding: 12px 16px !important;

      &__selector {
        min-width: unset;
      }
    }

    &-documents {
      display: flex;
      flex-direction: column;
      row-gap: 1rem;

      &__img-container {
        min-width: unset;
        max-width: unset;
        padding-top: 16px;

        .list-files-styled-wrapper {
          width: unset;
          max-width: unset;
        }
      }
    }

    &-main {
      padding: 0 16px !important;

      .v-slide-group.v-item-group > .v-slide-group__next, .v-slide-group.v-item-group > .v-slide-group__prev {
        //display: none !important;
      }
    }

    .object-wrapper-tabs {
      min-height: 150px;
    }

    &-footer {
      display: flex;
      padding: 12px 26px 20px 16px !important;
      bottom: 56px;

      &__left {
        column-gap: 2rem;
      }
    }
  }
}

.object-wrapper-top--mobile {
  width: 100%;
  top: 0;
  position: absolute;
  transform: translateY(0);
  transition: transform 0.6s ease-in-out;
}

.object-wrapper-top--mobile--move {
  transform: translateY(-150px);
}

.object-wrapper-main--mobile {
  padding-top: 150px !important;
  transition: padding-top 0.6s ease-in-out;
  margin-bottom: 54px;
}

.object-wrapper-main--mobile--move {
  padding-top: 0 !important;
}

.object_products {
  display: grid;
  grid-row-gap: 20px;
}
</style>
