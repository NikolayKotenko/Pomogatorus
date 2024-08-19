<template>
  <v-container>
    <SubHeader/>
    <div class="card_wrapper">
      <div class="img_container">
        <img :src="require('/assets/svg/icons/bg_small_grid.svg')" class="grid_style_img">
        <img :src="require('/assets/mascot/pomogaikin_with_wrench.svg')" class="pomogaikin_img">
      </div>
      <div class="right_container">
        <div class="title_wrapper">
          <v-divider style="border-width: 3px; border-color: #111111 !important;" vertical/>
          <div class="title">
            Ведётся разработка, подождите
          </div>
        </div>
        <div class="description">
          Некоторые функции сайта ещё недоступны, но вы можете подписаться на уведомления и следить за обновлениями
        </div>
        <div class="new_feature">
          Список будущих обновлений
        </div>
        <div class="email_wrapper">
          <InputStyled
            :class="'styleTextField'"
            :data="form.email"
            :is-label="'Email'"
            :is-outlined="true"
            :rules="emailRules"
            class="input_style"
          />
          <ButtonStyled
            :local-class="'wide_style_btn'"
            :local-text="'Подписаться'"
          />
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>

import SubHeader from '../../components/SubHeader.vue'
import InputStyled from '../../components/Common/InputStyled.vue'
import ButtonStyled from '../../components/Common/ButtonStyled.vue'

export default {
  components: { ButtonStyled, InputStyled, SubHeader },
  data() {
    return {
      emailRules: [
        v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Введите корректный email'
      ],
      form: {
        email: '',
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'assets/styles/style';

.card_wrapper {
  font-family: 'Inter', sans-serif;
  background-color: $white-color;
  border-radius: $b-r30;
  padding: 40px;
  max-width: 850px;
  display: flex;
  grid-column-gap: 56px;
  margin-left: auto;
  margin-right: auto;
  .img_container {
    position: relative;
    .grid_style_img {
      max-width: 194px;
      height: 234px;
    }
    .pomogaikin_img {
      position: absolute;
      bottom: -22px;
      left: -30px;
    }
  }
  .right_container {
    display: grid;
    align-content: stretch;
    align-items: center;
    max-width: 440px;
    .title_wrapper {
      display: flex;
      .title {
        @extend .main-page-header;
        padding-left: 20px;
      }
    }
    .description {

    }
    .new_feature {
      color: $grey3;
      text-decoration: underline;
      cursor: pointer;
    }
    .email_wrapper {
      display: flex;
      grid-column-gap: 20px;
      .input_style {
        border-radius: $b-r16;
      }
    }
  }
}

</style>
