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
          :src="require(`~/assets/mascot/pomogaikin_thumb_up.svg`)"
          class="mascot_img"
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
            class="input"
            outlined
            suffix="₽"
            height="40"
            dense
            hide-details
            :label="selectDonatPrice"
          />
        </div>
        <div
          class="donat_prices_buttons"
        >
          <div
            v-for="(donat, index) in donatPrices"
            :key="index"
            class="button"
          >
            +{{ donat.price }}₽
          </div>
        </div>
        <ButtonStyled
          :local-text="'Поддержать'"
          local-class="support_btn"
        />
        <div class="uninteresting_btn">
          Мне это не интересно
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
    donatPrices: [
      { price: 100 },
      { price: 200 },
      { price: 300 },
      { price: 400 },
      { price: 500 },
    ],
    selectDonatPrice: 100,

  }),
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
    .mascot_img {
      position: absolute;
      right: 25px;
      bottom: -7px;
      filter: drop-shadow(5px 5px 10px rgba(255, 99, 77, 0.5))
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
      align-self: center;
    }
  }
}
</style>
