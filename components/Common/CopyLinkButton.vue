<template>
  <div>
    <TooltipStyled
      :is-bottom="false"
      :is-top="true"
      :title="'Копировать ссылку'"
    >
      <input
        ref="linkUrl"
        :value="getCurrentUrl"
        readonly
        style="position: fixed; left: -999999px"
        @focus="$event.target.select()"
      >
      <v-icon
        class="link"
        @click="copyUrl"
      >
        mdi-link-variant
      </v-icon>
    </TooltipStyled>
  </div>
</template>

<script>
import TooltipStyled from './TooltipStyled.vue';

export default {
  name: 'CopyLinkButton',
  components: { TooltipStyled },
  props: {
    idEntry: {
      type: Number,
      default: 0
    }
  },
  computed: {
    getCurrentUrl() {
      return 'https://pomogatorus.ru' + this.$route.fullPath + this.idEntryProps;
    },
    idEntryProps(){
      return (this.idEntry) ? '/'+this.idEntry : '';
    }
  },
  methods: {
    copyUrl() {
      this.$toast.success('Ссылка скопирована',{ duration: 5000 })
      this.$refs.linkUrl.focus();
      document.execCommand('copy');
    }
  }
}
</script>

<style lang="scss" scoped>
.link {
  color: #000000 !important;
  cursor: pointer;
  margin: 0 1em 0 1em;

  &:hover{
     color: #F6C5A7 !important;
   }
  &:active{
     color: #F79256 !important;
   }
}
</style>
