<template>
  <div class="current_object" :class="{'isNoWidgetStyle' : isNoWidget}">
    <TooltipStyled
      :title="$store.getters.stateAuth ?
        'Выбрать объект или создать новый' : 'Для выбора объекта - авторизуйтесь'"
    >
      <div @click="callAuthModal">
        <SelectObjectStyled
          :custom-style="true"
          :data="$store.state.Objects.currentObject"
          :have-trigger="true"
          :is-disabled="$store.getters.stateAuth ? $store.state.Objects.isLoadingObjects : true"
          :is-loading="$store.getters.stateAuth ? $store.state.Objects.isLoadingObjects : false"
          :is-solo="true"
          :item-text="'name'"
          :item-value="'id'"
          :items="$store.state.Objects.listObjects"
          :placeholder="$store.getters.stateAuth ? 'Выберите объект' : 'Авторизуйтесь'"
          title="Выберите объект"
          @update-input="callback"
        />
      </div>
    </TooltipStyled>

    <div>
      <v-badge
        :content="$store.getters['NomenclatureModule/getCountFavoriteNomenclatures']"
        :value="$store.getters['NomenclatureModule/getCountFavoriteNomenclatures']"
        color="#95D7AE"
        overlap
      >
        <IconTooltip
          :color-icon="'B3B3B3'"
          :size-icon="'32'"
          :icon-text="'mdi-heart-outline'"
          :text-tooltip="'Избранного оборудования на объекте'"
        />
      </v-badge>
    </div>

    <TooltipStyled :title="$store.getters['Objects/getFirstPhotoObject']['filename'] || 'Фото объекта'">
      <!--      <v-img class="current_object__image"> -->
      <!--        <v-icon class="current_object__image__icon" x-large> -->
      <!--          mdi-map-marker-outline -->
      <!--        </v-icon> -->
      <!--      </v-img> -->
      <div class="current_object__image">
        <v-img
          v-if="$store.getters['Objects/getFirstPhotoObject']['full_path']"
          :src="$store.state.BASE_URL + $store.getters['Objects/getFirstPhotoObject']['full_path']"
          height="100%"
        />
        <div v-else>
          <v-img class="current_object__image">
            <v-icon class="current_object__image__icon" x-large>
              mdi-map-marker-outline
            </v-icon>
          </v-img>
        </div>
      </div>
    </TooltipStyled>

    <!-- Циклом параметры по булеву "транслировать в сниппет" -->
    <section
      v-for="(obj, key) in $store.state.list_broadcast_snippet"
      :key="key"
      class="current_object__wrapper_info"
    >
      <span class="current_object__wrapper_info__text">{{ obj.name }}:</span>
      <span class="current_object__wrapper_info__value">{{ $store.state.Objects.currentObject[obj.code] }}</span>
    </section>

    <section class="current_object__wrapper_info">
      <span class="current_object__wrapper_info__text">Параметры объекта:</span>
      <span class="current_object__wrapper_info__value">13 из 22</span>
    </section>
    <section class="current_object__wrapper_info">
      <span class="current_object__wrapper_info__text">ТЗ объекта: {{ $store.state.Objects.currentObject.name
      }}</span>
      <span class="current_object__wrapper_info__value">7 из 130</span>
      <div class="wrapper_button">
        <TooltipStyled :title="'Перейти к объекту'">
          <ButtonStyled
            :href="$store.getters['Objects/stateObjectSelected'] ? '/objects/'+$store.state.Objects.currentObject.id : ''"
            :is-disabled="$store.getters.stateAuth ? $store.state.Objects.isLoadingObjects : true"
            :is-loading="$store.getters.stateAuth ? $store.state.Objects.isLoadingObjects : false"
            :local-text="'Открыть'"
            local-class="style_button"
          />
        </TooltipStyled>
        <TooltipStyled :title="'Сгенерировать PDF Технического Задания'">
          <ButtonStyled
            :custom-slot="true"
            :is-disabled="$store.getters.stateAuth ? $store.state.Objects.isLoadingObjects : true"
            :is-loading="$store.getters.stateAuth ? $store.state.Objects.isLoadingObjects : false"
            local-class="style_button"
            @click-button="state_tech_task_block = !state_tech_task_block"
          >
            <span>{{ state_tech_task_block ? 'Скрыть&nbsp; ТЗ' : 'Создать ТЗ' }}</span>
            <v-icon>{{ state_tech_task_block ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
          </ButtonStyled>
        </TooltipStyled>
      </div>
      <TagsTechBlock v-if="state_tech_task_block"/>
    </section>
  </div>
</template>

<script>
import SelectObjectStyled from '../Common/SelectObjectStyled'
import IconTooltip from '../Common/IconTooltip.vue'
import TooltipStyled from '~/components/Common/TooltipStyled'
import ButtonStyled from '~/components/Common/ButtonStyled'
import TagsTechBlock from '~/components/Widgets/TagsTechBlock'

export default {
  name: 'CurrentObjects',
  // eslint-disable-next-line vue/no-unused-components
  components: {
    IconTooltip,
    TagsTechBlock,
    ButtonStyled,
    TooltipStyled,
    SelectObjectStyled
  },
  // eslint-disable-next-line vue/prop-name-casing
  props: {
    isNoWidget: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      state_tech_task_block: false,
      alert: {
        state: false,
        message: ''
      }
    }
  },
  computed: {
    stateCurrentObject() {
      if (!this.object_data) return false;

      return this.object_data.id === this.$store.state.Objects.currentObject?.id;
    },
    stateFilledImageObject() {
      if (!this.object_data?.('osnovnoe-foto-obekta')) return false

      return this.object_data['osnovnoe-foto-obekta'].length
    },

  },
  watch: {
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
  mounted() {
    this.getSnippet()
    this.$store.dispatch('NomenclatureModule/getListFavoriteNomenclatureByUserAndObjectId')
  },
  methods: {
    callAuthModal() {
      if (this.$store.getters.stateAuth) return false;

      this.$store.commit('set_modal_auth', true);
    },
    async callback(data) {
      await this.$store.dispatch('Objects/setCurrentObject', data)
    },

    async getSnippet() {
      await this.$store.dispatch('getListBroadcastSnippet')
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'assets/styles/style';

.isNoWidgetStyle {
  padding: 20px;
  width: 290px !important;
  min-width: 290px !important;
}


.current_object {
  height: auto;
  max-height: 768px;
  width: 250px;
  min-width: 250px;
  border-radius: 10px;
  //max-height: 500px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  grid-row-gap: 1em;

  transition: $transition !important;
  background: white;
  overflow-y: overlay;




  &__label {
    font-size: 1.25em;

    &__container {
      display: flex;
      justify-content: space-between;
    }

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
}
</style>

<style lang="scss">
.v-expansion-panel-content__wrap{
  padding: 0 20px 20px !important;
}
</style>
