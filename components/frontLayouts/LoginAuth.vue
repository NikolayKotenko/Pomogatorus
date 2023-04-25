<template>
  <div
    v-if="stateAuthBlock"
    :id="`component_wrapper-${index_component}`"
    class="auth_container"
    contenteditable="false"
  >
    <VContainer>
      <VTabs v-model="tab">
        <VTab :key="0">
          Авторизация
        </VTab>
        <VTab :key="1">
          Регистрация
        </VTab>
        <!-- Авторизация -->
        <VTabItem :key="0">
          <VForm
            ref="form"
            v-model="valid"
            class="login"
            contenteditable="false"
            @submit.prevent="localLoginUser(`component_wrapper-${index_component}`)"
          >
            <VTextField
              ref="email_user"
              v-model="email_user"
              :class="'required'"
              :rules="emailRules"
              name="email"
              placeholder="Введите почту"
              required
              single-line
              type="email"
            />
            <VTextField
              v-model="password"
              :class="'required field_password'"
              :rules="passRules"
              :type="passStateEye ? 'text' : 'password'"
              counter
              hint="4 символа"
              maxlength="4"
              name="password"
              placeholder="Введите код доступа"
              required
            >
              <template #append>
                <VTooltip bottom>
                  <template #activator="{ on }">
                    <VIcon @click="passStateEye = !passStateEye" v-on="on">
                      {{ passStateEye ? 'mdi-eye' : 'mdi-eye-off' }}
                    </VIcon>
                  </template>
                  Показать/скрыть пароль
                </VTooltip>
              </template>
              <template #append-outer>
                <VTooltip bottom>
                  <template #activator="{ on }">
                    <VIcon @click="localResendUserPass(`component_wrapper-${index_component}`)" v-on="on">
                      mdi-lock-reset
                    </VIcon>
                  </template>
                  Восстановить Код доступа
                </VTooltip>
              </template>
            </VTextField>
            <VBtn
              :loading="loading"
              block
              class="btn-auth"
              color="blue darken-1"
              elevation="2"
              large
              rounded
              type="submit"
            >
              Войти
            </VBtn>
          </VForm>
        </VTabItem>
        <!-- Регистрация -->
        <VTabItem :key="1">
          <VForm
            v-model="valid"
            class="login"
            contenteditable="false"
            @submit.prevent="localCreateUser(`component_wrapper-${index_component}`)"
          >
            <VTextField
              v-model="email_user"
              :class="'required'"
              :rules="emailRules"
              name="email"
              placeholder="Введите почту"
              required
              single-line
              type="email"
            />
            <VTextField
              v-model="name"
              name="name"
              placeholder="Как к вам обращаться ?"
              single-line
              type="text"
            />
            <VBtn
              :loading="loading"
              block
              class="btn-auth"
              color="blue darken-0"
              elevation="2"
              large
              rounded
              type="submit"
            >
              Зарегестрироваться
            </VBtn>
          </VForm>
        </VTabItem>
      </VTabs>
      <VAlert
        v-if="alert.state && !loading"
        :type="alert.type"
        :value="alert.state"
        dismissible
        @input="alert.state = false"
      >
        <span v-html="alert.message"/>
      </VAlert>
    </VContainer>
  </div>
  <VAlert v-else dismissible type="success">
    <span>Здравствуйте {{ $store.getters.getNameUser }}</span>
  </VAlert>
</template>

<script>
import { mapGetters } from 'vuex'

import Request from '../../services/request'
import Logging from '@/services/logging'

export default {
  name: 'LoginAuth',
  data() {
    return {
      tab: 0,
      valid: false,
      loading: false,
      emailRules: [
        (v) => !!v || 'Обязательное для заполнение поле',
        (v) => /.+@.+/.test(v) || 'E-mail должен быть валидным.'
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

      // inserted_component
      width: 0,
      height: 0,
      index_component: null,
      stateAuthBlock: true
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
    ...mapGetters(['getNameUser'])
  },
  watch: {
    '$store.getters.stateAuth': {
      handler() {
        this.hasCookie()
      }
    },
    '$store.state.changedCookie': {
      handler() {
        this.hasCookie()
      }
    }
  },
  methods: {
    hasCookie() {
      if (Request.getAccessTokenInCookies() && this.$store.getters.stateAuth) {
        this.stateAuthBlock = false
      } else {
        this.stateAuthBlock = true
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

      if (this.alert.type === 'success') {
        this.$emit('close-modal')
      }
    },

    async localLoginUser(index_component) {
      if (this.valid === false) return false

      this.loading = true
      const res = await this.$store.dispatch('loginUser', {
        email: this.email_user,
        password: this.password,
        id_dom_elem: index_component,
        full_url: window.location.href
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
        full_url: window.location.href
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
        full_url: window.location.href
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
    }
  }
}
</script>

<style lang='scss' scoped>
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

<style lang='scss'>
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
  max-width: 500px;

  .v-tabs > .v-tabs-bar {
    background: $yellowBackground;
  }

  .v-window-item {
    background: $yellowBackground;
  }

  @media only screen and (min-width: 768px) {
    //width: 50%;
    //margin: auto;
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
