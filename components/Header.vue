<template>
  <v-app-bar class="header" dark elevate-on-scroll app>
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
  </v-app-bar>
</template>

<script>
export default {
  name: "Header",
  data () {
    return {
      menuItems: [
        { title: 'Статьи', path: '/articles', icon: 'mdi-message-text' },
      ]
    }
  },
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  flex: unset !important;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 404;
  ::v-deep .v-toolbar__content {
    width: 100%;
    max-width: 1140px;
    margin: 0 auto;
    padding: 4px 0;
    column-gap: 10px;
  }
}
</style>
