<template>
  <div>
    <object-detail :object_data="object"></object-detail>
    <footer-summary></footer-summary>
  </div>
</template>

<script>
import Request from '../../services/request'
import FooterSummary from "~/components/FooterSummary";
import SocialShare from "~/components/Article/SocialShare";
import ObjectDetail from "~/components/UserObjects/ObjectDetail";

export default {
  name: '_id.vue',
  components: { ObjectDetail, FooterSummary, SocialShare },
  async asyncData({ store, params }) {
    try {
      const request = await Request.get(`${store.state.BASE_URL}/entity/objects/${params.id}`)
      const object = request.data
      return { object }
    } catch (error) {
      console.warn(error)
    }
  },
  data: () => ({
  }),
  head() {
    return {
      title: `${this.object.address}`,
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1'
        },
        {
          hid: 'keywords',
          name: 'keywords',
        },
        {
          hid: 'description',
          name: 'description',
        },
        {
          hid: 'theme-color',
          name: 'theme-color',
          content: 'blue'
        }
      ]
    }
  },
  mounted() {
    this.$route.meta.title = this.object.address

  },
  watch: {
  },
  computed: {
  },
  methods: {
  },
  destroyed() {
  }
}
</script>

<style lang='scss' scoped>
</style>
