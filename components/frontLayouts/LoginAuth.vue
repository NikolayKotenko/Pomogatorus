<template>
  <div class="auth_container" contenteditable="false" :id="`component_wrapper-${index_component}`" v-if="stateAuthBlock">
      <v-container>
        <v-tabs>
          <!--Авторизация-->
          <v-tab-item>
            <v-form v-model="valid" class="login"
                    @submit.prevent="localLoginUser(`component_wrapper-${index_component}`)"
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
              ></v-text-field>
              <v-text-field
                v-model="password"
                :append-icon="passStateEye ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passRules"
                :type="passStateEye ? 'text' : 'password'"
                name="password"
                label="Введите пинкод"
                hint="Не менее 4 символов"
                counter
                @click:append="passStateEye = !passStateEye"
              ></v-text-field>
              <v-btn type="submit"
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
          <v-tab-item>
            <v-form v-model="valid" class="login"
                    @submit.prevent="localCreateUser(`component_wrapper-${index_component}`)"
                    contenteditable="false"
            >
              <v-text-field
                type="text"
                name="name"
                v-model="name"
                label="Введите имя"
                single-line
                required
              ></v-text-field>
              <v-text-field
                type="email"
                name="email"
                v-model="email_user"
                label="Введите почту"
                :rules="emailRules"
                single-line
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                :append-icon="passStateEye ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passRules"
                :type="passStateEye ? 'text' : 'password'"
                name="password"
                label="Введите пинкод"
                hint="Не менее 4 символов"
                counter
                @click:append="passStateEye = !passStateEye"
              ></v-text-field>
              <v-btn type="submit"
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
          <v-tab light>Авторизация</v-tab>
          <v-tab>Регистрация</v-tab>
        </v-tabs>
      </v-container>
      <v-container>
      <v-alert
          v-if="alert.state"
          dismissible
          :type="alert.type"
          :value="alert.state"
          @input="alert.state = false"
      >
        <span v-html="alert.message"></span>
      </v-alert>
      </v-container>
  </div>
  <v-alert
    v-else
    dismissible
    type="success"
  >
    <span>Вы успешно авторизованы!</span>
  </v-alert>
</template>

<script>
import {mapGetters} from "vuex";

import Logging from "@/services/logging";
import Request from "../../services/request";
import ArticleModule from "../../store/modules/article";

export default {
  name: "LoginAuth",
  data(){
    return {
      valid: false,
      emailRules: [
        v => !!v || 'Обязательное для заполнение поле',
        v => /.+@.+/.test(v) || 'E-mail должен быть валидным.',
      ],
      passRules: [
        v => !!v || 'Обязательное для заполнение поле',
        v => v.length >= 4 || 'Необходимо минимум 4 символа',
      ],
      passStateEye: false,
      email_user: '',
      password: '',
      name: '',
      alert:{
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
      this.hasCookie();
    }
  },
  computed : {
    ...mapGetters([
      'stateAuth',
    ]),
  },
  watch: {
    '$store.state.changedCookie': {
      handler() {
        this.hasCookie();
      }
    },
  },
  methods: {
    hasCookie() {
      if (Request.getAccessTokenInCookies()) {
        this.stateAuthBlock = false;
      }
    },
    alertCall(response){
      this.alert.state = true
      this.alert.message = Logging.getMessage(response)
      this.alert.type = Logging.checkExistErr(response) ? 'error' : Request.getAccessTokenInCookies() ? 'success' : 'warning'
    },

    async localLoginUser(index_component){
      if (this.valid === false)
        return false

        const res = await this.$store.dispatch('loginUser',
          {
            'email': this.email_user,
            'password': this.password,
            'id_dom_elem': index_component,
            'full_url': window.location.href
          });
        this.alertCall(res);
        this.$nextTick(() => {
          this.hasCookie();
        })
    },
    async localCreateUser(index_component){
      if (this.valid === false)
        return false

      // Пытаемся создать пользователя
      const res = await this.$store.dispatch(
        'createUserFromEmailAndPass', {
          'email': this.email_user,
          'password': this.password,
          'name': this.name,
          'id_dom_elem': index_component,
          'full_url': window.location.href
      });
      if (res.codeResponse === 202) {
        const res = await this.$store.dispatch('loginUser',
          {
            'email': this.email_user,
            'password': this.password,
            'id_dom_elem': index_component,
            'full_url': window.location.href
          });
        this.alertCall(res);
        this.$nextTick(() => {
          this.hasCookie();
        })
      }
      else{
        this.alertCall(res);
      }
      // Такой пользователь уже есть в базе - авторизоваться
      // Если такой еще не зарегестрирован придет - 200

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
  }
}
</script>

<style lang="scss" scoped>
form.login{
  margin: 1em;
  h1{
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
  ::v-deep span {
    color: white
  }
}
</style>

<style lang="scss">
.v-tabs-items{
  margin-top: 10px!important;
  button{
    margin-top: 10px;
  }
}
</style>
