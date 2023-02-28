<template>
  <v-container class="podborki">
      <v-card
        class=""
        :href="$route.path + '/' + item.code"
        hover
        v-for="(item, key) in $store.state.PopularSelectionsModule.list_selections"
        :key="key"
      >
        <div class="podborki__wrapper_list">
          <v-img height="150" cover :src="$store.getters.getImageByEClientFilesObj(item.e_client_files)"></v-img>
          <div >
            <v-card-title>{{ item.name }}</v-card-title>
            <v-card-text v-html="item.description" style="word-break: break-word; "></v-card-text>
          </div>
        </div>
      </v-card>
  </v-container>
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
    this.$store.dispatch('PopularSelectionsModule/getListSelections')
  },
  methods: {
  },
}
</script>

<style scoped lang="scss">
.podborki {
  display: grid;
  grid-row-gap: 2em;
  &__wrapper_list {
    @media (min-width: 500px) {
      display: grid;
      grid-template-columns: 150px auto
    }
  }
}
</style>
