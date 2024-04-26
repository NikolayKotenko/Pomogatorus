<template>
  <v-app-bar
    id="navbar"
    :class="{ isMobile: isMobile }"
    app
    class="header_container"
    dark
    elevate-on-scroll
  >
    <v-container style="max-width: 100% !important;">
      <v-app-bar-nav-icon v-if="isMobile" @click="showDrawer"/>
      <v-toolbar-title v-if="isMobile">
        <router-link
          :to="getCurrentRoute.path"
          style="color: unset; text-decoration: unset"
        >
          {{ getCurrentRoute.title }}
        </router-link>
      </v-toolbar-title>

      <template v-if="!isMobile">
        <div class="header">
          <img
            :src="require(`/assets/svg/pomogatorus_logo.svg`)"
            alt="logo"
            class="header_left"
          >
          <div class="buttons_wrapper">
            <div
              v-for="(item, index) in $store.getters.menuItems"
              :key="index"
            >
              <v-btn
                v-if="item.visible"
                :class="{'active_element': getActiveMenuElement(item.path)}"
                :href="item.path"
                class="btn"
                text
              >
                <span class="text">
                  {{ item.title }}
                </span>
              </v-btn>
            </div>
          </div>
          <div class="header_right">
            <div class="search_container">
              <SearchStyled
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
                :full-width="'300'"
                class="styleSearch"
                @redirect="redirectData"
                @update-search-input="localGetListItems"
                @change-search="setSelected"
              />
            </div>
            <DropDownMenuStyled
              v-if="$store.getters.stateAuth"
              :is-left="true"
              :is-offset-y="true"
              :rounded-size="'30'"
              :close-on-click="true"
              :nudge-bottom="15"
              :nudge-right="40"
            >
              <template #icon>
                <v-icon size="32">
                  mdi-menu
                </v-icon>
              </template>
              <template #content>
                <div class="menu_wrapper">
                  <div class="top_info">
                    <v-avatar size="60">
                      <v-img
                        src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"
                      />
                    </v-avatar>
                    <div class="user_info">
                      <div class="user_fio">
                        {{ $store.state.AuthModule.userData.user_fio }}
                      </div>
                      <div class="user_mail">
                        {{ $store.state.AuthModule.userData.email }}
                      </div>
                    </div>
                  </div>
                  <v-divider style="border-color: black;"/>
                  <div class="actions_list">
                    <div
                      class="action_elem"
                      @click="$store.commit('set_modal_auth', true)"
                    >
                      <img
                        :src="require(`~/assets/svg/icons/account_icon.svg`)"
                        alt="help"
                      >
                      Личный кабинет
                    </div>
                    <div class="action_elem">
                      <img
                        :src="require(`~/assets/svg/icons/ph_building-office.svg`)"
                        alt="help"
                      >
                      Ваш текущий объект
                    </div>

                    <!-- Ваши специалисты -->
                    <DropDownMenuStyled
                      :is-left="true"
                      :is-offset-y="true"
                      :close-on-click-outside="true"
                      :nudge-top="224"
                      :nudge-right="44"
                    >
                      <template #icon>
                        <div class="action_elem">
                          <img
                            :src="require(`~/assets/svg/icons/basil_file-user-outline.svg`)"
                            alt="help"
                          >
                          Ваши специалисты
                        </div>
                      </template>
                      <template #content>
                        <Collaboration/>
                      </template>
                    </DropDownMenuStyled>

                    <!-- Избранные бренды -->
                    <DropDownMenuStyled
                      :is-left="true"
                      :is-offset-y="true"
                      :close-on-click-outside="true"
                      :nudge-top="258"
                      :nudge-right="44"
                    >
                      <template #icon>
                        <div class="action_elem">
                          <img
                            :src="require(`~/assets/svg/icons/star_outline.svg`)"
                            alt="help"
                          >
                          Избранные бренды
                        </div>
                      </template>
                      <template #content>
                        <FavoritesBrands/>
                      </template>
                    </DropDownMenuStyled>
                    <div
                      class="action_elem"
                      style="margin-top: 10px;"
                      @click="openModal"
                    >
                      <img
                        :src="require(`~/assets/svg/icons/plus_icon.svg`)"
                        alt="help"
                      >
                      Найти мастера
                    </div>
                  </div>
                  <v-divider style="border-color: black;"/>
                  <div class="exit" @click="logout">
                    Выйти
                  </div>
                </div>
              </template>
            </DropDownMenuStyled>
            <ButtonStyled
              v-else
              :local-class="'invite_button style_button'"
              :local-text="'Войти'"
              :max-width="'80'"
              :max-height="'30'"
              @click-button="$store.commit('set_modal_auth', true)"
            />
          </div>
        </div>
      </template>




      <!-- Desktop -->
      <!--      <template v-if="!isMobile"> -->
      <!--              <img -->
      <!--                :src="require(`/assets/svg/pomogatorus_logo.svg`)" -->
      <!--                alt="logo" -->
      <!--                class="header_left" -->
      <!--              > -->
      <!--        <SearchStyled -->
      <!--          :class="'styleSearch'" -->
      <!--          :internal-data="selectedChips" -->
      <!--          :is-clearable="true" -->
      <!--          :is-disabled="loading" -->
      <!--          :is-global-search="true" -->
      <!--          :is-hide-selected="false" -->
      <!--          :is-item-text="'text'" -->
      <!--          :is-item-value="'text'" -->
      <!--          :is-items="$store.state.listSearched" -->
      <!--          :is-loading="loading" -->
      <!--          :is-placeholder="'Поиск'" -->
      <!--          class="search" -->
      <!--          @redirect="redirectData" -->
      <!--          @update-search-input="localGetListItems" -->
      <!--          @change-search="setSelected" -->
      <!--        /> -->
      <!--      </template> -->

      <!--      &lt;!&ndash; Личный кабинет всегда по правую сторону &ndash;&gt; -->
      <!--      <v-toolbar-items class="header_right"> -->


      <!--        <DropDownMenuStyled :is-left="true" :is-offset-y="true"> -->
      <!--          <template #icon> -->
      <!--            <v-badge -->
      <!--              :content="$store.getters['Objects/getCountObject']" -->
      <!--              :value="$store.getters['Objects/getCountObject']" -->
      <!--              color="#95D7AE" -->
      <!--              overlap -->
      <!--            > -->
      <!--              <IconTooltip -->
      <!--                :color-icon="'#FFFFFF'" -->
      <!--                :icon-text="'mdi-home-edit-outline'" -->
      <!--                :size-icon="'32'" -->
      <!--                :text-tooltip="'Ваш текущий объект'" -->
      <!--              /> -->
      <!--            </v-badge> -->
      <!--          </template> -->
      <!--          <template #content> -->
      <!--            <CurrentObjects :is-no-widget="true"/> -->
      <!--          </template> -->
      <!--        </DropDownMenuStyled> -->


      <!--        <div -->
      <!--          class="menu" -->
      <!--        > -->
      <!--          <IconTooltip -->
      <!--            :color-icon="'#FFFFFF'" -->
      <!--            :icon-text="'mdi-menu'" -->
      <!--            :size-icon="'32'" -->
      <!--            :text-tooltip="'Меню'" -->
      <!--          /> -->
      <!--        </div> -->
      <!--      </v-toolbar-items> -->

      <v-overlay
        :value="!$store.getters.stateAuth"
        opacity="1"
        style="border-radius: 30px;"
      />
    </v-container>

    <!-- Глобальные модалки -->
    <TaskModal/>
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
import MiniUserCard from './User/MiniUserCard.vue'
import ButtonStyled from './Common/ButtonStyled.vue'
import FavoritesBrands from './Brands/FavoritesBrands.vue'
import { getNameStateModalByUrlHash } from '~/helpers/urlHelper';
import CreateObjectModal from '~/components/Modals/CreateObjectModal';

export default {
  name: 'Header',
  components: {
    FavoritesBrands,
    ButtonStyled,
    MiniUserCard,
    CreateObjectModal,
    SearchStyled,
    Collaboration,
    CurrentObjects,
    TooltipStyled,
    IconTooltip,
    DropDownMenuStyled,
    TaskModal,
  },
  props: {},
  data() {
    return {
      debounceTimeout: null,
      stateCurrentObject: false,
      selectedArticle: null,
      selectedChips: '',
      loadComponent: false,
      listArticles: [],
      loading: false,
      isActiveSearch: false,
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

    if (this.$store.state.isLogout) {
      this.loading = true
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
    openModal() {
      this.$store.dispatch('TaskModule/openModal')
    },

    logout() {
      this.$store.dispatch('logout')
    },

    getActiveMenuElement(elem) {
      return this.$route.path === elem;
    },

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

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;

  .header_left {
    margin-right: auto;
    margin-left: 26px;
  }
  .buttons_wrapper {
    margin: 0;
    display: flex;
    max-width: 850px;
    overflow: hidden;

    .btn {
      display: flex;
      justify-content: center;
      align-content: center;
      min-width: 190px;
      height: 40px;
      border-radius: 25px;
      .text {
        margin: 0 20px;
        text-transform: none !important;
        font-weight: 400;
        font-style: normal !important;
        letter-spacing: 0 !important;
      }
    }
  }
  .header_right {
    margin-left: auto;
    margin-right: 26px;
    display: flex;
    grid-column-gap: 20px;
    align-items: center;

    .search {
      max-width: 350px;
      max-height: 40px;
    }


  }
}

.active_element {
  border: 2px solid #FFFFFF;
  border-radius: 10px;

}

.v-btn:not(.v-btn--round).v-size--default {
  padding: 0 !important;
  min-width: 0;
}

.theme--dark.v-app-bar.v-toolbar.v-sheet {
  background: #000000;
}

.header_container {
  display: flex;
  flex: unset !important;
  z-index: 100;
  border-radius: 40px !important;
  transition: all 0.4s ease-in-out;
  height: 60px !important;

  &.isMobile {
    height: 56px !important;
  }

  .v-breadcrumbs {
    padding-left: 15px;
  }

  ::v-deep .v-toolbar__content {
    width: 100%;
    height: 60px !important;
    //max-width: 1140px;
    margin: 0 auto;
    padding: 4px 0;
    column-gap: 10px;
  }
}

//.header_center {
//  flex: 1;
//  align-items: center;
//}
//
//.link_btn {
//  font-weight: 400;
//  text-transform: uppercase !important;
//  letter-spacing: 0;
//
//  //text-transform: uppercase !important;
//  @media only screen and (min-width: 400px) {
//    font-size: 1.25rem !important;
//  }
//
//  line-height: 1.5;
//}
//
//.header_title {
//  @media only screen and (max-width: 400px) {
//    font-size: 1.25rem !important;
//  }
//
//  line-height: 1.5;
//  letter-spacing: 1px;
//  font-weight: lighter !important;
//}
//
//.custom_grid_system {
//  align-items: center;
//  padding-left: 10px;
//}
.search_container {
  width: 300px;
}

//.non_active_search {
//  width: 0;
//
//}

.content_menu_style {
  top: 0 !important;
}

@media screen and (max-width: 900px) {
  .search_container {
    width: 200px;
  }
}

@media screen and (max-width: 800px) {
  .search_container {
    width: 100px;
  }
}

@media screen and (max-width: 750px) {
  .search_container {
    width: 50px;
  }
}

</style>

<style lang="scss">
@import 'assets/styles/style';

.styleSearch {

  &.primary--text {
    color: #000000 !important;
  }

  font-size: 1.8em !important;
  border-radius: 25px;
  //min-width: 1144px;

  .v-input__slot {
    height: 40px;
  }

  .v-select__selections {
    height: 40px;
  }

  .v-input__append-inner {
    .v-input__icon--append {
      //margin-top: 8px;
    }

    //height: 60px;
    //display: flex;
    //align-items: center;
    //padding: 0;
    //margin: 0;
  }

  .v-select__slot {
    color: #37392E !important;

    input {
      color: black !important;
    }

    input::placeholder {
      color: #878787;
      font-size: 0.8em;

    }
    .theme--dark.v-input input {
      color: black !important;
    }
  }

  .mdi-close {
    font-size: 1em;
    align-content: center;
    color: $orange-color !important;
  }
  .v-menu_content {
    max-width: 300px !important;
  }
}



.content_menu_style {
  box-shadow: none;
  border-radius: 0;
  .menu_wrapper {
    padding: 20px;
    margin: 5px;
    background-color: #FFFFFF;
    border-radius: 30px !important;
    box-shadow: $shadowBox;
    min-width: 400px;
    .top_info {
      display: flex;
      grid-column-gap: 20px;
      .user_info {
        margin-bottom: 30px;
        .user_fio {
          font-size: 1.2em;
          margin-bottom: 5px;
        }
        .user_mail {
          color: $grey-text-color;
        }
      }
    }
    .actions_list {
      padding: 20px;
      display: grid;
      grid-row-gap: 10px;
      .action_elem {
        display: flex;
        grid-column-gap: 10px;
        align-items: center;
        cursor: pointer;
      }
    }
    .exit {
      cursor: pointer;
      padding: 20px 0 0 20px;
    }
  }
}

</style>
