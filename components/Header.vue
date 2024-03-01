<template>
  <v-app-bar
    id="navbar"
    :class="{ isMobile: isMobile }"
    app
    class="header"
    dark
    elevate-on-scroll
  >
    <v-container class="d-flex custom_grid_system">
      <v-app-bar-nav-icon v-if="isMobile" @click="showDrawer"/>
      <v-toolbar-title v-if="isMobile">
        <router-link
          :to="getCurrentRoute.path"
          style="color: unset; text-decoration: unset"
        >
          {{ getCurrentRoute.title }}
        </router-link>
      </v-toolbar-title>

      <!-- Desktop -->
      <template v-if="!isMobile">
        <div class="header_left">
          <div
            class="menu"
            @click="
              $store.state.stateVerticalMenu = !$store.state.stateVerticalMenu
            "
          >
            <IconTooltip
              :color-icon="'#FFFFFF'"
              :icon-text="'mdi-menu'"
              :size-icon="'32'"
              :text-tooltip="'Меню'"
            />
          </div>
          <div class="logo_wrapper">
            <v-img :src="require(`~/assets/svg/logo.svg`)"/>
          </div>
        </div>
        <SearchStyled
          :class="'styleSearch'"
          :internal-data="selectedChips"
          :is-clearable="true"
          :is-disabled="loading"
          :is-global-search="true"
          :is-hide-selected="false"
          :is-item-text="'text'"
          :is-item-value="'text'"
          :is-items="$store.state.listSearched"
          :is-loading="loading"
          :is-placeholder="'Поиск'"
          class="search"
          @redirect="redirectData"
          @update-search-input="localGetListItems"
          @change-search="setSelected"
        />
      </template>

      <!-- Личный кабинет всегда по правую сторону -->
      <v-toolbar-items class="header_right">
        <DropDownMenuStyled :is-left="true" :is-offset-y="true">
          <template #icon>
            <IconTooltip
              :color-icon="'#FFFFFF'"
              :icon-text="'mdi-account-group-outline'"
              :size-icon="'32'"
              :text-tooltip="
                'Совместная работа над ' +
                  $store.state.Objects.currentObject.name
              "
            />
          </template>
          <template #content>
            <Collaboration/>
          </template>
        </DropDownMenuStyled>

        <DropDownMenuStyled :is-left="true" :is-offset-y="true">
          <template #icon>
            <v-badge
              :content="$store.getters['Objects/getCountObject']"
              :value="$store.getters['Objects/getCountObject']"
              color="#95D7AE"
              overlap
            >
              <IconTooltip
                :color-icon="'#FFFFFF'"
                :icon-text="'mdi-home-edit-outline'"
                :size-icon="'32'"
                :text-tooltip="'Ваш текущий объект'"
              />
            </v-badge>
          </template>
          <template #content>
            <CurrentObjects/>
          </template>
        </DropDownMenuStyled>

        <TooltipStyled :title="'Личный кабинет'">
          <template>
            <v-btn
              :color="listModal[0].isOpen ? '#fafad2' : 'white'"
              class="text-capitalize link_btn"
              text
              @click="$store.commit('set_modal_auth', true)"
            >
              <v-icon size="32">
                mdi-account
              </v-icon>
            </v-btn>
          </template>
        </TooltipStyled>
      </v-toolbar-items>
    </v-container>

    <!-- Глобальные модалки -->
    <TaskModal ref="inviteUserModal"/>
    <CreateObjectModal ref="createObjectModal"/>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex';
import TooltipStyled from './Common/TooltipStyled';
import CurrentObjects from './Widgets/CurrentObjects.vue';
import Collaboration from './Modals/Collaboration.vue';
import SearchStyled from './Common/SearchStyled.vue';
import IconTooltip from './Common/IconTooltip.vue';
import DropDownMenuStyled from './Common/DropDownMenuStyled.vue';
import TaskModal from './Collaboration/TaskModal.vue';
import { getNameStateModalByUrlHash } from '~/helpers/urlHelper';
import CreateObjectModal from '~/components/Modals/CreateObjectModal';

export default {
  name: 'Header',
  components: {
    CreateObjectModal,
    SearchStyled,
    Collaboration,
    CurrentObjects,
    TooltipStyled,
    IconTooltip,
    DropDownMenuStyled,
    TaskModal,
  },
  data() {
    return {
      debounceTimeout: null,
      stateCurrentObject: false,
      selectedArticle: null,
      selectedChips: '',
      loadComponent: false,
      listArticles: [],
      loading: false,
      answersList: [
        {
          category: 'Пользователи',
          data: {},
          query: '',
          search: '',
          text: '',
          isAuthorized: null,
        },
        {
          category: 'Подборки',
          data: {},
          query: '',
          search: '',
          text: '',
          isAuthorized: null,
        },
        {
          category: 'Оборудование',
          data: {},
          query: '',
          search: '',
          text: '',
          isAuthorized: null,
        },
        {
          category: 'Объекты',
          data: {},
          query: '',
          search: '',
          text: '',
          isAuthorized: null,
        },
      ],
    }
  },
  watch: {
    // Смотрим за изменением хэша в url'е и вызываем модалки по связи refs
    $route(to, from) {
      // console.log('route change to', to);
      // console.log('route change from', from);
      if (!to.hash) return false
      this.localSetStateModalByUrlHash(to.hash)
    },
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
      listModal: (state) => state.listModal,
      drawer: (state) => state.drawer,
    }),

    isMobile() {
      return this.$device.isMobile
    },
    getCurrentRoute() {
      if (this.listModal[0].isOpen) {
        return {
          path: '',
          title: 'Личный кабинет',
        }
      }
      return this.$store.getters.menuItems.find((elem) => {
        return this.$route.path.match(elem.path)
      })
    },
  },
  methods: {
    showDrawer() {
      this.$store.commit('set_drawer', !this.drawer)
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
        window.onscroll = function () {
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
    },
    localGetListItems(searchString) {
      if (!searchString) return false

      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)

      this.debounceTimeout = setTimeout(async () => {
        await this.$store.dispatch('getListSearched', searchString)
      }, 500)
    },
    setSelected(selectedObj) {
      this.selectedArticle = selectedObj
    },
    openCollaborationModule(state) {
      if (!this.$store.getters.stateAuth) {
        this.$store.commit('set_modal_auth', state)
      } else {
        this.$store.commit(
          'CollaborationModule/changeStateCollaboration',
          state
        )
      }
    },
    redirectData(data) {
      if (data.category === 'Подборки') {
        window.location.href = data.href
      }
      if (data.category === 'Статьи') {
        window.location.href = data.href
      }
      // if (data.category === 'Номенклатура'){
      //   window.location.href = ''+data.href;
      // }
    },
    localSetStateModalByUrlHash(hash) {
      const { nameModal, stateModal } = getNameStateModalByUrlHash(hash)
      // Внутри компонента с модалкой должны быть методы openModal и closeModal
      if (stateModal === 'true') {
        this.$refs[`${nameModal}`].openModal()
      } else {
        this.$refs[`${nameModal}`].closeModal()
      }
    },

    // async getArticlesBySymbols(symbols) {
    //   this.loading = true;
    //
    //   const result = await Request.get(
    //     `${this.$store.state.BASE_URL}/entity/articles/search/{q}?q=${symbols}`
    //   );
    //   this.listVariables = result.data;
    //
    //   const payload = (symbols) ? { name_or_tags: symbols } : null
    //   await this.getListBasedArticles(payload)
    //   this.loading = false;
    // },
    // async getListBasedArticles(queryParams){
    //   this.loading = true;
    //
    //   const basedFilter = { activity: true };
    //   const query = constructFilterQuery({ ...basedFilter, ...queryParams });
    //
    //   const response = await Request.get(
    //     this.$store.state.BASE_URL + '/entity/articles' + query
    //   );
    //   this.listArticles = response.data;
    //   this.loading = false;
    //
    //   return response;
    // },
  },
}
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.v-btn:not(.v-btn--round).v-size--default {
  padding: 0 !important;
  min-width: 0;
}

.theme--dark.v-app-bar.v-toolbar.v-sheet {
  background: #37392e;
}

.header {
  display: flex;
  flex: unset !important;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: $transition;
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

.header_left {
  position: fixed;
  left: 0;
  padding-left: 20px;
  display: flex;
  align-items: center;
  grid-column-gap: 20px;

  .menu {
    cursor: pointer;
  }

  .logo_wrapper {
    @media only screen and (max-width: 1600px) {
      display: none;
    }
  }
}

.header_center {
  flex: 1;
  align-items: center;
}

.header_right {
  position: fixed;
  right: 0;
  display: flex;
  grid-column-gap: 20px;
  margin-left: auto;
  padding-right: 20px;
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

.search {
  max-width: 750px;
  max-height: 40px;
}
</style>
