<template>
  <v-app class="app">
    <Header/>
    <SubHeader v-if="$device.isDesktop" />
    <v-main class="main" id="main_content">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Logging from "@/services/logging";
import Request from "@/services/request";
import Header from "../components/Header";
import SubHeader from "../components/SubHeader";

export default {
  name: 'DefaultLayout',
  components: {SubHeader, Header},
  data () {
    return {

    }
  },
  mounted() {
    this.fuckinMiddleware();
  },
  methods:{
    async fuckinMiddleware() {
      if (this.$route.query.userEmail) {
        await this.$store.dispatch('loginUser', {'userEmail': this.$route.query.userEmail});
        this.$store.commit('change_changedCookie', true)
      } else {
        if (Request.getAccessTokenInCookies() && (this.$route.query.agent)){
          const wtf = Request.get(this.$store.state.BASE_URL+'/entity/articles', this.$route.query)
        }
        if (!Request.getAccessTokenInCookies()) {
          const refreshResponse = await this.$store.dispatch('refreshTokens')

          if (Logging.checkExistErr(refreshResponse))
            console.log(refreshResponse.message)
          // return redirect('/login')

        } else {
          const loginResponse = await Request.post(window.location.origin+'/api/auth/validate-auth')
          console.log(loginResponse)
        }
      }

      this.$store.commit('change_refactoring_content', false)
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

body {
  background: #f3f3f3 !important;
  font-family: 'Roboto', sans-serif;
}
.app {
  background: #f3f3f3 !important;
}
::v-deep .v-btn {
  box-shadow: unset !important;
  background-color: unset !important;
}
.main {
  width: 1140px;
  margin: 5px auto 0 auto;
  background: #FFFFFF;
  padding: 10px 15px !important;
  border-radius: 5px;
  height: 100%;
  //-webkit-box-shadow: 0px 0px 15px -1px rgba(34, 60, 80, 0.2);
  //-moz-box-shadow: 0px 0px 15px -1px rgba(34, 60, 80, 0.2);
  //box-shadow: 0px 0px 15px -1px rgba(34, 60, 80, 0.2);
}
</style>
