<template>
  <v-app class='app'>
    <Header />
    <BurgerMenu v-if='!$device.isDesktop' />
    <div style="min-height: 57px;"><SubHeader v-if='$device.isDesktop && loadComponent'/></div>
    <v-main id='main_content' class='main'>
      <VerticalMenu class="fixed_left_menu"></VerticalMenu>
      <Nuxt class="custom_grid_system main__left_column"/>
      <CurrentObjects class="main__right_column" v-if="! listExcludedRightColumn"></CurrentObjects>
    </v-main>
    <!-- КАСКАДНЫЕ МОДАЛКИ -->
    <div
      v-for='(item, index) in listModal'
      :key='index'
    >
      <Right :data='item' :index='index' />
    </div>
  </v-app>
</template>

<script>
import Logging from '@/services/logging'
import Request from '@/services/request'

import Header from '../components/Header'
import SubHeader from '../components/SubHeader'
import ListObjects from '../components/UserObjects/ListObjects'
import ObjectDetail from '../components/UserObjects/ObjectDetail'
import Right from '../components/CascadModels/Right'
import CurrentObjects from '../components/Widgets/CurrentObjects'

import { mapState } from 'vuex'
import BurgerMenu from '../components/BurgerMenu'
import VerticalMenu from "../components/VerticalMenu.vue";

export default {
  name: 'DefaultLayout',
  components: {
    VerticalMenu,
    BurgerMenu,
    Right,
    SubHeader,
    Header,
    ListObjects,
    ObjectDetail,
    CurrentObjects
  },
  async fetch() {
    const options = {
      method: 'GET',
      url: `${this.$store.state.BASE_URL}/entity/articles/`
    }
    try {
      const articles_request = await this.$axios(options)
      this.articles_breadcrumbs = articles_request.data.data.map((elem) => {
        return {
          url: `https://pomogatorus.ru/articles/${elem.id}`,
          text: elem.preview
        }
      })
    } catch (error) {
      console.warn(error.response.data.message)
    }
  },
  data() {
    return {
      loadComponent: false,
      breadcrumbs: [
        {
          url: 'https://pomogatorus.ru',
          text: 'Этот сервис поможем вам в подборе и установке газового оборудования'
        },
        {
          url: 'https://pomogatorus.ru/articles',
          text: 'Эти статьи помогут вам подобрать решение для вашей проблемы'
        }
      ],
      articles_breadcrumbs: []
    }
  },
  jsonld() {
    const items = this.computedBreadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': item.url,
        name: item.text
      }
    }))
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Pomogatorus',
        logo: '',
        url: 'https://pomogatorus.ru',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Chelyabinsk',
          addressRegion: 'Chelyabinsk region',
          postalCode: '454000',
          addressCountry: 'Russia'
        },
        sameAs: ['https://www.instagram.com/pomogatorus_official/']
      }
    ]
  },
  mounted() {
    this.fuckinMiddleware()
    this.setLoadComponent()
  },
  computed: {
    ...mapState({
      listModal: state => state.listModal
    }),

    computedBreadcrumbs() {
      if (!this.articles_breadcrumbs || !this.articles_breadcrumbs.length) return this.breadcrumbs
      return this.articles_breadcrumbs.concat(this.breadcrumbs)
    },
    listExcludedRightColumn(){
      const arrPathExcluded = [
        'search',
        'object',
      ];
      return arrPathExcluded.some((path) => {
        return this.$route.path.match(path)
      });
    }
  },
  methods: {
    setLoadComponent() {
      this.loadComponent = true
    },
    async fuckinMiddleware() {
      if (this.$route.query.userEmail) {
        await this.$store.dispatch('loginUser', {
          userEmail: this.$route.query.userEmail
        })
      } else {
        if (Request.getAccessTokenInCookies() && this.$route.query.agent) {
          this.$store.commit('change_agent_utm', this.$route.query.agent)
          const wtf = Request.get(this.$store.state.BASE_URL + '/entity/articles', this.$route.query)
        }
        if (!Request.getAccessTokenInCookies()) {
          const refreshResponse = await this.$store.dispatch('refreshTokens')

          if (Logging.checkExistErr(refreshResponse)) console.log(refreshResponse.message)
          // return redirect('/login')
        } else {
          await this.$store.dispatch('loginByToken')
        }
      }

      this.$store.commit('change_refactoring_content', false)
    }
  }
}
</script>

<style lang='scss'>
@import 'assets/styles/style';

body {
  background: #f3f3f3 !important;
  font-family: 'Exo 2', sans-serif;
}

.app {
  background: #ffffff !important;
}

::v-deep .v-btn {
  box-shadow: unset !important;
  background-color: unset !important;
}

.main {
  width: $max-width;
  //max-width: $max-width;
  margin: 5px auto 0 auto;
  border-radius: 5px;
  margin-bottom: 65px;
  padding: unset!important;
  &__left_column{
    width: 100%;
    //margin-left: unset !important;
  }
  &__right_column{
    @media only screen and (max-width: 1200px) {
      display: none !important;
    }
    padding: 20px!important;
    padding-top: 10px!important;
    background: #ffffff;
    position: absolute;
    right: -275px;
    margin: unset;
  }
}
.v-main__wrap{
  display: grid;
  grid-template-columns: 1fr auto;
}
</style>
