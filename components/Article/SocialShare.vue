<template>
  <div class="social-container">
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"
          integrity="sha256-h20CPZ0QyXlBuAw7A+KluUYx/3pK+c7lYEpqLTlxjYQ="
          crossorigin="anonymous"
    />

    <div class="social-container__list-socials"
         :class="{visible: tooltip_state}"
         @mouseout="tooltip_state = false"
         @mouseover="tooltip_state = true"
    >
      <ShareNetwork
        v-for="network in networks"
        :network="network.network"
        :key="network.network"
        :style="{backgroundColor: network.color}"
        :url="sharing.url"
        :title="sharing.title"
        :description="sharing.description"
        :quote="sharing.quote"
        :hashtags="sharing.hashtags"
        :twitterUser="sharing.twitterUser"
      >
        <i :class="network.icon" :title="network.title"></i>
      </ShareNetwork>
    </div>

    <v-icon
      title="Поделится статьей"
      dark large
      color="indigo"
      class="social-container__button-state"
      @click="tooltip_state = true"
      @mouseover="tooltip_state = true"
      @mouseout="tooltip_state = false"
    >
      mdi-share-variant-outline
    </v-icon>
  </div>
</template>

<script>
export default {
  name: "SocialShare",
  components: {},
  async asyncData({ $axios, store, params }) {
  },
  props:['mouseStateEvent'],
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
        url: 'https://pomogatorus.ru/'+this.$route.fullPath,
        title: (this.$route.meta.title) ? this.$route.meta.title : '',
        description: 'This week, I’d like to introduce you to "Vite", which means "Fast". It’s a brand new development setup created by Evan You.',
        quote: 'The hot reload is so fast it\'s near instant. - Evan You',
        hashtags: 'vuejs,vite,javascript',
        twitterUser: 'youyuxi'
      },
      networks: [
        { network: 'odnoklassniki', title: 'Поделится в odnoklassniki', icon: 'fab fah fa-lg fa-odnoklassniki', color: '#ed812b'},
        { network: 'telegram', title: 'Поделится в telegram', icon: 'fab fah fa-lg fa-telegram-plane', color: '#0088cc' },
        { network: 'vk', title: 'Поделится в vk', icon: 'fab fah fa-lg fa-vk', color: '#4a76a8' },
        { network: 'whatsapp', title: 'Поделится в whatsapp', icon: 'fab fah fa-lg fa-whatsapp', color: '#25d366' },
      ]
    }
  },
  mounted() {
    // this.renderVk()
  },
  computed: {
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
    renderTg(){
      // document.getElementById('tg_share_button').innerHTML =
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
.social-container{
  display: inline-flex;
  grid-row-gap: 5px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: end;
  position: relative;
  //grid-column-gap: 10px;
  &__button-state{
    justify-content: right!important;
    padding-left: 10px;
  }
  &__list-socials{
    opacity: 0;
    transition: opacity 1s;
    visibility: hidden;
    &.visible{
      visibility: visible;
      opacity: 1;
      transition: opacity 1s;
    }
    display: flex;
    box-shadow: 0px 3px 8px 2px rgba(34, 60, 80, 0.4);
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-column-gap: 2px;
    grid-row-gap: 2px;
    padding: 5px;
    z-index: 9;
    background: white;

    i{
      text-align: center;
      font-size: 0.8em;
    }

    a[class^="share-network-"] {
      flex: none;
      color: #FFFFFF;
      background-color: #333;
      border-radius: 3px;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      align-content: center;
      align-items: center;
      cursor: pointer;
    }
    a[class^="share-network-"] .fah {
      background-color: rgba(0, 0, 0, 0.2);
      padding: 5px;
      flex: 0 1 auto;
    }
    a[class^="share-network-"] span {
      flex: 1 1 0%;
      font-weight: 500;
    }
  }
}
</style>
