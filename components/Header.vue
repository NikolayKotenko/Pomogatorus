<template>
  <v-app-bar class="header" dark elevate-on-scroll app id="navbar">
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
  mounted() {
    if (!process.server) {
      this.onScroll()
    }
  },
  methods: {
    onScroll() {
      if (this.$device.isDesktop) {
        let prevScrollpos = window.pageYOffset;
        window.onscroll = function() {
          let currentScrollPos = window.pageYOffset;
          if (prevScrollpos > currentScrollPos) {
            document.getElementById("navbar").style.top = "0";
          } else {
            document.getElementById("navbar").style.top = "-70px";
          }
          prevScrollpos = currentScrollPos;
        }
      }
    },
  }
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
  transition: all 0.4s ease-in-out;
  ::v-deep .v-toolbar__content {
    width: 100%;
    max-width: 1140px;
    margin: 0 auto;
    padding: 4px 0;
    column-gap: 10px;
  }
}
</style>
