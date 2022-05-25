<template>
  <v-app>
    <Header/>
    <v-main class="main">
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
import Logging from "@/services/logging";
import Request from "@/services/request";
import Header from "../components/Header";

export default {
  name: 'DefaultLayout',
  components: {Header},
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

<style scoped lang="scss">
::v-deep .v-btn {
  box-shadow: unset !important;
  background-color: unset !important;
}
.main {
  width: 1140px;
  margin: 15px auto 0 auto;
}
</style>
