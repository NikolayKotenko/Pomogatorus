<template>
  <div>
    <v-card
      class="mt-5 mb-5"
      :href="$route.path + '/' + item.code"
      hover
      v-for="(item, key) in $store.state.PopularSelectionsModule.list_selections"
      :key="key"
    >
      <div class="wrapper_list">
        <v-img cover :src="$store.getters.getImageByEClientFilesObj(item.e_client_files)"></v-img>
        <div >
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-text v-html="item.description" style="word-break: break-word; "></v-card-text>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'index.vue',
  components: {},
  data: () => ({}),
  head: {
    title: 'Подборки',
    meta: []
  },
  created() {
    // if (process.server) {
    //   console.log('server')
    //   this.$store.dispatch('nuxtServerInit')
    // } else {
    //   console.log('client')
    //   this.$store.dispatch('req_list_articles')
    // }
  },
  mounted() {
    this.$store.dispatch('getListSelections')
  },
  methods: {
  },
}
</script>

<style scoped lang="scss">
.wrapper_list{
  @media (min-width: 500px) {
    display: grid;
    grid-template-columns: 150px auto
  }
}
</style>
