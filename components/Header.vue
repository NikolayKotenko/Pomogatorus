<template>
  <v-app-bar id='navbar' app class='header' :class="{isMobile: isMobile}" dark elevate-on-scroll>
    <v-container class="d-flex custom_grid_system" style="align-items: center">
      <v-app-bar-nav-icon v-if='isMobile' @click='showDrawer'></v-app-bar-nav-icon>
      <v-toolbar-title v-if='isMobile'>
        <router-link :to='getCurrentRoute.path' style='color: unset; text-decoration: unset'>{{ getCurrentRoute.title }}
        </router-link>
      </v-toolbar-title>

      <!-- Desktop -->
      <template v-if='!isMobile'>
        <v-toolbar-items class='header_center'>
          <upcoming-title v-for='item in $store.getters.menuItems' v-if='item.visible' :key='item.title'>
            <v-btn
              :href='item.path'
              class='text-capitalize link_btn'
              text
            >
              <span :class='{activeElement: getCurrentRoute.title === item.title}'>{{ item.title }}</span>
            </v-btn>
          </upcoming-title>
        </v-toolbar-items>
      </template>

      <!-- Личный кабинет всегда по правую сторону -->
      <v-toolbar-items class='header_right'>
        <v-tooltip bottom>
          <template v-slot:activator='{ on, attrs }'>
            <v-btn
              :color='listModal[0].isOpen ? "#fafad2" : "white"'
              class='text-capitalize link_btn'
              text v-bind='attrs'
              @click='openModals'
              v-on='on'
            >
              <v-icon>mdi-key-variant</v-icon>
            </v-btn>
          </template>
          <span>Личный кабинет</span>
        </v-tooltip>
      </v-toolbar-items>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'
import UpcomingTitle from './Upcoming/UpcomingTitle'

export default {
  name: 'Header',
  components: { UpcomingTitle },
  data() {
    return {
      debounceTimeout: null
    }
  },
  mounted() {
    if (!process.server) {
      this.onScroll()
    }
  },
  computed: {
    ...mapState({
      listModal: state => state.listModal,
      drawer: state => state.drawer
    }),

    isMobile() {
      return this.$device.isMobile
    },
    getCurrentRoute() {
      if (this.listModal[0].isOpen) {
        return {
          path: '',
          title: 'Личный кабинет'
        }
      }
      return this.$store.getters.menuItems.find((elem) => {
        return this.$route.path.match(elem.path)
      })
    }
  },
  methods: {
    showDrawer() {
      this.$store.commit('set_drawer', !this.drawer)
    },
    openModals() {
      // TODO: Продумать логику открывания модалки независимо от index'a
      this.listModal[0].isOpen = !this.listModal[0].isOpen
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
            document.getElementById('navbar').style.top = '0'
            _this.setHeader(true)
          } else {
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
.v-btn:not(.v-btn--round).v-size--default {
  padding: 0 !important;
  min-width: 0px;
}


.theme--dark.v-app-bar.v-toolbar.v-sheet{
  background: #37392E;
}

.header {
  display: flex;
  flex: unset !important;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 999;
  transition: all 0.4s ease-in-out;
  height: 64px!important;
  &.isMobile{
    height: 56px!important;
  }
  .v-breadcrumbs{
    padding-left: 15px;
  }

  ::v-deep .v-toolbar__content {
    width: 100%;
    max-width: 1140px;
    margin: 0 auto;
    padding: 4px 0;
    column-gap: 10px;
  }
}

.header_center {
  flex: 1;
  align-items: center;
  grid-column-gap: 2em;
}

.header_right {
  flex: unset;
  margin-left: auto;
}

.link_btn {
  font-weight: lighter;
  @media only screen and (min-width: 400px) {
    font-size: 1.25rem !important;
  }
  line-height: 1.5;
  letter-spacing: 1px;
}

.header_title {
  @media only screen and (max-width: 400px) {
    font-size: 1.25rem !important;
  }
  line-height: 1.5;
  letter-spacing: 1px;
  font-weight: lighter !important;
}
</style>
