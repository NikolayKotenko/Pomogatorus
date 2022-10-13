<template>
  <div>
    <v-app-bar id='navbar' app class='header' dark elevate-on-scroll>
      <v-app-bar-nav-icon v-if="isMobile" @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title v-if="isMobile" class="wtf">
        <router-link style="color: unset; text-decoration: unset" :to="getCurrentRoute.path">{{ getCurrentRoute.title }}</router-link>
      </v-toolbar-title>

      <!-- Desktop -->
      <template v-if="!isMobile">
        <v-toolbar-items class='header_center'>
          <v-btn v-for='item in menuItems' :key='item.title' :to='item.path' class='text-capitalize link_btn' text>
            <v-icon dark left>{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
        </v-toolbar-items>
      </template>

      <!-- Домик всегда по правую сторону -->
      <v-toolbar-items class='header_right'>
        <v-btn class='text-capitalize link_btn' text @click='openModals'>
          <v-icon :large='isMobile'>mdi-home-account</v-icon>
          <span v-if='!isMobile'>Кабинет</span>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <!-- Мобилка (гамбургер) -->
    <v-navigation-drawer
      v-if="isMobile"
      v-model="drawer"
      absolute
      temporary
    >
      <v-list style="margin-top: 50px;">
        <v-list-item-group class='header_center'>
          <v-list-item v-for='item in menuItems' :key='item.title' :to='item.path' class='text-capitalize link_btn' text>
            <v-list-item-icon dark left><v-icon>{{ item.icon }}</v-icon></v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>


  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Header',
  data() {
    return {
      drawer: false,
      menuItems: [
        {
          title: 'Статьи',
          path: '/articles',
          icon: 'mdi-message-text'
        },
        {
          title: 'Подборки',
          path: '/podborki',
          icon: 'mdi-bullseye-arrow'
        }
      ],
      debounceTimeout: null,
      openLeftNavigationDrawer: false,
      openRightNavigationDrawer: false
    }
  },
  mounted() {
    if (!process.server) {
      this.onScroll()
    }
  },
  computed: {
    ...mapState({
      listModal: state => state.listModal
    }),

    isMobile() {
      return this.$device.isMobile
    },
    getCurrentRoute() {
      return this.menuItems.find((elem) => {
        return this.$route.path.match(elem.path)
      })
    }
  },
  methods: {
    openModals() {
      // TODO: Продумать логику открывания модалки независимо от index'a
      this.listModal[0].isOpen = true
    },
    setHeader(value) {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
      this.debounceTimeout = setTimeout(() => {
        this.$store.commit('change_show_header', value)
      })
    },
    onScroll() {
      if (this.$device.isDesktop) {
        let prevScrollpos = window.pageYOffset
        const _this = this
        window.onscroll = function() {
          let currentScrollPos = window.pageYOffset
          if (prevScrollpos > currentScrollPos) {
            // console.log('pokazuvay')
            document.getElementById('navbar').style.top = '0'
            _this.setHeader(true)
          } else {
            // console.log('pryachy')
            document.getElementById('navbar').style.top = '-70px'
            _this.setHeader(false)
          }
          prevScrollpos = currentScrollPos
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.header {
  display: flex;
  flex: unset !important;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 399;
  transition: all 0.4s ease-in-out;

  ::v-deep .v-toolbar__content {
    width: 100%;
    max-width: 1140px;
    margin: 0 auto;
    padding: 4px 10px;
    column-gap: 10px;
  }
}

.header_center {
  flex: 1;
}

.header_right {
  flex: unset;
  margin-left: auto;
}

.link_btn {
  @media only screen and (min-width: 400px) {
    font-size: 1.25rem !important;
  }
  line-height: 1.5;
  letter-spacing: 1px;
  font-weight: 400;
}

.header_title {
  @media only screen and (max-width: 400px) {
    font-size: 1.25rem !important;
  }
  line-height: 1.5;
  letter-spacing: 1px;
  font-weight: 400;
}
</style>
