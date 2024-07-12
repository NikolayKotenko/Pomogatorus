<template>
  <div class="current_object" :class="{'isNoWidgetStyle' : isNoWidget}">
    <div class="current_object_title">
      Текущий объект
    </div>

    <v-divider style="border-color: #DDDDDD;"/>

    <TooltipStyled
      :title="$store.getters.stateAuth ?
        'Выбрать объект или создать новый' : 'Для выбора объекта - авторизуйтесь'"
    >
      <div
        class="select_object_style"
        @click="callAuthModal"
      >
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
          :placeholder="$store.getters.stateAuth ? 'Выберите объект' : 'Сначала авторизуйтесь'"
          title="Выберите объект"
          @update-input="callback"
        />
      </div>
    </TooltipStyled>

    <TooltipStyled :title="$store.getters['Objects/getFirstPhotoObject']['filename'] || 'Фото объекта'">
      <!--      <v-img class="current_object__image"> -->
      <!--        <v-icon class="current_object__image__icon" x-large> -->
      <!--          mdi-map-marker-outline -->
      <!--        </v-icon> -->
      <!--      </v-img> -->
      <div>
        <v-img
          v-if="$store.getters['Objects/getFirstPhotoObject']['full_path']"
          :src="$store.state.BASE_URL + $store.getters['Objects/getFirstPhotoObject']['full_path']"
          max-height="200"
          class="object_image"
        />
        <img
          v-else
          class="no_object_image"
          :src="require(`~/assets/svg/icons/no_img_icon.svg`)"
        >
      </div>
    </TooltipStyled>

    <!-- Циклом параметры по булеву "транслировать в сниппет" -->
    <div
      class="options_wrapper"
    >
      <div
        v-for="(obj, key) in $store.state.list_broadcast_snippet"
        :key="key"
        class="options_list"
      >
        <span class="options_text">{{ obj.name }}:</span>
        <div class="dots_border"/>
        <span class="options_value">{{ $store.state.Objects.currentObject[obj.code] }}</span>
      </div>
    </div>

    <v-divider style="border-color: #DDDDDD;"/>

    <div class="buttons_wrapper">
      <TooltipStyled :title="'Перейти к объекту'">
        <ButtonStyled
          :href="$store.getters['Objects/stateObjectSelected'] ? '/objects/'+$store.state.Objects.currentObject.id : ''"
          :is-disabled="$store.getters.stateAuth ? $store.state.Objects.isLoadingObjects : true"
          :is-loading="$store.getters.stateAuth ? $store.state.Objects.isLoadingObjects : false"
          :local-text="'Открыть'"
          local-class="style_object_button"
        />
      </TooltipStyled>
    </div>

    <!--    <TagsTechBlock v-if="state_tech_task_block"/> -->
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

      this.$store.dispatch('openAuthModal');
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
  padding: 20px 0;
  height: auto;
  max-height: 768px;
  width: 415px;
  min-width: 250px;
  border-radius: 30px;
  //max-height: 500px;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  grid-row-gap: 20px;

  transition: $transition !important;
  background: white;
  overflow-y: overlay;
  .current_object_title {
    font-size: 1.25em;
    font-weight: 600;
    display: flex;
    justify-content: space-around;
  }
  .select_object_style {
    padding: 0 20px;
  }
  .object_image {
    margin: 0 20px;
    border-radius: 15px;
    max-height: 200px;
  }
  .no_object_image {
    margin: 0 20px;
    border-radius: 15px;
    border: 1px solid #AAAAAA;
    max-height: 200px;
    max-width: 375px;
    width: 100%;
    background-color: #DDDDDD;
    .no_photo_icon {
      position: absolute;
      margin: auto;
      width: 100%;
      height: 100%;
    }
  }
  .options_wrapper {
    padding: 20px 40px 0 40px;
    display: grid;
    grid-row-gap: 10px !important;
    .options_list {
      display: flex;
      width: 100%;
      font-size: 1em;
      color: #8A8784;
      margin-top: auto;
      text-wrap: nowrap;
      .dots_border {
        border-bottom: 1px dotted #111111;
        width: 100%;
        margin-bottom: 5px;
      }
    }
  }
  .buttons_wrapper {
    padding: 0 20px;
    max-width: 375px;
  }

}
</style>

<style lang="scss">
.v-expansion-panel-content__wrap{
  padding: 0 20px 20px !important;
}
</style>
