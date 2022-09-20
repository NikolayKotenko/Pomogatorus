<template>
  <div
    class="auth_container"
    contenteditable="false"
    :id="`component_wrapper-${index_component}`"
    v-if="stateAuthBlock"
  >
    <v-container>
      <v-tabs v-model="tab">
        <v-tab :key="0">Авторизация</v-tab>
        <v-tab :key="1">Регистрация</v-tab>
        <!--Авторизация-->
        <v-tab-item :key="0">
          <v-form
            v-model="valid"
            class="login"
            ref="form"
            @submit.prevent="localLoginUser(`component_wrapper-${index_component}`)"
            contenteditable="false"
          >
            <v-text-field
              type="email"
              name="email"
              ref="email_user"
              v-model="email_user"
              label="Введите почту"
              :rules="emailRules"
              single-line
              required
              :class="'required'"
            ></v-text-field>
            <v-text-field
              v-model="password"
              :rules="passRules"
              maxlength="4"
              :type="passStateEye ? 'text' : 'password'"
              name="password"
              label="Введите код доступа"
              hint="4 символа"
              counter
              required
              :class="'required field_password'"
            >
              <template v-slot:append>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" @click="passStateEye = !passStateEye">
                      {{ passStateEye ? 'mdi-eye' : 'mdi-eye-off' }}
                    </v-icon>
                  </template>
                  Показать/скрыть пароль
                </v-tooltip>
              </template>
              <template v-slot:append-outer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" @click="localResendUserPass(`component_wrapper-${index_component}`)">
                      mdi-lock-reset
                    </v-icon>
                  </template>
                  Восстановить Код доступа
                </v-tooltip>
              </template>
            </v-text-field>
            <v-btn
              type="submit"
              :loading="loading"
              color="blue darken-1"
              elevation="2"
              large
              rounded
              block
              class="btn-auth"
            >
              Войти
            </v-btn>
          </v-form>
        </v-tab-item>
        <!--Регистрация-->
        <v-tab-item :key="1">
          <v-form
            v-model="valid"
            class="login"
            @submit.prevent="localCreateUser(`component_wrapper-${index_component}`)"
            contenteditable="false"
          >
            <v-text-field
              type="email"
              name="email"
              v-model="email_user"
              label="Введите почту"
              :rules="emailRules"
              single-line
              required
              :class="'required'"
            ></v-text-field>
            <v-text-field
              type="text"
              name="name"
              v-model="name"
              label="Как к вам обращаться ?"
              single-line
            ></v-text-field>
            <v-btn
              type="submit"
              :loading="loading"
              color="blue darken-0"
              elevation="2"
              large
              rounded
              block
              class="btn-auth"
            >
              Зарегестрироваться
            </v-btn>
          </v-form>
        </v-tab-item>
      </v-tabs>
      <v-alert
        v-if="alert.state && !loading"
        dismissible
        :type="alert.type"
        :value="alert.state"
        @input="alert.state = false"
      >
        <span v-html="alert.message"></span>
      </v-alert>
    </v-container>
  </div>
  <v-alert v-else dismissible type="success">
    <span>Здравствуйте {{ $store.state.AuthModule.userData.user_data.first_name }}</span>
  </v-alert>
</template>

<script>
import { mapGetters } from 'vuex'

import Logging from '@/services/logging'
import Request from '../../services/request'
import ArticleModule from '../../store/modules/article'

export default {
  name: 'LoginAuth',
  data() {
    return {
      tab: 0,
      valid: false,
      loading: false,
      emailRules: [
        (v) => !!v || 'Обязательное для заполнение поле',
        (v) => /.+@.+/.test(v) || 'E-mail должен быть валидным.',
      ],
      passRules: [(v) => !!v || 'Обязательное для заполнение поле', (v) => v.length === 4 || 'Необходимо 4 символа'],
      passStateEye: false,
      email_user: '',
      password: '',
      name: '',
      alert: {
        state: false,
        type: 'info',
        message: '',
      },

      // inserted_component
      width: 0,
      height: 0,
      index_component: null,
      stateAuthBlock: true,
    }
  },
  mounted() {
    this.getData()
    if (this.$store.state.changedCookie) {
      this.hasCookie()
    }
  },
  computed: {
    ...mapGetters(['stateAuth']),
  },
  watch: {
    '$store.state.changedCookie': {
      handler() {
        this.hasCookie()
      },
    },
  },
  methods: {
    hasCookie() {
      if (Request.getAccessTokenInCookies()) {
        this.stateAuthBlock = false
      }
    },
    alertCall(response) {
      this.alert.state = true
      this.alert.message = Logging.getMessage(response)
      this.alert.type = Logging.checkExistErr(response)
        ? 'error'
        : Request.getAccessTokenInCookies()
        ? 'success'
        : 'warning'
      this.loading = false
    },

    async localLoginUser(index_component) {
      if (this.valid === false) return false

      this.loading = true
      const res = await this.$store.dispatch('loginUser', {
        email: this.email_user,
        password: this.password,
        id_dom_elem: index_component,
        full_url: window.location.href,
      })
      this.alertCall(res)
      this.$nextTick(() => {
        this.hasCookie()
      })
    },
    async localCreateUser(index_component) {
      if (this.valid === false) return false

      this.loading = true
      // Пытаемся создать пользователя
      const res = await this.$store.dispatch('createUserByEmail', {
        email: this.email_user,
        name: this.name,
        id_dom_elem: index_component,
        full_url: window.location.href,
      })
      if (res.codeResponse === 200 || res.codeResponse === 409) {
        this.tab = 0
      }
      this.alertCall(res)
    },
    async localResendUserPass(index_component) {
      if (this.$refs.email_user.validate(true) === false) return false

      this.loading = true
      // Пытаемся создать пользователя
      const res = await this.$store.dispatch('resendUserPass', {
        email: this.email_user,
        name: this.name,
        id_dom_elem: index_component,
        full_url: window.location.href,
      })
      if (res.codeResponse === 404) {
        this.email_user = ''
        this.$refs.email_user.validate(true)
      }
      if (res.codeResponse === 200 || res.codeResponse === 409) {
        this.tab = 0
      }
      this.alertCall(res)
    },
    // inserted_components
    getData() {
      this.index_component = this.$store.state.ArticleModule.countLayout
    },
    deleteQuestion() {
      const elem = document.getElementById(`component_wrapper-${this.index_component}`)
      elem.remove()
      this.$store.dispatch('deleteComponent', this.index_component)
    },
  },
}
</script>

<style lang="scss" scoped>
form.login {
  margin: 1em;
  h1 {
    margin: auto;
  }
  .v-tab {
    font-size: 1em;
    text-transform: none !important;
  }
}
.showBorder {
}
.btn-auth {
  margin-top: 15px;
  ::v-deep span {
    color: white;
  }
}
</style>

<style lang="scss">
$yellowBackground: rgb(255, 235, 153);

@media only screen and (max-width: 375px) {
  .v-slide-group__prev {
    display: none !important;
  }
}

.auth_container {
  border-radius: 10px;
  border: 1px solid lightgrey;
  background: $yellowBackground;
  .v-tabs > .v-tabs-bar {
    background: $yellowBackground;
  }
  .v-window-item {
    background: $yellowBackground;
  }
  @media only screen and (min-width: 768px) {
    width: 50%;
    margin: auto;
  }
  .required .v-label::after {
    content: ' *';
    color: red;
  }
  .field_password {
    .v-icon {
      margin-top: unset;
    }
  }
}
.v-tabs-items {
  margin-top: 10px !important;
  button {
    margin-top: 10px;
  }
}
</style>
