<template>
  <v-app-bar
    id="navbar"
    :class="{isMobile: isMobile}"
    app
    class="header"
    dark
    elevate-on-scroll
  >
    <v-container class="d-flex custom_grid_system">
      <v-app-bar-nav-icon v-if="isMobile" @click="showDrawer"/>
      <v-toolbar-title v-if="isMobile">
        <router-link :to="getCurrentRoute.path" style="color: unset; text-decoration: unset">
          {{ getCurrentRoute.title }}
        </router-link>
      </v-toolbar-title>

      <!-- Desktop -->
      <template v-if="!isMobile">
        <v-toolbar-items class="header_center">
          <div v-for="item in $store.getters.menuItems" :key="item.title">
            <v-btn
              v-if="item.visible"
              :href="item.path"
              class="text-capitalize link_btn"
              style="margin-right: 2em;"
              text
            >
              <span :class="{activeElement: getCurrentRoute.title === item.title}">{{ item.title }}</span>
            </v-btn>
          </div>
        </v-toolbar-items>
      </template>

      <!-- Личный кабинет всегда по правую сторону -->
      <v-toolbar-items class="header_right">
        <TooltipStyled :title="'Совместная работа над ' + $store.state.Objects.currentObject.name" class="current_object_btn">
          <v-menu
            :close-on-content-click="false"
            left
            offset-y
            @input="$store.commit('CollaborationModule/changeStateCollaboration', $event)"
          >
            <template #activator="{ on, attrs }">
              <div style="display: inline-flex; grid-column-gap: 5px" v-bind="attrs" v-on="on">
                <v-icon large v-bind="attrs" v-on="on">
                  mdi-account-group-outline
                </v-icon>
              </div>
            </template>
            <Collaboration v-if="$store.state.CollaborationModule.stateCollaborationMenu"/>
          </v-menu>
        </TooltipStyled>
        <TooltipStyled :title="'Текущий объект'" class="current_object_btn">
          <v-menu :close-on-content-click="false" left offset-y>
            <template #activator="{ on, attrs }">
              <div style="display: inline-flex; grid-column-gap: 5px" v-bind="attrs" v-on="on">
                <v-badge
                  :content="$store.getters['Objects/getCountObject']"
                  :value="$store.getters['Objects/getCountObject']"
                  color="#95D7AE"
                  overlap
                >
                  <v-icon large v-bind="attrs" v-on="on">
                    mdi-home-edit-outline
                  </v-icon>
                </v-badge>
              </div>
            </template>
            <CurrentObjects/>
          </v-menu>
        </TooltipStyled>
        <TooltipStyled :title="'Личный кабинет'">
          <template>
            <v-btn
              :color="listModal[0].isOpen ? '#fafad2' : 'white'"
              class="text-capitalize link_btn"
              text
              @click="openModals"
            >
              <v-icon large>
                mdi-account
              </v-icon>
            </v-btn>
          </template>
        </TooltipStyled>
      </v-toolbar-items>
    </v-container>
  </v-app-bar>
</template>

<script>
// eslint-disable-next-line vue/multi-word-component-names,vue/no-reserved-component-names
import { mapState } from 'vuex'
import TooltipStyled from './Common/TooltipStyled'
import CurrentObjects from './Widgets/CurrentObjects.vue'
import Collaboration from './Modals/Collaboration.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names,vue/no-reserved-component-names
  name: 'Header',
  components: { Collaboration, CurrentObjects, TooltipStyled },
  data() {
    return {
      debounceTimeout: null,
      stateCurrentObject: false,
    }
  },
  mounted() {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (!process.server) {
      this.onScroll()
    }
  },
  // eslint-disable-next-line vue/order-in-components
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
      // TODO: Продумать логику открывания модалки независимо от индексa
      this.listModal[0].isOpen = !this.listModal[0].isOpen
    },
    // openObject() {
    //   this.$emit("open_object", this.$store.state.listObjects.currentObject)
    //   console.log('work')
    // },
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
          const currentScrollPos = window.pageYOffset
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
  min-width: 0;
}


.theme--dark.v-app-bar.v-toolbar.v-sheet {
  background: #37392E;
}

.header {
  display: flex;
  flex: unset !important;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.4s ease-in-out;
  height: 64px !important;

  &.isMobile {
    height: 56px !important;
  }

  .v-breadcrumbs {
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
}

.header_right {
  display: flex;
  grid-column-gap: 20px;
  margin-left: auto;
}

.link_btn {
  font-weight: 400;
  text-transform: uppercase !important;
  letter-spacing: 0;
  //text-transform: uppercase !important;
  @media only screen and (min-width: 400px) {
    font-size: 1.25rem !important;
  }
  line-height: 1.5;
}

.header_title {
  @media only screen and (max-width: 400px) {
    font-size: 1.25rem !important;
  }
  line-height: 1.5;
  letter-spacing: 1px;
  font-weight: lighter !important;
}

.custom_grid_system {
  align-items: center;
  padding-left: 10px;
}
</style>
