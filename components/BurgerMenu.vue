<template>
  <!-- Мобилка (гамбургер) -->
  <v-navigation-drawer
    v-model='drawer'
    absolute
    app
    temporary
  >
    <v-list style='margin-top: 50px;'>
      <v-list-item-group class='header_center'>
        <v-list-item v-for='item in menuItems' :key='item.title' :to='item.path' class='text-capitalize link_btn'
                     text>
          <v-list-item-icon dark left>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import menuItems from '../models/menuItems'

export default {
  name: 'BurgerMenu',
  data: () => ({
    menuItems
  }),
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(v) {
        this.$store.commit('set_drawer', v)
      }
    }
  }
}
</script>

