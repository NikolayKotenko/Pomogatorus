<template>
  <div class="brand_container">
    <div class="top_wrapper">
      <v-img
        :src='require(`~/assets/svg/baxi_logo.svg`)'
        max-width="160"
        contain
      ></v-img>
      <v-img></v-img>
    </div>

    <v-divider style="margin: 10px 0 10px 0;"></v-divider>

    <div class="bot_wrapper">
      <li class="title">Более 20 лет успешной работы;</li>
      <li class="title">Более 1,8 млн. установленных котлов;</li>
      <li class="title">50 складов запчастей;</li>
      <li class="title">Более 800 авторизированных сервисных центров</li>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BrandCard',
  components: {},
  props: {},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.brand_container {
  padding: 20px;
  background-color: #FFFFFF;
  .bot_wrapper {
    .title {
      font-size: 1em !important;
      font-weight: 400 !important;
      font-style: normal;
      line-height: normal !important;
      letter-spacing: normal !important;
    }
    
  }
}
</style>