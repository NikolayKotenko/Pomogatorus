<template>
  <div class="auth_container" contenteditable="false" :id="`component_wrapper-${index_component}`">
    <v-form v-model="valid" class="login"
            @submit.prevent="localLoginCreateUser(`component_wrapper-${index_component}`)"
            contenteditable="false"
    >
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
                 color="blue darken-1"
                 elevation="2"
                 large
                 rounded
                 block
                 class="btn-auth"
          >
            Войти
          </v-btn>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import Logging from "@/services/logging";

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

      // inserted_component
      width: 0,
      height: 0,
      index_component: null,
    }
  },
  mounted() {
    this.getData()
  },
  computed : {
  },
  methods: {
    alertCall(response){
      this.alert.state = true
      this.alert.message = Logging.getMessage(response)
      this.alert.type = Logging.checkExistErr(response) ? 'error' : 'success'
    },
    async localLoginCreateUser(index_component){
      if (this.valid === false)
        return false

        const res = await this.$store.dispatch(
          'createAndAuthUserByEmail', {
            'email': this.email_user,
            'id_dom_elem': index_component,
            'full_url': window.location.href
          })
        this.alertCall(res);
    },

    // inserted_components
    getData() {
      this.index_component = this.$store.state.countLayout
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
}
.showBorder {

}
.btn-auth {
  ::v-deep span {
    color: white
  }
}
</style>
