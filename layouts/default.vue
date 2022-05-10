<template>
  <v-app>
    <v-toolbar class="header">
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          Главная
        </router-link>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn
          text
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          class="text-capitalize"
        >
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-main class="main">
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  middleware: ['auth'],
  data () {
    return {
      menuItems: [
        { title: 'Статьи', path: '/articles', icon: 'mdi-message-text' },
      ]
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
  min-height: 760px;
  // width: 1140px;
  // max-width: 1140px;
  //width: 1250px;
  max-width: 1250px;
  margin: 15px auto 0 auto;
}
.header {
  //padding: 0 250px;
  flex: unset !important;
  //::v-deep .v-toolbar__content {
  //  column-gap: 25px;
  //}
}
</style>
