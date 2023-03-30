<template>
  <v-container class="podborki">
    <SearchStyled
      :is-class="'styleSearch'"
      :is-placeholder="'Поиск тегов'"
      :is-loading="$store.state.PopularSelectionsModule.loadingState"
      :is-disabled="$store.state.PopularSelectionsModule.loadingState"
      :is-items="$store.state.PopularSelectionsModule.list_selections"
      :is-clearable="true"
      :is-item-text="'text'"
      :is-item-value="'text'"
      :is-hide-selected="true"
      @update-search-input="localGetListItems"
      @click-clear="$store.dispatch('PopularSelectionsModule/getListSelections');"
    >
    </SearchStyled>

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
import SearchStyled from "@/components/Common/SearchStyled.vue";

export default {
  name: 'index.vue',
  components: {SearchStyled},
  data: () => ({
    debounceTimeout: null
  }),
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
    async localGetListItems(searchString){
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)

      this.debounceTimeout = setTimeout(async () => {
        const payload = (searchString) ? { name: searchString } : null
        await this.$store.dispatch('PopularSelectionsModule/getListSelections', payload)
      }, 1000)
    },
  },
}
</script>

<style scoped lang="scss">
.podborki {
  display: grid;
  grid-row-gap: 2em;
  align-content: baseline;
  &__wrapper_list {
    @media (min-width: 500px) {
      display: grid;
      grid-template-columns: 150px auto
    }
  }
}
</style>
