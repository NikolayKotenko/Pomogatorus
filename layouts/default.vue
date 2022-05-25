<template>
  <v-app class="app">
    <Header/>
    <SubHeader/>
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
    async fuckinMiddleware(){
      if (this.$route.query.userEmail)
        await this.$store.dispatch('loginUser', {'userEmail': this.$route.query.userEmail});

      if (! Request.getAccessTokenInCookies()) {
        const refreshResponse = await this.$store.dispatch('refreshTokens')
        if (Logging.checkExistErr(refreshResponse))
          console.log(refreshResponse.message)
        // return redirect('/login')
      }

      this.$store.commit('change_refactoring_content', false)
    }
  }
}
</script>

<style lang="scss">
body {
  background: #f3f3f3 !important;
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
  //-webkit-box-shadow: 0px 0px 15px -1px rgba(34, 60, 80, 0.2);
  //-moz-box-shadow: 0px 0px 15px -1px rgba(34, 60, 80, 0.2);
  //box-shadow: 0px 0px 15px -1px rgba(34, 60, 80, 0.2);
}
</style>
