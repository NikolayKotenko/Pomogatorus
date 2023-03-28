<template>
  <v-container class="podborki">
    <SearchStyled
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
      class="podborki__wrapper_list"
      :href="$route.path + '/' + item.code"
      hover
      v-for="(item, key) in $store.state.PopularSelectionsModule.list_selections"
      :key="key"
    >
        <v-img
          v-if="Object.keys(item.e_client_files).length === true"
          :class="{'empty_placeholder': Object.keys(item.e_client_files).length}"
          :src="$store.getters.getImageByEClientFilesObj(item.e_client_files)">
        </v-img>
        <div class='empty_placeholder'>
          <span>Фото подборки</span>
        </div>
        <div>
          <HashTagStyled
            class="podborki__wrapper_list__title"
            :text="item.name"
          >
          </HashTagStyled>
          <div class="podborki__wrapper_list__text">
            <v-card-text
              v-html="item.description"
            >
            </v-card-text>
          </div>
          <div class="podborki__wrapper_list__compilation_info">
            <span>Заполненых параметров: </span>
            <span>Всего статей: </span>
          </div>
        </div>

    </v-card>
  </v-container>
</template>

<script>
import SearchStyled from "@/components/Common/SearchStyled.vue";
import HashTagStyled from "../../components/Common/HashTagStyled.vue";

export default {
  name: 'index.vue',
  components: {SearchStyled, HashTagStyled},
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

.empty_placeholder{
  background-color: #D9D9D9;
  min-width: 254px;
  min-height: 170px;
  border-radius: 5px;
  margin: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
  font-size: 1.3em;
}
.podborki {
  display: grid;
  grid-row-gap: 2em;
  align-content: baseline;
  &__wrapper_list {
    display: flex;
    flex-direction: row;
    //@media (min-width: 500px) {
    //  display: grid;
    //  grid-template-columns: 150px auto
    //}
    &__img {
      min-width: 254px;
      min-height: 170px;
    }
    &__title {
      display: flex;
      padding-top: 1em;
      font-size: 1.3em;
    }
    &__text {
      background-color: #D9D9D9;
      max-height: 85px;
      margin: 1em 1em 1em 0;
      padding: 10px;
      border-radius: 5px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    &__compilation_info {

    }
  }
}
</style>
