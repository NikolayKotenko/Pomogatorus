<template>
  <div class="card_obj">
    <div class="img">
      <v-img
        height='100%'
        v-if="stateFilledImageObject"
        :class="{'empty_placeholder': ! stateFilledImageObject }"
        :src="$store.getters.getImageMainPhotoObjects(object_data['osnovnoe-foto-obekta'][0])">
      </v-img>
      <span v-else class="empty_placeholder">Фото объекта</span>
    </div>
    <div class="obj_info">
      <div class="header">
        <div class="name_and_address">
          <span class="name">{{ object_data.name }}</span>
          <span class="address">{{ object_data.address }}</span>
        </div>
        <div class="share_and_activity">
          <TooltipStyled :title="'Коллаборация'">
            <v-menu :close-on-content-click='false' left offset-y>
              <template v-slot:activator='{ on, attrs }'>
                <div style='display: inline-flex; grid-column-gap: 5px' v-bind='attrs' v-on='on'>
                  <v-icon
                    class="share"
                    color="#ADADAD"
                    v-bind='attrs'
                    v-on='on'
                    size="26"
                  >
                    mdi-account-group-outline
                  </v-icon>
                </div>
              </template>
              <Collaboration></Collaboration>
            </v-menu>
          </TooltipStyled>

          <TooltipStyled :title="stateCurrentObject ? 'Текущий объект' : 'Выбрать текущим'">
            <div class="activity">
              <v-simple-checkbox
                :value="stateCurrentObject"
                color="#000000"
                @click='setObject'
              ></v-simple-checkbox>
            </div>
          </TooltipStyled>

        </div>
      </div>
      <div>
        <TooltipStyled :title="'Заполнено параметров: '">
          <v-progress-linear
            class="progress_bar"
            value="15"
            background-opacity="0.3"
            color='#95D7AE'
            rounded
          ></v-progress-linear>
        </TooltipStyled>
      </div>
      <div class="footer">
        <div class="more_info">
          <section class='current_object__wrapper_info'
                   v-for="(obj, key) in $store.state.list_broadcast_snippet"
          >
            <span class='current_object__wrapper_info__text'>{{ obj.name }}:</span>
            <span class='current_object__wrapper_info__value'>{{object_data[obj.code] }}</span>
          </section>
        </div>
        <div class="button"
             @click='openDetailCard'>
          <ButtonStyled
            :local-text="'Открыть объект'"
            local-class="style_button"
            :href="$store.getters.stateObjectSelected ? '/objects/'+$store.state.currentObject.id : ''"
          ></ButtonStyled>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonStyled from "../Common/ButtonStyled.vue";
import ObjectDetail from "./ObjectDetail.vue";
import Collaboration from "../Modals/Collaboration.vue";
import TooltipStyled from "../Common/TooltipStyled.vue";


export default {
  name: "CardObject",
  props: ['object_data'],
  components: {TooltipStyled, Collaboration, ButtonStyled, ObjectDetail },
  data: () => ({
    showDetailObj: false
  }),
  mounted() {
    this.$store.dispatch('getListBroadcastSnippet')
  },
  watch: {},
  computed: {
    stateCurrentObject(){
      return this.object_data.id === this.$store.state.currentObject.id;
    },
    stateFilledImageObject(){
      if (! this.object_data.hasOwnProperty('osnovnoe-foto-obekta')) return false;

      return this.object_data['osnovnoe-foto-obekta'].length;
    },
    selectedObj() {
      if (!this.$store.state.currentObject) return false
      if (!Object.keys(this.$store.state.currentObject).length) return false
      return this.object_data.id === this.$store.state.currentObject?.id
    },
    modalWidth() {
      if (process.client) {
        return window.innerWidth * 0.5
      } else {
        return 0
      }
    }
  },
  methods: {
    setObject() {
      this.$store.commit('set_currentObject', this.object_data)
    },
    openDetailCard() {
      this.$emit('openDetail', this.object_data)
      // this.$store.state.modalCurrentObject = this.object_data
      // this.$store.state.listModal[1].isOpen = true
    },
    async closeDetail() {
      this.showDetailObj = false
      await this.$store.dispatch('loginByToken')
    }
  }
}
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
        align-items: start;
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
      align-items: end;
    }

      .more_info {
        display: grid;
      }

      .button {
  }
}
</style>
