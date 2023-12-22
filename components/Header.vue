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
      <v-app-bar-nav-icon v-if="isMobile" @click="showDrawer" />
      <v-toolbar-title v-if="isMobile">
        <router-link :to="getCurrentRoute.path" style="color: unset; text-decoration: unset">
          {{ getCurrentRoute.title }}
        </router-link>
      </v-toolbar-title>

      <!-- Desktop -->
      <template v-if="!isMobile">
        <div
          class="header_left"
        >
          <div
            class="menu"
            @click="$store.state.stateVerticalMenu = !$store.state.stateVerticalMenu"
          >
            <v-icon
              color="#ffffff"
              size="32"
            >
              mdi-menu
            </v-icon>
          </div>
          <div class="logo_wrapper">
            <v-img
              :src="require(`~/assets/svg/logo.svg`)"
            />
          </div>
        </div>
        <SearchStyled
          :class="'styleSearch'"
          :internal-data="selectedChips"
          :is-clearable="true"
          :is-custom-template-selections="true"
          :is-disabled="loading"
          :is-hide-selected="false"
          :is-item-text="'text'"
          :is-item-value="'text'"
          :is-items="listVariables"
          :is-loading="loading"
          :is-placeholder="'Поиск'"
          class="search"
          @update-search-input="localGetListItems"
          @change-search="setSelected"
        />
        <!--          @click-clear="getListBasedArticles(); selectedChips = ''" -->
        <!--          @redirect="redirectData" -->

        <!--        <v-toolbar-items class="header_center"> -->
        <!--          <div v-for="item in $store.getters.menuItems" :key="item.title"> -->
        <!--            <v-btn -->
        <!--              v-if="item.visible" -->
        <!--              :href="item.path" -->
        <!--              class="text-capitalize link_btn" -->
        <!--              style="margin-right: 2em;" -->
        <!--              text -->
        <!--            > -->
        <!--              <span :class="{activeElement: getCurrentRoute.title === item.title}">{{ item.title }}</span> -->
        <!--            </v-btn> -->
        <!--          </div> -->
        <!--        </v-toolbar-items> -->
      </template>

      <!-- Личный кабинет всегда по правую сторону -->
      <v-toolbar-items class="header_right">
        <TooltipStyled :title="'Совместная работа над ' + $store.state.Objects.currentObject.name"
          class="current_object_btn">
          <v-menu
            :close-on-content-click="false"
            left
            offset-y
            @input="openCollaborationModule($event)"
          >
            <template #activator="{ on, attrs }">
              <div
                style="display: inline-flex; grid-column-gap: 5px"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon large v-bind="attrs" v-on="on">
                  mdi-account-group-outline
                </v-icon>
              </div>
            </template>
            <Collaboration v-if="$store.state.CollaborationModule.stateCollaborationMenu" />
          </v-menu>
        </TooltipStyled>
        <TooltipStyled :title="'Текущий объект'" class="current_object_btn">
          <v-menu :close-on-content-click="false" left offset-y>
            <template #activator="{ on, attrs }">
              <div
                style="display: inline-flex; grid-column-gap: 5px"
                v-bind="attrs"
                v-on="on"
              >
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
            <CurrentObjects />
          </v-menu>
        </TooltipStyled>
        <TooltipStyled :title="'Личный кабинет'">
          <template>
            <v-btn
              :color="listModal[0].isOpen ? '#fafad2' : 'white'"
              class="text-capitalize link_btn"
              text
              @click="$store.commit('set_modal_auth', true)"
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
import { mapState } from "vuex";
import Request from "../services/request";
import TooltipStyled from "./Common/TooltipStyled";
import CurrentObjects from "./Widgets/CurrentObjects.vue";
import Collaboration from "./Modals/Collaboration.vue";
import SearchStyled from "./Common/SearchStyled.vue";

export default {
  name: "Header",
  components: { SearchStyled, Collaboration, CurrentObjects, TooltipStyled },
  data() {
    return {
      debounceTimeout: null,
      stateCurrentObject: false,
      selectedArticle: null,
      selectedChips: "",
      loadComponent: false,
      listArticles: [],
      listVariables: [],
      loading: false,
      answersList: [
        {
          category: "Пользователи",
          data: {},
          query: "",
          search: "",
          text: "",
          isAuthorized: null
        },
        {
          category: "Подборки",
          data: {},
          query: "",
          search: "",
          text: "",
          isAuthorized: null
        },
        {
          category: "Оборудование",
          data: {},
          query: "",
          search: "",
          text: "",
          isAuthorized: null
        },
        {
          category: "Объекты",
          data: {},
          query: "",
          search: "",
          text: "",
          isAuthorized: null
        }
      ]
    };
  },
  mounted() {
    // eslint-disable-next-line nuxt/no-env-in-hooks
    if (!process.server) {
      this.onScroll();
    }
  },
  // eslint-disable-next-line vue/order-in-components
  computed: {
    ...mapState({
      listModal: state => state.listModal,
      drawer: state => state.drawer
    }),

    isMobile() {
      return this.$device.isMobile;
    },
    getCurrentRoute() {
      if (this.listModal[0].isOpen) {
        return {
          path: "",
          title: "Личный кабинет"
        };
      }
      return this.$store.getters.menuItems.find((elem) => {
        return this.$route.path.match(elem.path);
      });
    }
  },
  methods: {
    showDrawer() {
      this.$store.commit("set_drawer", !this.drawer);
    },
    // openObject() {
    //   this.$emit("open_object", this.$store.state.listObjects.currentObject)
    //   console.log('work')
    // },
    setHeader(value) {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.$store.commit("change_show_header", value);
      });
    },
    onScroll() {
      if (this.$device.isDesktop) {
        let prevScrollpos = window.pageYOffset;
        const _this = this;
        window.onscroll = function () {
          const currentScrollPos = window.pageYOffset;
          if (prevScrollpos > currentScrollPos) {
            document.getElementById("navbar").style.top = "0";
            _this.setHeader(true);
          } else {
            document.getElementById("navbar").style.top = "-70px";
            _this.setHeader(false);
          }
          prevScrollpos = currentScrollPos;
        };
      }
    },
    async localGetListItems(searchString) {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);

      this.debounceTimeout = setTimeout(async () => {
        await this.getLocalListSearchedBySymbols(searchString);
      }, 500);
    },
    async getLocalListSearchedBySymbols(symbols) {
      const result = await this.$store.dispatch('getModifiedListSearched')
      this.listVariables = result.data;
    },

    setSelected(selectedObj) {
      this.selectedArticle = selectedObj;
    },
    openCollaborationModule(state) {
      if (!this.$store.getters.stateAuth) {
        this.$store.commit("set_modal_auth", state);
      } else {
        this.$store.commit("CollaborationModule/changeStateCollaboration", state);
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
    // redirectData(data){
    //   if (data.category === 'Тэги'){
    //     window.location.href = '/podborki/'+data.data.code
    //   }
    //   if (data.category === 'Статьи'){
    //     window.location.href = '/articles/'+data.data.id;
    //   }
    // },

  }
};
</script>

<style lang="scss" scoped>
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
