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
          :data="object.name"
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
        <SelectGeo v-if="notEmptyObject" :data="object" :outer-coords="getCoords" @set-new-address="setAddressMap"/>
      </div>
    </div>

    <div class="images_wrapper">
      <div class="main_photo">
        <v-img
          v-if="stateFilledImageObject"
          :class="{'empty_placeholder': ! stateFilledImageObject }"
          :src="$store.getters.getImageMainPhotoObjects(objectData['osnovnoe-foto-obekta'][0])"
          class="img"
          height="100%"
        />
        <span v-else class="empty_placeholder"/>
      </div>
      <div class="object_documents_wrapper"/>
    </div>

    <!--    <v-tabs color="#000000"> -->
    <!--      <v-tab :key="0"> -->
    <!--        Параметры объекта -->
    <!--      </v-tab> -->
    <!--      <v-tab -->
    <!--        :key="1" -->
    <!--        @click="$store.dispatch('NomenclatureModule/getListFavoriteNomenclatureByUserAndObjectId')" -->
    <!--      > -->
    <!--        Избранное оборудование -->
    <!--        <v-badge -->
    <!--          :content="$store.state.NomenclatureModule.listFavoriteNomenclature.length" -->
    <!--          :value="$store.state.NomenclatureModule.listFavoriteNomenclature.length" -->
    <!--          color="#95D7AE" -->
    <!--        /> -->
    <!--      </v-tab> -->
    <!--      <v-tab :key="2"> -->
    <!--        Купленное оборудование -->
    <!--      </v-tab> -->
    <!--      <v-tab :key="3"> -->
    <!--        Установленное оборудование -->
    <!--      </v-tab> -->

    <!--      &lt;!&ndash; Параметры объекта &ndash;&gt; -->
    <!--      <v-tab-item :key="0"> -->
    <!--        <v-card-text -->
    <!--          ref="scrollParent" -->
    <!--          :class="{'object-wrapper-main&#45;&#45;mobile': isMobile, 'object-wrapper-main&#45;&#45;mobile&#45;&#45;move': isMoving}" -->
    <!--          class="object-wrapper-main" -->
    <!--          style="height: 1200px;" -->
    <!--        > -->
    <!--          <div ref="docContent" class="object-wrapper-documents"> -->
    <!--            <div class="object-wrapper-documents__img-container"> -->
    <!--              <span>Фото объекта</span> -->
    <!--              <div -->
    <!--                :class="{'dropzone-empty': ! $store.getters.getMainPhotoObject(object) }" -->
    <!--                class="list-files-styled-wrapper img-activator" -->
    <!--              > -->
    <!--                <img -->
    <!--                  v-if="$store.getters.getMainPhotoObject(object)" -->
    <!--                  :src="$store.state.BASE_URL + $store.getters.getMainPhotoObject(object).full_path" -->
    <!--                  :title="$store.getters.getMainPhotoObject(object).title_image" -->
    <!--                  class="img-hover" -->
    <!--                  height="100%" -->
    <!--                  style="object-fit: cover" -->
    <!--                  width="100%" -->
    <!--                > -->
    <!--                <span v-else class="empty-placeholder">Здесь будут фото вашего объекта</span> -->
    <!--              </div> -->
    <!--            </div> -->

    <!--            <div class="object-wrapper-documents__docs"> -->
    <!--              <span>Прикрепленные документы</span> -->
    <!--              <ListFilesStyled -->
    <!--                v-if="objectData.id" -->
    <!--                :data="object" -->
    <!--                :id-object="objectData.id" -->
    <!--                @remove-from-global="removeFromGlobal" -->
    <!--              /> -->
    <!--            </div> -->
    <!--          </div> -->

    <!--          <div class="object-wrapper-tabs"> -->
    <!--            <TabsCustom -->
    <!--              ref="tabContent" -->
    <!--              :data-object="object" -->
    <!--              :deleted-file="deletedFile" -->
    <!--              @update-prop="setField" -->
    <!--              @update-file="setFileField" -->
    <!--              @change-tab="changeTab" -->
    <!--              @remove-file="removeFile" -->
    <!--              @focus-out-field="animationSaveBtn" -->
    <!--            /> -->

    <!--            <div :class="{'show-more': showMore}" class="more-arrow"> -->
    <!--              <img alt="more" src="@/assets/svg/chevron-more.svg" @click="scrollBot"> -->
    <!--            </div> -->
    <!--          </div> -->
    <!--        </v-card-text> -->
    <!--      </v-tab-item> -->

    <!--      &lt;!&ndash; Оборудование на объекте &ndash;&gt; -->
    <!--      <v-tab-item :key="1"> -->
    <!--        <v-container class="object_products"> -->
    <!--          <div -->
    <!--            v-for="(item, index) in $store.state.NomenclatureModule.listFavoriteNomenclature" -->
    <!--            :key="index" -->
    <!--          > -->
    <!--            <span>{{ item.name }}</span> -->
    <!--          </div> -->
    <!--        </v-container> -->
    <!--      </v-tab-item> -->
    <!--      <v-tab-item :key="2"> -->
    <!--        <v-container class="object_products"/> -->
    <!--      </v-tab-item> -->
    <!--      <v-tab-item :key="3"> -->
    <!--        <v-container class="object_products"/> -->
    <!--      </v-tab-item> -->
    <!--    </v-tabs> -->

    <div class="object-wrapper-footer">
      <template v-if="isMobile">
        <div class="object-wrapper-footer__left">
          <ButtonStyled
            :custom-slot="true"
            :is-animation="animationBtn"
            :is-loading="isLoadingObjects"
            :is-mobile="true"
            local-class="style_button"
            @click-button="closeModal"
          >
            <v-icon>
              mdi-content-save-outline
            </v-icon>
          </ButtonStyled>

          <ButtonStyled
            :custom-slot="true"
            :is-mobile="true"
            @click-button="stateTagsTechBlock = true;"
          >
            <v-icon>mdi-tray-arrow-down</v-icon>
          </ButtonStyled>
        </div>

        <ButtonStyled
          :custom-slot="true"
          :is-mobile="true"
          local-class="style_close"
          local-text="Отмена"
          @click-button="closeModal"
        >
          <v-icon>
            mdi-window-close
          </v-icon>
        </ButtonStyled>

        <v-dialog
          v-model="stateTagsTechBlock"
          width="1080"
        >
          <v-card>
            <v-card-title class="d-flex justify-end">
              <v-icon @click="stateTagsTechBlock = false;">
                mdi-close
              </v-icon>
            </v-card-title>
            <v-card-text>
              <TagsTechBlock/>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>

      <template v-else>
        <div class="object-wrapper-footer__left">
          <ButtonStyled
            :is-animation="animationBtn"
            :is-loading="isLoadingObjects"
            local-class="style_button"
            local-text="Сохранить изменения"
            @click-button="onSave"
          />

          <ButtonStyled
            :custom-slot="true"
            @click-button="closeModal"
          >
            <span>
              Скачать PDF
            </span>
          </ButtonStyled>
        </div>

        <ButtonStyled
          local-class="style_close"
          local-text="Закрыть"
          @click-button="closeModal"
        />
      </template>
    </div>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import Vue from 'vue';
import TabsCustom from '../Common/TabsCustom';
import SelectObjectStyled from '../Common/SelectObjectStyled';
import SelectGeo from '../Common/SelectGeo';
import ButtonStyled from '../Common/ButtonStyled';
import TooltipStyled from '../Common/TooltipStyled.vue';
import CopyLinkButton from '../Common/CopyLinkButton.vue';
import ListFilesStyled from '~/components/Common/ListFilesStyled';
import Collaboration from '~/components/Modals/Collaboration';
import InputStyled from '~/components/Common/InputStyled';
import TagsTechBlock from '~/components/Widgets/TagsTechBlock';

export default {
  name: 'ObjectGlobal',
  components: {
    TagsTechBlock,
    InputStyled,
    CopyLinkButton,
    TooltipStyled,
    Collaboration,
    ListFilesStyled,
    ButtonStyled,
    SelectGeo,
    SelectObjectStyled,
    TabsCustom
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
    }
  },
  mounted() {
    this.getObjectFromProp();

    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client && this.$refs.scrollParent) {
      const tabContent = this.$refs.scrollParent;
      tabContent.addEventListener('scroll', this.scrollWindow);
      if (this.isMobile) {
        tabContent.addEventListener('scroll', this.scrollHeader, false);
      }
      this.scrollWindow();
    }
  },
  computed: {
    ...mapState('Objects', ['isLoadingObjects', 'listObjects']),
    ...mapGetters(['getUserId']),

    notEmptyObject() {
      return !!Object.keys(this.object).length;
    },
    getCoords() {
      return this.object?.long && this.object?.lat ? [this.object.lat, this.object.long] : [55.753215, 37.622504];
    },
    showMore() {
      return ((this.parentHeight + this.scrollHeight + this.minHeightInput) <= this.maxScroll);
    },
    isMobile() {
      return this.$device.isMobile;
    },
    stateFilledImageObject() {
      if (!this.objectData.hasOwnProperty('osnovnoe-foto-obekta')) return false;

      return this.objectData['osnovnoe-foto-obekta'].length;
    },
  },
  methods: {
    ...mapActions('Objects', ['saveObjData', 'getListObjectsByUserId']),
    ...mapMutations('Tabs', ['setLoadingData']),

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
    changeTab() {
      this.scrollWindow();
    },
    async onSave() {
      this.$toast.success('Данные сохранены', { duration: 5000 });
      await this.saveObjData({ id: this.object.id, keys: this.updateProperties });
      // Для обновления списка который прокидываем в SelectObjectStyled
      await this.getListObjectsByUserId();
      // Для переключения режима редактирования выбора того же селекта
      this.stateSelectEditNameObject = true;
      this.closeModal();
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
      this.object.name = name;
      this.updateProperties.name = name;
    },
    setStateSelectedEditName() {
      if (!this.stateSelectEditNameObject) {
        this.onSave();
      }
      this.stateSelectEditNameObject = !this.stateSelectEditNameObject;
    },
    setField(data) {
      this.object[data.key] = data.value;
      this.updateProperties[data.key] = data.value;
    },
    setFileField(data) {
      if (!this.object[data.key]) {
        Vue.set(this.object, data.key, [data.value]);
      } else {
        this.object[data.key].push(data.value);
      }
      this.updateProperties[data.key] = data.value;
    },
    removeFile(data) {
      const index = this.object[data.key].findIndex(file => file.id === data.value);

      if (index !== -1) {
        this.object[data.key].splice(index, 1);
      }
    },
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
      this.object = value;

      // Не нужно выставлять текущий объект
      // await this.$store.dispatch("Objects/setCurrentObject", value);

      // TODO: Отрефакторить, но завтра сдаваться
      this.$nextTick(() => {
        this.setLoadingData(false);
      });

      // Событие изменение селекта прокидываем выше
      this.$emit('change-select-object', value);
    },
    setAddressMap(data) {
      this.object.address = data.address;
      this.object.lat = data.coords[0];
      this.object.long = data.coords[1];

      this.updateProperties.address = data.address;
      this.updateProperties.lat = data.coords[0];
      this.updateProperties.long = data.coords[1];
    }
  },
  destroyed() {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (process.client) {
      window.removeEventListener('scroll', this.scrollWindow);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.object_wrapper {
  font-family: 'Inter', sans-serif;
  display: flex;
  min-height: 1000px !important;
  max-height: 1000px !important;
  overflow: auto;
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
    padding: 0 40px;
    .main_photo {
      .img {
        width: 300px;
        height: 200px;
        min-width: 300px;
        min-height: 200px;
        border-radius: 15px;
        border: 2px solid #DDDDDD;

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
    }
    .object_documents_wrapper {}

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
