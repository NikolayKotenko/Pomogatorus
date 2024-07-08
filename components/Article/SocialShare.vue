<template>
  <v-dialog
    v-model="$store.state.ArticleModule.stateShareArticleModal"
    width="560"
  >
    <div class="social_wrapper">
      <div class="social_header">
        <div class="title">
          Поделиться
        </div>
        <v-icon color="#000000" @click="closeModal">
          mdi-close
        </v-icon>
      </div>

      <v-divider style="border-color: #DDDDDD;"/>

      <div class="field_wrapper">
        <span class="field_title">
          Прямая ссылка:
        </span>
        <v-text-field
          ref="linkUrl"
          class="text_field"
          dense
          :value="getCurrentUrl"
          height="40"
          outlined
          color="#000000"
          readonly
          hide-details
          append-icon="mdi-content-copy"
          @focus="$event.target.select()"
          @click:append="copyUrl"
        />
      </div>

      <div class="field_wrapper">
        <span class="field_title">
          Поделиться в соц. сети:
        </span>
      </div>
      <div class="social_share_wrapper">
        <ShareNetwork
          v-for="network in networks"
          :key="network.network"
          :description="sharing.description"
          :hashtags="sharing.hashtags"
          :network="network.network"
          :quote="sharing.quote"
          :text="network.text"
          :title="sharing.title"
          :twitter-user="sharing.twitterUser"
          :url="sharing.url"
        >
          <div class="social_share_btn">
            <img :src="network.icon">
          </div>
        </ShareNetwork>
      </div>
    </div>



    <!--    <div class="social-container"> -->
    <!--      <link -->
    <!--        crossorigin="anonymous" -->
    <!--        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" -->
    <!--        integrity="sha256-h20CPZ0QyXlBuAw7A+KluUYx/3pK+c7lYEpqLTlxjYQ=" -->
    <!--        rel="stylesheet" -->
    <!--      > -->

    <!--      <DropDownMenuStyled -->
    <!--        :is-top="true" -->
    <!--        :is-offset-y="true" -->
    <!--      > -->
    <!--        <template -->
    <!--          #icon -->
    <!--        > -->
    <!--          <TooltipStyled :is-top="true" :title="'Поделиться статьей'"> -->
    <!--            <div -->
    <!--              class="btn_wrapper" -->
    <!--            > -->
    <!--              <v-icon color="#000000"> -->
    <!--                mdi-export-variant -->
    <!--              </v-icon> -->
    <!--              <span>Поделиться</span> -->
    <!--            </div> -->
    <!--          </TooltipStyled> -->
    <!--        </template> -->
    <!--        <template #content> -->
    <!--          <ShareNetwork -->
    <!--            v-for="network in networks" -->
    <!--            :key="network.network" -->
    <!--            :description="sharing.description" -->
    <!--            :hashtags="sharing.hashtags" -->
    <!--            :network="network.network" -->
    <!--            :quote="sharing.quote" -->
    <!--            :style="{backgroundColor: network.color}" -->
    <!--            :text="network.text" -->
    <!--            :title="sharing.title" -->
    <!--            :twitter-user="sharing.twitterUser" -->
    <!--            :url="sharing.url" -->
    <!--            class="style_share" -->
    <!--          > -->
    <!--            <i -->
    <!--              :class="network.icon" -->
    <!--              :title="network.title" -->
    <!--            /> -->
    <!--          </ShareNetwork> -->
    <!--        </template> -->
    <!--      </DropDownMenuStyled> -->
    <!--    </div> -->
  </v-dialog>
</template>

<script>
import DropDownMenuStyled from '../Common/DropDownMenuStyled.vue';
import IconTooltip from '../Common/IconTooltip.vue';
import TooltipStyled from '../Common/TooltipStyled.vue'

export default {
  name: 'SocialShare',
  components: { TooltipStyled, IconTooltip, DropDownMenuStyled },
  props: ['mouseStateEvent'],
  async asyncData({ $axios, store, params }) {
  },
  // head: {
  //   script: [
  //     {
  //       type: "text/javascript",
  //       src: "https://vk.com/js/api/share.js?93",
  //       charset: "windows-1251"
  //     },
  //   ],
  // },
  data() {
    return {
      tooltip_state: false,
      sharing: {
        url: 'https://pomogatorus.ru' + this.$route.fullPath,
        title: (this.$route.meta.title) ? this.$route.meta.title : '',
        description: 'This week, I’d like to introduce you to "Vite", which means "Fast". It’s a brand new development setup created by Evan You.',
        quote: 'The hot reload is so fast it\'s near instant. - Evan You',
        hashtags: 'vuejs,vite,javascript',
        twitterUser: 'youyuxi'
      },
      networks: [
        {
          network: 'odnoklassniki',
          title: 'Поделится в OK',
          icon: require('~/assets/svg/icons/social_icons/odnoklassniki.svg'),
          color: '#000000'
        },
        {
          network: 'telegram',
          title: 'Поделится в TG',
          icon: require('~/assets/svg/icons/social_icons/telegram.svg'),
          color: '#000000'
        },
        {
          network: 'vk',
          title: 'Поделится в VK',
          icon: require('~/assets/svg/icons/social_icons/vkontakte.svg'),
          color: '#000000'
        },
        {
          network: 'whatsapp',
          title: 'Поделится в WhatsApp',
          icon: require('~/assets/svg/icons/social_icons/watsapp.svg'),
          color: '#000000'
        }
      ]
    };
  },
  computed: {
    getCurrentUrl() {
      return 'https://pomogatorus.ru' + this.$route.fullPath;
    }
  },
  mounted() {
    // this.renderVk()
  },
  methods: {
    closeModal() {
      this.$store.dispatch('closeShareArticleModal')
    },
    copyUrl() {
      this.$toast.success('Ссылка скопирована',{ duration: 5000 })
      this.$refs.linkUrl.focus();
      document.execCommand('copy');
    }
    // renderVk(){
    //   document.getElementById('vk_share_button').innerHTML =
    //     VK.Share.button(false, {
    //       url: location.href,
    //       type: 'custom',
    //       text: '<img src="https://vk.com/images/share_32_2x.png" style="width:32px; height:32px" />'
    //     })
    // },
    // renderTg() {
    // document.getElementById('tg_share_button').innerHTML =
  }
};
</script>

<style scoped lang="scss">
@import 'assets/styles/style';
//
//i {
//  text-align: center;
//  background-color: #ffffff;
//
//
//  &.fa-odnoklassniki, &.fa-vk, &.fa-telegram, &.fa-whatsapp {
//    padding: 10px !important;
//    color: #857885;
//    transition: $transition;
//    &:hover {
//      color: $green-color;
//    }
//  }
//}


.tooltip-social {
  pointer-events: unset;
  background-color: white;
  box-shadow: 0px 3px 8px 2px rgba(34, 60, 80, 0.2);
}

.social-container {
  display: flex;
  grid-row-gap: 5px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end; //TODO (1:194) end value has mixed support, consider using flex-end instead
  position: relative;
  //grid-column-gap: 10px;
  &__button-state {
    justify-content: right !important;
    padding-left: 10px;

    &:hover {
      color: #F6C5A7 !important;
    }
    &:active{
      color: $orange-color !important;
    }
    &::after {
      background-color: #FFFFFF !important;
    }
  }

  &__list-socials {
    opacity: 0;
    transition: opacity 0.5ms;
    visibility: hidden;

    &.visible {
      visibility: visible;
      opacity: 1;
      transition: opacity 0.5ms;
    }

    display: grid;
    position: absolute;
    text-align: center;
    margin-bottom: 140px;
    box-shadow: 0px 3px 8px 2px rgba(34, 60, 80, 0.4);
    grid-row-gap: 2px;
    padding: 5px;
    z-index: 9;
    background: #111111;



  }
}

a[class^="share-network-"] {
  flex: none;
  color: #000000;
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  cursor: pointer;
}
a[class^="share-network-"] .fah {
  padding: 5px;
  flex: 0 1 auto;
}
a[class^="share-network-"] span {
  flex: 1 1 0%;
  font-weight: 500;
}

.btn_wrapper {
  display: flex;
  grid-column-gap: 5px;
  align-items: center;
  background-color: #DDDDDD;
  border-radius: 15px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 600;
}

.style_share {
  padding: 10px;
  border-radius: 8px;
}

.social_wrapper {
  background-color: #FFFFFF;
  display: grid;
  height: auto;
  font-family: 'Inter', sans-serif;
  .social_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    .title {
      font-size: 1.25em;
      font-weight: 600;
    }
  }
  .field_wrapper {
    padding: 10px 40px;
    .field_title {
      font-size: 0.875em;
      font-weight: 400;
      color: #777777;
    }
    .text_field {
      border-radius: 15px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.4s ease-in-out;
      &:hover {
        color: #111111;
      }
    }
  }
  .social_share_wrapper {
    display: flex;
    grid-column-gap: 10px;
    padding: 0 40px 20px;
    .social_share_btn {

    }
  }
}

</style>
