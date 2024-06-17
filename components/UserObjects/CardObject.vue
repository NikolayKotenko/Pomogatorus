<template>
  <div class="card_obj">
    <div class="img">
      <v-img
        v-if="stateFilledImageObject"
        :class="{'empty_placeholder': ! stateFilledImageObject }"
        :src="$store.getters.getImageMainPhotoObjects(object_data['osnovnoe-foto-obekta'][0])"
        class="img"
        height="100%"
      />
      <span v-else class="empty_placeholder"/>
    </div>
    <div class="obj_info">
      <div class="header">
        <div class="name_and_address">
          <span class="name">{{ object_data.name }}</span>
          <span class="address">{{ object_data.address }}</span>
        </div>
        <!--        <div class="share_and_activity"> -->
        <!--          <TooltipStyled :title="stateCurrentObject ? 'Ваш текущий объект' : 'Выбрать текущим'"> -->
        <!--            <div class="activity"> -->
        <!--              <VSimpleCheckbox -->
        <!--                :value="stateCurrentObject" -->
        <!--                color="#000000" -->
        <!--                @click="setObject" -->
        <!--              /> -->
        <!--            </div> -->
        <!--          </TooltipStyled> -->
        <!--        </div> -->
      </div>
      <div class="prop_wrapper">
        <div
          v-for="(prop, index) in object_data.m_to_m_objects_properties.slice(1)"
          :key="index"
          class="obj_properties"
        >
          <div class="prop_name">
            {{ prop._name_column + ': ' }}
          </div>
          <div class="dots_border"/>
          <div class="prop_value">
            {{ prop.value }}
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="fullness_obj">
          <div class="fullness_percent">
            {{ valueFullnessObj + '%' }}
          </div>
          <v-progress-linear
            background-opacity="0.3"
            class="progress_bar"
            color="#FF6347"
            height="14"
            :value="valueFullnessObj"
          />
        </div>
        <div v-if="stateCurrentObject" class="selected_obj_btn">
          Выбран глав. объектом
        </div>
        <div v-else class="no_selected_obj_btn" @click="setObject">
          Сделать глав. объектом
        </div>
        <div
          class="open_obj_btn"
          @click="openDetailCard"
        >
          Открыть
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


export default {
  name: 'CardObject',
  components: { CopyLinkButton, TooltipStyled, Collaboration, ButtonStyled },
  // eslint-disable-next-line vue/prop-name-casing
  props: ['object_data'],
  data: () => ({
    showDetailObj: false,
    valueFullnessObj: 15,
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
  },
  methods: {
    async setObject() {
      await this.$store.dispatch('Objects/setCurrentObject', this.object_data);
      this.$toast.success('Объект выбран', { duration: 5000 });
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
@import 'assets/styles/style';

.card_obj {
  display: flex;
  grid-column-gap: 20px;
  max-width: 890px;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  //margin: 0 10px 0 10px;
  border-radius: 30px;
  background-color: #FFFFFF;
  margin-left: auto;
  margin-right: auto;
  transition: $transition !important;
  &:hover {
    box-shadow: $shadowBox !important;
  }

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

  .obj_info {
    width: 100%;
    display: grid;
    height: 100%;
    align-content: space-between;
    .header {
      display: flex;
      justify-content: space-between;
      .name_and_address {
        display: grid;
      }

      .name {
        font-size: 1.25em;
        font-weight: 600;
      }
      .address {
        font-weight: 500;
        color: #777777;
      }
    }
    .obj_properties {
      display: flex;
      text-wrap: nowrap;
      color: #8A8784;
      font-size: .875em;
      .prop_name {

      }
      .dots_border {
        border-bottom: 1px dotted #111111;
        width: 100%;
        margin-bottom: 5px;
      }
      .prop_value {
        color: #000000;
      }
    }
    .footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      .fullness_obj {
        max-width: 144px;
        width: 100%;
        .fullness_percent {
          display: flex;
          justify-content: center;
        }
        .progress_bar {
          border-radius: 30px;
        }
      }
      .selected_obj_btn {
        padding: 0 20px;
        background-color: #FF6347;
        color: #FFFFFF;
        border-radius: 15px;
        text-wrap: nowrap;
        font-weight: 600;
        display: flex;
        align-items: center;
        height: 40px;
        cursor: pointer;
      }
      .no_selected_obj_btn {
        padding: 0 20px;
        background-color: #d9d9d9;
        border-radius: 15px;
        text-wrap: nowrap;
        font-weight: 600;
        display: flex;
        align-items: center;
        height: 40px;
        cursor: pointer;
      }
      .open_obj_btn {
        padding: 0 20px;
        background-color: #d9d9d9;
        border-radius: 15px;
        text-wrap: nowrap;
        font-weight: 600;
        display: flex;
        align-items: center;
        height: 40px;
        cursor: pointer;
      }
    }
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
  .header {
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
