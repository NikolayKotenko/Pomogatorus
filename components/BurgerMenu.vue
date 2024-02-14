<template>
  <!-- Мобилка (гамбургер) -->
  <v-navigation-drawer
    v-model="drawer"
    absolute
    app
    temporary
  >
    <v-list style="margin-top: 48px;">
      <v-list-item-group class="header_center">
        <v-list-item
          v-for="item in $store.getters.menuItems"
          v-if="item.visible"
          :key="item.title"
          :class="{activeItem: getCurrentRoute(item.path)}"
          :href="item.path"
          class="text-capitalize link_btn menuItem"
          text
        >
          <v-list-item-title :class="{activeElement: getCurrentRoute(item.path)}">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'BurgerMenu',
  data: () => ({}),
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(v) {
        this.$store.commit('set_drawer', v);
      }
    }
  },
  methods: {
    getCurrentRoute(path) {
      return this.$route.path === path;
    }
  }
};
</script>

<style lang="scss" scoped>
.menuItem {
  padding-left: 40px;
}

.menuIcon {
  margin-bottom: unset;
  margin-top: unset;
  align-self: center;
}

.v-navigation-drawer {
  z-index: 404 !important;
  position: fixed;
}
</style>

