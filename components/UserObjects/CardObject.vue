<template>
  <div class="card_obj">
    <div class="img">
      <VImg
        v-if="stateFilledImageObject"
        :class="{'empty_placeholder': ! stateFilledImageObject }"
        class="img"
        :src="$store.getters.getImageMainPhotoObjects(object_data['osnovnoe-foto-obekta'][0])"
        height="100%"
      />
      <span v-else class="empty_placeholder">Фото объекта</span>
    </div>
    <div class="obj_info">
      <div class="header">
        <div class="name_and_address">
          <span class="name">{{ object_data.name }}</span>
          <span class="address">{{ object_data.address }}</span>
        </div>
        <div class="share_and_activity">
          <CopyLinkButton :id-entry="object_data.id"/>
          <TooltipStyled :title="'Совместная работа'">
            <v-menu :close-on-content-click="false" left offset-y>
              <template #activator="{ on, attrs }">
                <div style="display: inline-flex; grid-column-gap: 5px" v-bind="attrs" v-on="on">
                  <v-icon
                    class="share"
                    color="#000000"
                    size="26"
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-account-group-outline
                  </v-icon>
                </div>
              </template>
              <Collaboration/>
            </v-menu>
          </TooltipStyled>

          <TooltipStyled :title="stateCurrentObject ? 'Текущий объект' : 'Выбрать текущим'">
            <div class="activity">
              <VSimpleCheckbox
                :value="stateCurrentObject"
                color="#000000"
                @click="setObject"
              />
            </div>
          </TooltipStyled>
        </div>
      </div>
      <div>
        <TooltipStyled :title="'Заполнено параметров: '">
          <VProgressLinear
            background-opacity="0.3"
            class="progress_bar"
            color="#95D7AE"
            rounded
            value="15"
          />
        </TooltipStyled>
      </div>
      <div class="footer">
        <div class="more_info">
          <section
            v-for="(obj, key) in $store.state.list_broadcast_snippet"
            class="current_object__wrapper_info"
          >
            <span class="current_object__wrapper_info__text">{{ obj.name }}:</span>
            <span class="current_object__wrapper_info__value">{{ object_data[obj.code] }}</span>
          </section>
        </div>
        <div
          class="button"
          @click="openDetailCard"
        >
          <ButtonStyled
            :local-text="'Открыть объект'"
            local-class="style_button"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonStyled from '../Common/ButtonStyled.vue';
import Collaboration from '../Modals/Collaboration.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import CopyLinkButton from '../Common/CopyLinkButton.vue';
import ObjectDetail from './ObjectDetail.vue';


export default {
  name: 'CardObject',
  components: { CopyLinkButton, TooltipStyled, Collaboration, ButtonStyled, },
  // eslint-disable-next-line vue/prop-name-casing
  props: ['object_data'],
  data: () => ({
    showDetailObj: false
  }),
  computed: {
    stateCurrentObject() {
      return this.object_data.id === this.$store.state.Objects.currentObject?.id;
    },
    stateFilledImageObject() {
      if (!this.object_data.hasOwnProperty('osnovnoe-foto-obekta')) return false;

      return this.object_data['osnovnoe-foto-obekta'].length;
    },
    selectedObj() {
      if (!this.$store.state.Objects.currentObject) return false;
      if (!Object.keys(this.$store.state.Objects.currentObject).length) return false;
      return this.object_data.id === this.$store.state.Objects.currentObject?.id;
    },
    modalWidth() {
      if (process.client) {
        return window.innerWidth * 0.5;
      } else {
        return 0;
      }
    }
  },
  watch: {},
  mounted() {
    this.$store.dispatch('getListBroadcastSnippet');
  },
  methods: {
    async setObject() {
      await this.$store.dispatch('Objects/setCurrentObject', this.object_data);
    },
    openDetailCard() {
      this.$emit('open-detail', this.object_data);
      // this.$store.state.Objects.modalCurrentObject = this.object_data
      // this.$store.state.listModal[1].isOpen = true
    },
    async closeDetail() {
      this.showDetailObj = false;
      await this.$store.dispatch('loginByToken');
    }
  }
};
</script>

<style lang="scss" scoped>
.card_obj {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin: 0 10px 0 10px;
  border-radius: 5px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  transition: all 0.4s ease-in-out !important;

  &:hover {
    box-shadow: 0px 5px 20px 7px rgba(34, 60, 80, 0.2) !important;
    background-color: #FFF4CB;
  }

  .img {
    width: 250px;
    height: 160px;
    min-width: 250px;
    min-height: 160px;
    margin-right: 20px;
    border-radius: 5px;

    .empty_placeholder {
      background-color: #D9D9D9;
      min-width: 250px;
      min-height: 160px;

      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #FFFFFF;
      font-size: 1.3em;
    }
  }

  .obj_info {
    width: 100%;
    display: grid;
    grid-row-gap: 1em;
    //background-color: #FFFFFF !important;
  }

  .header {
    display: flex;
    justify-content: space-between;

  }

  .name_and_address {
    display: grid;
  }

  .name {
    font-size: 1.5em;
    font-weight: 400;
  }

  .address {
    font-size: 1.2em;
    font-weight: 300;
  }

  .share_and_activity {
    display: flex;
    align-items: flex-start;
  }

  .share {
    &:hover {
      color: #000000 !important;
    }
  }

  .activity {
    margin-left: 24px;
  }

  .progress_bar {
    width: auto;
    height: 16px !important;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .more_info {
    display: grid;
  }
}

@media only screen and (max-width: 767px) {
  .card_obj {
    flex-direction: column;
    row-gap: 1rem;

    .footer {
      flex-direction: column;
      row-gap: 1rem;

      .more_info {
        width: 100%;
      }

      .button {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  }
  .img {
    margin-right: 0 !important;
  }
  .header{
    display: grid !important;
    justify-content: center !important;
  }
  .name_and_address {
    justify-content: center;
    .name {
      font-size: 1.2em;
    }
    .address {
      font-size: 1em;
    }
  }
  .share_and_activity {
    justify-content: center;
  }
}
</style>
