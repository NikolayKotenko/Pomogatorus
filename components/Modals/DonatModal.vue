<template>
  <v-dialog
    v-model="$store.state.ArticleModule.stateDonatModal"
    width="560"
  >
    <div class="modal_donat_wrapper">
      <div class="img_block">
        <img
          :src="require(`~/assets/svg/icons/bg_grid.svg`)"
          alt=""
        >
        <img
          v-show="sumDonatPrice < 300"
          :src="require(`~/assets/mascot/pomogaikin_thumb_up.svg`)"
          class="mascot_img"
        >
        <img
          v-show="sumDonatPrice >= 300 && sumDonatPrice < 500"
          :src="require(`~/assets/mascot/joyful_pomogaikin.svg`)"
          class="mascot_img"
        >
        <img
          v-show="sumDonatPrice >= 500"
          :src="require(`~/assets/mascot/jubilant_pomogaikin.svg`)"
          class="mascot_img"
          style="right: 0;"
        >
        <div class="popup_wrapper">
          <img
            :src="require(`~/assets/svg/popup_window.svg`)"
            class="popup_img"
          >
          <div class="popup_message">
            <div class="header">
              Поддержите
              стартап!
            </div>
            <div class="text">
              Поддержите развитие помогаторус,
              чтобы получить доступ к новым функциям в будущем.
              <span class="btn">подробнее</span>
            </div>
          </div>
        </div>
      </div>
      <div class="donat_wrapper">
        <div class="input_wrapper">
          <div class="input_header">
            Сумма доната, ₽
          </div>
          <v-text-field
            v-model="sumDonatPrice"
            class="input"
            outlined
            suffix="₽"
            height="40"
            dense
            type="number"
            hide-details
          />
        </div>
        <div
          class="donat_prices_buttons"
        >
          <div
            v-for="(donat, index) in addingDonationPrices"
            :key="index"
            class="button"
            @click="calcDonatSum(donat.price)"
          >
            +{{ donat.price }}₽
          </div>
        </div>
        <ButtonStyled
          :local-text="'Поддержать'"
          local-class="support_btn"
        />
        <div
          class="uninteresting_btn"
          @click="closeModal"
        >
          <div>Мне это не интересно</div>
        </div>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import ButtonStyled from '../Common/ButtonStyled.vue'

export default {
  name: 'DonatModal',
  components: { ButtonStyled },
  props: {
  },
  data: () => ({
    addingDonationPrices: [
      { price: 100 },
      { price: 200 },
      { price: 300 },
      { price: 400 },
      { price: 500 },
    ],
    sumDonatPrice: 100,
  }),
  methods: {
    calcDonatSum(addedValue) {
      this.sumDonatPrice = +(this.sumDonatPrice || 0) + addedValue;
    },
    closeModal(){
      this.$store.dispatch('closeDonatModal')
    }
  },
}
</script>

<style scoped lang="scss">
@import 'assets/styles/style';

.modal_donat_wrapper {
  background-color: $white-color;
  font-family: 'Inter', sans-serif;
  display: grid;
  .img_block {
    background-color: $grey1;
    position: relative;
    max-height: 290px;
    z-index: 99;
    .mascot_img {
      position: absolute;
      right: 25px;
      bottom: -7px;
      filter: drop-shadow(5px 5px 10px rgba(145, 147, 148, 1));
      z-index: 100;
      animation: 1s show ease, 1s fade ease;
      @keyframes show {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    }
    .popup_wrapper {
      position: absolute;
      left: 25px;
      top: 55px;
      .popup_img {
        position: absolute;
      }
      .popup_message {
        position: absolute;
        left: 35px;
        top: 25px;
        .header {
          @extend .header-page;
          padding-bottom: 10px;
        }
        .text {
          @extend .regular-text;
          color: $grey4 !important;
          width: 240px;
        }
        .btn {
          color: $grey3;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
  .donat_wrapper {
    padding: 20px 40px;
    .input_wrapper {
      @extend .regular-text;
      font-weight: 600 !important;
      .input {
        border-radius: $b-r16;
        padding-top: 6px;
      }
    }
    .donat_prices_buttons {
      display: flex;
      width: 100%;
      justify-content: space-between;
      padding: 20px 0;
      .button {
        cursor: pointer;
        height: 40px;
        width: 100%;
        max-width: 86px;
        border: 1px solid $black-color;
        border-radius: $b-r16;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          transition: $transition;
          background-color: $red;
          border: 1px solid $red;
          color: $white-text-color;
        }
      }
    }
    .uninteresting_btn {
      display: flex;
      justify-content: center;
      padding-top: 20px;
      color: $grey3;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
</style>
