<template>
  <v-container
    v-if="stateAuthBlock"
    :id="`component_wrapper-${index_component}`"
    :class="{isMobile}"
    class="auth_container custom_grid_system"
    contenteditable="false"
  >
    <v-container>
      <v-tabs
        v-model="tab"
        color="#000000"
      >
        <v-tab :key="0">
          Авторизация
        </v-tab>
        <v-tab :key="1">
          Регистрация
        </v-tab>
        <!-- Авторизация -->
        <v-tab-item :key="0">
          <v-form
            ref="form"
            v-model="valid"
            class="login"
            contenteditable="false"
            @submit.prevent="localLoginUser(`component_wrapper-${index_component}`)"
          >
            <v-text-field
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
            <v-text-field
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
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-icon @click="passStateEye = !passStateEye" v-on="on">
                      {{ passStateEye ? "mdi-eye" : "mdi-eye-off" }}
                    </v-icon>
                  </template>
                  Показать/скрыть пароль
                </v-tooltip>
              </template>
              <template #append-outer>
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-icon @click="localResendUserPass(`component_wrapper-${index_component}`)" v-on="on">
                      mdi-lock-reset
                    </v-icon>
                  </template>
                  Восстановить Код доступа
                </v-tooltip>
              </template>
            </v-text-field>
            <ButtonStyled
              v-if="isMobile"
              :custom-slot="true"
              :is-mobile="true"
              :loading="loading"
              local-class="style_button"
              type="submit"
            >
              <v-icon>mdi-login</v-icon>
            </ButtonStyled>
            <ButtonStyled
              v-if="!isMobile"
              :loading="loading"
              :local-text="'Войти'"
              class="mt-5"
              local-class="style_button"
              type="submit"
            />
          </v-form>
        </v-tab-item>
        <!-- Регистрация -->
        <v-tab-item :key="1">
          <v-form
            v-model="valid"
            class="login"
            contenteditable="false"
            @submit.prevent="localCreateUser(`component_wrapper-${index_component}`)"
          >
            <v-text-field
              v-model="email_user"
              :class="'required'"
              :rules="emailRules"
              name="email"
              placeholder="Введите почту"
              required
              single-line
              type="email"
            />
            <v-text-field
              v-model="name"
              name="name"
              placeholder="Как к вам обращаться?"
              single-line
              type="text"
            />
            <ButtonStyled
              v-if="isMobile"
              :custom-slot="true"
              :is-mobile="true"
              :loading="loading"
              local-class="style_button"
              type="submit"
            >
              <v-icon>mdi-account-check-outline</v-icon>
            </ButtonStyled>
            <ButtonStyled
              v-if="!isMobile"
              :loading="loading"
              :local-text="'Зарегистрироваться'"
              local-class="style_button"
              type="submit"
            />
          </v-form>
        </v-tab-item>
      </v-tabs>
      <v-alert
        v-if="alert.state && !loading"
        :type="alert.type"
        :value="alert.state"
        dismissible
        @input="alert.state = false"
      >
        <span v-html="alert.message" />
      </v-alert>
    </v-container>
  </v-container>
  <v-container v-else class="custom_grid_system">
    <v-alert dismissible type="success">
      <span>Здравствуйте {{ $store.getters.getNameUser }}</span>
    </v-alert>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import Request from "../../services/request";
import ButtonStyled from "../Common/ButtonStyled.vue";
import Logging from "@/services/logging";

export default {
  name: "LoginAuth",
  components: { ButtonStyled },
  data() {
    return {
      tab: 0,
      valid: false,
      loading: false,
      emailRules: [
        (v) => !!v || "Обязательное для заполнение поле",
        (v) => /.+@.+/.test(v) || "E-mail должен быть валидным."
      ],
      passRules: [(v) => !!v || "Обязательное для заполнение поле", (v) => v.length === 4 || "Необходимо 4 символа"],
      passStateEye: false,
      email_user: "",
      password: "",
      name: "",
      alert: {
        state: false,
        type: "info",
        message: ""
      },

      // inserted_component
      width: 0,
      height: 0,
      index_component: null,
      stateAuthBlock: true
    };
  },
  mounted() {
    this.getData();
    if (this.$store.state.changedCookie) {
      this.hasCookie();
    }
  },
  computed: {
    ...mapGetters(["stateAuth"]),
    ...mapGetters(["getNameUser"]),
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
  },
  watch: {
    "$store.getters.stateAuth": {
      handler() {
        this.hasCookie();
      }
    },
    "$store.state.changedCookie": {
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
        ? "error"
        : Request.getAccessTokenInCookies()
          ? "success"
          : "warning";
      this.loading = false;

      if (this.alert.type === "success") {
        this.$emit("close-modal");
      }
    },

    async localLoginUser(index_component) {
      if (this.valid === false) return false;

      this.loading = true;
      const res = await this.$store.dispatch("loginUser", {
        email: this.email_user,
        password: this.password,
        id_dom_elem: index_component,
        full_url: window.location.href
      });
      console.log("localLoginUser", res);
      this.alertCall(res);
      if (res.codeResponse >= 400) return false;

      this.$nextTick(() => {
        this.hasCookie();
        this.$store.state.listModal[0].isOpen = false;
      });
    },
    async localCreateUser(index_component) {
      if (this.valid === false) return false;

      this.loading = true;
      // Пытаемся создать пользователя
      const res = await this.$store.dispatch("createUserByEmail", {
        email: this.email_user,
        name: this.name,
        id_dom_elem: index_component,
        full_url: window.location.href
      });
      if (res.codeResponse === 200 || res.codeResponse === 409) {
        this.tab = 0;
      }
      this.alertCall(res);
    },
    async localResendUserPass(index_component) {
      if (this.$refs.email_user.validate(true) === false) return false;

      this.loading = true;
      // Пытаемся создать пользователя
      const res = await this.$store.dispatch("resendUserPass", {
        email: this.email_user,
        name: this.name,
        id_dom_elem: index_component,
        full_url: window.location.href
      });
      if (res.codeResponse === 404) {
        this.email_user = "";
        this.$refs.email_user.validate(true);
      }
      if (res.codeResponse === 200 || res.codeResponse === 409) {
        this.tab = 0;
      }
      this.alertCall(res);
    },
    // inserted_components
    getData() {
      this.index_component = this.$store.state.ArticleModule.countLayout;
    },
    deleteQuestion() {
      const elem = document.getElementById(`component_wrapper-${this.index_component}`);
      elem.remove();
      this.$store.dispatch("deleteComponent", this.index_component);
    }
  }
};
</script>

<style lang="scss" scoped>
form.login {
  margin: 1em;

  h1 {
    margin: auto;
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
$yellowBackground: rgb(255, 244, 203);

@media only screen and (max-width: 375px) {
  .v-slide-group__prev {
    display: none !important;
  }
}

.auth_container {
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  max-width: 500px;
  background: $yellowBackground;

  &.isMobile {
    height: 100%;
  }

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
    //margin-top: 10px;
  }
}

.v-tab {
  font-size: 1em;
  text-transform: none !important;
  letter-spacing: 0;
  font-weight: 400;
}
</style>
