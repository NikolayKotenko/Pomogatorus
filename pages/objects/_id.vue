<template>
  <div>
    <object-detail v-if="object" :object_data="object"></object-detail>
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
  data: () => ({
    object: {}
  }),
  head() {
    return {
    }
  },
  async mounted() {
    await this.getObject()
    this.$route.meta.title = this.object.address
  },
  watch: {
  },
  computed: {
  },
  methods: {
    async getObject() {
      try {
        const request = await Request.get(`${this.$store.state.BASE_URL}/entity/objects/${this.$route.params.id}`)
        this.object = request.data
        return request.data
      } catch (error) {
        console.warn(error)
      }
    },
  },
  destroyed() {
  }
}
</script>

<style lang='scss' scoped>
</style>
