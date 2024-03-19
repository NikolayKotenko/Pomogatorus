<template>
  <div class="brand_container">
    <div class="top_wrapper">
      <div class="brand_name">
        {{ brandObject.name }}
      </div>
      <v-img
        :src="getBrandPhoto(brandObject)"
        height="24"
        max-width="60"
        contain
      />
    </div>

    <v-divider style="margin: 10px 0 10px 0;"/>

    <div class="bot_wrapper" v-html="brandObject.description"/>
  </div>
</template>

<script>
export default {
  name: 'BrandCard',
  components: {},
  props: {
    brandObject: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },
  data() {
    return {

    }
  },
  methods: {
    getBrandPhoto(elem) {
      if (elem.e_client_files.length) {
        return elem.e_client_files[0].url
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.brand_container {
  padding: 20px;
  background-color: #FFFFFF;
  max-width: 500px;
  .top_wrapper{
    display: flex;
    .brand_name {
      font-weight: 400;
      font-size: 2.2em;
      margin-right: 10px;
    }
  }
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
