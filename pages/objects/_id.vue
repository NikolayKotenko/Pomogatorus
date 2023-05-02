<template>
  <div>
    <ObjectGlobal
      v-if="object"
      :object-data="object"
      @change-select-object="changeUrl"
    ></ObjectGlobal>
    <footer-summary></footer-summary>
  </div>
</template>

<script>
import Request from "../../services/request";
import FooterSummary from "~/components/FooterSummary";
import SocialShare from "~/components/Article/SocialShare";
import ObjectDetail from "~/components/UserObjects/ObjectDetail";
import ObjectGlobal from "../../components/UserObjects/ObjectGlobal";

export default {
  name: "_id.vue",
  components: { ObjectGlobal, ObjectDetail, FooterSummary, SocialShare },
  data: () => ({
    object: {}
  }),
  head() {
    return {};
  },
  async mounted() {
    await this.getObject();
    this.$route.meta.title = this.object.address;
  },
  watch: {},
  computed: {},
  methods: {
    async getObject() {
      try {
        const request = await Request.get(`${this.$store.state.BASE_URL}/entity/objects/${this.$route.params.id}`);
        this.object = request.data;
      } catch (error) {
        console.warn(error);
      }
    },
    changeUrl(object) {
      this.$router.replace({
        params: {
          id: object.id
        }
      }).catch(() => {
      });
    }
  },
  destroyed() {
  }
};
</script>

<style lang="scss" scoped>
</style>
