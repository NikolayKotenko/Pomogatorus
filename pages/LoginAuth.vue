<template>
    <v-form v-model="valid" class="login" @submit.prevent="localLoginCreateUser()" contenteditable="false">
      <v-container>
        <v-row>
          <h1>Авторизация</h1>
        </v-row>
      </v-container>
      <v-container>
          <v-text-field
              type="text"
              name="email_user"
              v-model="email_user"
              label="Введите почту"
              :rules="emailRules"
              single-line
              required
          ></v-text-field>
        <v-alert
            v-if="alert.state"
            transition="scale-transition"
            dismissible
            :type="alert.type"
            :value="alert.state"
            @input="alert.state = false"
        >
          <span v-html="alert.message"></span>
        </v-alert>
      </v-container>
      <v-container>
        <v-row>
          <v-btn type="submit"
                 color="primary"
                 elevation="2"
                 large
                 rounded
                 block
          >
            Войти
          </v-btn>
        </v-row>
      </v-container>
    </v-form>
</template>

<script>
import Logging from "@/services/logging";
import Request from "@/services/request";

export default {
  name: "LoginAuth",
  data(){
    return {
      valid: false,
      emailRules: [
        v => !!v || 'Обязательное для заполнение поле',
        v => /.+@.+/.test(v) || 'E-mail должен быть валидным.',
      ],
      email_user: '',
      alert:{
        state: false,
        type: 'info',
        message: '',
      },
    }
  },
  mounted() {
    // if (this.$route.query.userEmail)
    //     this.loginUser({'userEmail': this.$route.query.userEmail})

    this.login2();
  },
  computed : {
  },
  methods: {
    async login2(){
      this.$axios.post('/auth/login', {'email': 'nikolay-kotenko@mail.ru'})
        .then((response) => {
          console.log('Could get the values packagist.org', response.data)
        })
        .catch((e) => {
          console.log('Could not get the values from packagist.org', e)
        })
    },
    async loginUser(objData) {
      const tokensData = await Request.post('https://api.agregatorus.com/auth/login', objData)
      console.log(tokensData)
    },
    alertCall(response){
      this.alert.state = true
      this.alert.message = Logging.getMessage(response)
      this.alert.type = Logging.checkExistErr(response) ? 'error' : 'success'
    },
    async localLoginCreateUser() {
      if (this.valid === false)
        return false

      //Делаем запрос на создание пользователя, если такой есть то будет 409 конфликт ошибка ну и бог с ней
      const res = await Request.post('https://api.agregatorus.com/users/create-from-only-email', {
        'email': this.email_user
      })
      this.alertCall(res);
    },
  }
}
</script>

<style lang="scss" scoped>
@import "/assets/styles/detail";

form.login{
  margin: 1em;
  h1{
    margin: auto;
  }
}
.showBorder {

}
</style>
