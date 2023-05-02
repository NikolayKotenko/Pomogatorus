<template>
  <div class="social-container">
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"
      integrity="sha256-h20CPZ0QyXlBuAw7A+KluUYx/3pK+c7lYEpqLTlxjYQ="
      crossorigin="anonymous"
    >

    <div
      class="social-container__list-socials"
      :class="{visible: tooltip_state}"
      @mouseout="tooltip_state = false"
      @mouseover="tooltip_state = true"
    >
      <v-icon
        class="link"
      >mdi-link-variant</v-icon>
      <ShareNetwork
        v-for="network in networks"
        :key="network.network"
        class="style_share"
        :network="network.network"
        :style="{backgroundColor: network.color}"
        :url="sharing.url"
        :title="sharing.title"
        :description="sharing.description"
        :quote="sharing.quote"
        :hashtags="sharing.hashtags"
        :twitter-user="sharing.twitterUser"
        :text="network.text"
      >
        <i
          :class="network.icon"
          :title="network.title"
        />
      </ShareNetwork>
    </div>

    <v-icon
      title="Поделится статьей"
      size="30"
      color="black"
      class="social-container__button-state"
      @click="tooltip_state = true"
      @mouseover="tooltip_state = true"
      @mouseout="tooltip_state = false"
    >
      mdi-share-outline
    </v-icon>
  </div>
</template>

<script>
export default {
  name: 'SocialShare',
  components: {},
  props:['mouseStateEvent'],
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
  data () {
    return {
      tooltip_state: false,
      sharing: {
        url: 'https://pomogatorus.ru'+this.$route.fullPath,
        title: (this.$route.meta.title) ? this.$route.meta.title : '',
        description: 'This week, I’d like to introduce you to "Vite", which means "Fast". It’s a brand new development setup created by Evan You.',
        quote: 'The hot reload is so fast it\'s near instant. - Evan You',
        hashtags: 'vuejs,vite,javascript',
        twitterUser: 'youyuxi'
      },
      networks: [
        { network: 'odnoklassniki', title: 'Поделится в OK', icon: 'fab fa-lg fa-odnoklassniki', },
        { network: 'telegram', title: 'Поделится в TG', icon: 'fab fa-lg fa-telegram',},
        { network: 'vk', title: 'Поделится в VK', icon: 'fab fa-lg fa-vk',},
        { network: 'whatsapp', title: 'Поделится в WhatsApp', icon: 'fab fa-lg fa-whatsapp',},
      ]
    }
  },
  computed: {
  },
  mounted() {
    // this.renderVk()
  },
  methods: {
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
    copyUrl(){
      navigator.clipboard.writeText(window.location.href);
    }
  },
}
</script>

<style lang="scss">
.tooltip-social{
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
  }

  &__list-socials {
    opacity: 0;
    transition: opacity 1s;
    visibility: hidden;

    .link {
      color: #000000 !important;
      cursor: pointer;
      margin-bottom: 10px;
    }
    &.visible {
      visibility: visible;
      opacity: 1;
      transition: opacity 1s;
    }

    display: grid;
    position: absolute;
    text-align: center;
    margin-bottom: 180px;
    box-shadow: 0px 3px 8px 2px rgba(34, 60, 80, 0.4);
    grid-row-gap: 2px;
    padding: 5px;
    z-index: 9;
    background: white;

    .style_share {

    }
      i{
        text-align: center;
        &.fa-odnoklassniki, &.fa-vk, &.fa-telegram, &.fa-whatsapp {
          color: #857885;
        }
      }

      //a[class^="share-network-"] {
      //  flex: none;
      //  color: #FFFFFF;
      //  background-color: #333;
      //  border-radius: 3px;
      //  overflow: hidden;
      //  display: flex;
      //  flex-direction: row;
      //  align-content: center;
      //  align-items: center;
      //  cursor: pointer;
      //}
      //a[class^="share-network-"] .fah {
      //  background-color: rgba(0, 0, 0, 0.2);
      //  padding: 5px;
      //  flex: 0 1 auto;
      //}
      //a[class^="share-network-"] span {
      //  flex: 1 1 0%;
      //  font-weight: 500;
      //}
    }
  }

</style>
