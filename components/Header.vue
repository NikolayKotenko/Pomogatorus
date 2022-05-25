<template>
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
  ::v-deep .v-toolbar__content {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 4px 25px;
    column-gap: 10px;
  }
}
</style>
