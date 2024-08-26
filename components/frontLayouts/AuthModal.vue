<template>
  <v-dialog
    v-model="$store.state.AuthModule.stateAuthModal"
  >
    <v-container
      :class="{ auth_modal_container: tab === 0, registration_tab_style: tab === 1 }"
    >
      <v-icon
        color="#000000"
        size="32"
        class="close_btn"
        @click="$store.dispatch('closeAuthModal')"
      >
        mdi-close
      </v-icon>
      <v-tabs color="black">
        <v-tab :key="0" @click="tab = 0">
          Войти
        </v-tab>
        <v-tab :key="1" @click="tab = 1">
          Зарегистрироваться
        </v-tab>
        <v-tab-item :key="0">
          <div class="login_tab_style">
            <v-text-field
              ref="email_user"
              v-model="email_user"
              :class="'required'"
              :rules="emailRules"
              class="text_input"
              outlined
              height="50"
              name="email"
              placeholder="Почта"
              required
              single-line
              type="email"
            />
            <v-text-field
              v-model="password"
              :class="'required field_password'"
              :rules="passRules"
              :type="passStateEye ? 'text' : 'password'"
              class="text_input"
              outlined
              height="50"
              counter
              hint="4 символа"
              maxlength="4"
              name="password"
              placeholder="Пароль"
              required
            >
              <template #append>
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-icon @click="passStateEye = !passStateEye" v-on="on">
                      {{ passStateEye ? "mdi-eye" : "mdi-eye-off" }}
                    </v-icon>
                  </template>
                  Показать/скрыть пароль
                </v-tooltip>
              </template>
            </v-text-field>

            <div
              class="resend_pass_btn"
              @click="localResendUserPass()"
            >
              Не помню пароль
            </div>
            <ButtonStyled
              :loading="loading"
              :local-text="'Войти'"
              class="login_btn"
              local-class="bordered_regular_style_btn"
              @click-button="localLoginUser"
            />
          </div>
        </v-tab-item>
        <v-tab-item :key="1">
          <div class="registration_tab_style">
            <div class="header_info_wrapper">
              <v-divider vertical style="border-width: 1px; border-color: #FF6347 !important;"/>
              <div class="info_text">
                <div class="title">
                  Как работает помогаторус?
                </div>
                <div class="sub_title">
                  Мы предаставляем базу мастеров по монтажу сантехнического оборудования,
                  базу клиентов нуждающихся в услугах мастреа по монтажу,
                  полезные статьи в сфере сантехнического оборудования и тематические подборки
                </div>
              </div>
            </div>
            <div class="steps_wrapper">
              <div class="step_card">
                1.
                <div class="step_text">
                  Вы  регистрируетесь на портале и заполняете личную информацию
                </div>
              </div>
              <div class="step_card">
                2.
                <div class="step_text">
                  Вносите актуальную информацию о своём объекте недвижимости/доме
                </div>
              </div>
              <div class="step_card">
                3.
                <div class="step_text">
                  Находите нужного специалиста и получаете помощь по своему объекту
                </div>
              </div>
            </div>
            <div class="registration_inputs_wrapper">
              <div class="inputs">
                <v-text-field
                  v-model="email_user"
                  :class="'required'"
                  :rules="emailRules"
                  class="text_input"
                  outlined
                  height="50"
                  name="email"
                  placeholder="Почта"
                  required
                  single-line
                  type="email"
                />
                <v-text-field
                  v-model="name"
                  class="text_input"
                  outlined
                  height="50"
                  name="name"
                  placeholder="Как к вам обращаться?"
                  single-line
                  type="text"
                />
              </div>
              <ButtonStyled
                :loading="loading"
                :local-text="'Зарегистрироваться'"
                class="login_btn"
                local-class="style_wide_button"
                @click-button="localCreateUser"
              />
            </div>
          </div>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import ButtonStyled from '../Common/ButtonStyled.vue'
import Request from '../../services/request'
import Logging from '../../services/logging'
export default {
  name: 'AuthModal',
  components: {
    ButtonStyled
  },
  props: {

  },
  data() {
    return {
      tab: 0,
      loading: false,
      emailRules: [
        (v) => !!v || 'Обязательное для заполнения поле',
        (v) => /.+@.+/.test(v) || 'Неправильный E-mail'
      ],
      passRules: [(v) => !!v || 'Обязательное для заполнение поле', (v) => v.length === 4 || 'Необходимо 4 символа'],
      passStateEye: false,
      email_user: '',
      password: '',
      name: '',
      alert: {
        state: false,
        type: 'info',
        message: ''
      },
    }
  },
  computed: {
    ...mapGetters(['stateAuth']),
    ...mapGetters(['getNameUser']),
    // isMobile() {
    //   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // }
  },
  watch: {
    '$store.getters.stateAuth': {
      handler() {
        this.hasCookie();
      }
    },
    '$store.state.changedCookie': {
      handler() {
        this.hasCookie();
      }
    }
  },
  methods: {
    hasCookie() {
      if (Request.getAccessTokenInCookies() && this.$store.getters.stateAuth) {
        this.stateAuthBlock = false;
      } else {
        this.stateAuthBlock = true;
      }
    },

    alertCall(response) {
      this.alert.state = true;
      this.alert.message = Logging.getMessage(response);
      this.alert.type = Logging.checkExistErr(response)
        ? 'error'
        : Request.getAccessTokenInCookies()
          ? 'success'
          : 'warning';
      this.loading = false;

      if (this.alert.type === 'success') {
        this.$toast.success(this.alert.message)
      } else {
        this.$toast.error(this.alert.message)
      }
    },

    async localLoginUser() {
      if (this.valid === false) return false;

      this.loading = true;
      const res = await this.$store.dispatch('loginUser', {
        email: this.email_user,
        password: this.password,
        full_url: window.location.href
      });
      console.log('localLoginUser', res);

      await this.alertCall(res);

      if (res.codeResponse >= 400) return false;

      this.$nextTick(() => {
        this.hasCookie();
        this.$store.state.listModal[0].isOpen = false;
      });

      await this.$store.dispatch('closeAuthModal')
    },


    async localResendUserPass() {
      if (this.$refs.email_user.validate(true) === false) return false;

      this.loading = true;
      // Пытаемся создать пользователя
      const res = await this.$store.dispatch('resendUserPass', {
        email: this.email_user,
        name: this.name,
        full_url: window.location.href
      });
      if (res.codeResponse === 404) {
        this.email_user = '';
        this.$refs.email_user.validate(true);
      }
      if (res.codeResponse === 200 || res.codeResponse === 409) {
        this.tab = 0;
      }

      await this.$toast.info('Выслали на почту новый пароль')
    },

    async localCreateUser() {
      if (this.valid === false) return false;

      this.loading = true;
      // Пытаемся создать пользователя
      const res = await this.$store.dispatch('createUserByEmail', {
        email: this.email_user,
        name: this.name,
        full_url: window.location.href
      });

      this.alertCall(res);
    },
  }
}

</script>

<style scoped lang="scss">
@import 'assets/styles/style';

.auth_modal_container {
  width: 560px;
  font-family: 'Inter', sans-serif;
  padding: 40px;
  background: #FFFFFF;
  border-radius: 30px;
  position: relative;
  transition: $transition;
  .close_btn {
    position: absolute;
    top: 40px;
    right: 40px;
    z-index: 1;
  }
  .login_tab_style {
    margin: 40px 0 0 0;
    .text_input {
      border-radius: 15px;

    }
    .resend_pass_btn {
      text-decoration: underline;
      cursor: pointer;
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      font-size: .9em;
      color: #8A8784;
    }
    .login_btn {
      display: flex;
      justify-content: center;
      padding: 10px 100px !important;
      margin: 0 auto;
    }
  }

}
.registration_tab_style {
  max-width: 1430px;
  font-family: 'Inter', sans-serif;
  padding: 40px;
  background: #FFFFFF;
  border-radius: 30px;
  position: relative;
  transition: $transition;
  .close_btn {
    position: absolute;
    top: 40px;
    right: 40px;
    z-index: 1;
  }
  .header_info_wrapper {
    display: flex;
    max-width: 700px;
    .info_text {
      padding-left: 20px;
      .title {
        font-size: 2.5em !important;
        padding-bottom: 10px;
      }
      .sub_title {

      }
    }
  }
  .steps_wrapper {
    max-width: 1288px;
    margin: 40px auto;
    left: auto;
    right: auto;
    display: flex;
    grid-column-gap: 20px;
    .step_card {
      width: 100%;
      background-color: #F2F2F2;
      height: 214px;
      border-radius: 30px;
      position: relative;
      font-size: 4.4em;
      font-weight: 700;
      padding: 40px 0 0 40px;
      .step_text {
        font-size: 20px;
        font-weight: 400;
        line-height: 1;
      }
    }
  }
  .registration_inputs_wrapper {
    background-color: #F2F2F2;
    border-radius: 30px;
    padding: 40px;
    .inputs {
      display: flex;
      grid-column-gap: 20px;
      margin: 0 auto;
      max-width: 560px;
      .text_input {
        border-radius: 15px;
        width: 270px;
      }
    }
    .login_btn {
      display: flex;
      justify-content: center;
      margin: 0 auto;

    }

  }
}
</style>
