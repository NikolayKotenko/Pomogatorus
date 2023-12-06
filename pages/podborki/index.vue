<template>
  <v-container class="podborki">
    <SearchStyled
      :is-class="'styleSearch'"
      :is-clearable="true"
      :is-disabled="$store.state.PopularSelectionsModule.loadingState"
      :is-hide-selected="true"
      :is-item-text="'text'"
      :is-item-value="'text'"
      :is-items="$store.state.PopularSelectionsModule.list_selections"
      :is-loading="$store.state.PopularSelectionsModule.loadingState"
      :is-placeholder="'Поиск тегов'"
      @update-search-input="localGetListItems"
      @click-clear="$store.dispatch('PopularSelectionsModule/getListSelections');"
    />

    <v-card
      v-for="(item, key) in $store.state.PopularSelectionsModule.list_selections"
      :key="key"
      :href="$route.path + '/' + item.code"
      class="podborki__wrapper_list"
    >
      <v-img
        v-if="$store.getters.getImageByEClientFilesObj(item.e_client_files)"
        :class="{'empty_placeholder': ! $store.getters.getImageByEClientFilesObj(item.e_client_files) }"
        :src="$store.getters.getImageByEClientFilesObj(item.e_client_files)"
      />
      <div class="empty_placeholder">
        <span>Фото подборки</span>
      </div>
      <div class="main_info">
        <HashTagStyled
          :text="item.name"
          class="podborki__wrapper_list__title"
        />
        <div>
          <v-card-text
            class="podborki__wrapper_list__text"
            v-html="item.description"
          />
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
import HashTagStyled from "../../components/Common/HashTagStyled.vue";
import SearchStyled from "@/components/Common/SearchStyled.vue";

export default {
  name: "index.vue",
  components: { SearchStyled, HashTagStyled },
  data: () => ({
    debounceTimeout: null
  }),
  head: {
    title: "Подборки",
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
    this.$store.dispatch("PopularSelectionsModule/getListSelections");
  },
  methods: {
    async localGetListItems(searchString) {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);

      this.debounceTimeout = setTimeout(async () => {
        const payload = (searchString) ? { name: searchString } : null;
        await this.$store.dispatch("PopularSelectionsModule/getListSelections", payload);
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>

.empty_placeholder {
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
    flex-wrap: wrap;

    &:hover {
      background-color: #FFF4CB;
      box-shadow: 0px 5px 20px 7px rgba(34, 60, 80, 0.2) !important;
    }

    &__img {
      min-width: 254px;
      min-height: 170px;
    }

    &__title {
      display: flex;
      margin: 1em;
      font-size: 1.3em;
    }

    &__text {

    }

    &__compilation_info {
      margin: 1em;
    }
  }
}

.podborki__wrapper_list__text {
  background-color: #D9D9D9;
  max-height: 85px;
  width: auto;
  margin: 1em;
  border-radius: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media screen and (max-width: 800px) {
  .podborki__wrapper_list {
    flex-direction: column;
  }
  .main_info {
    padding: 0 10px;
  }

}

@media screen and (max-width: 600px) {
  .podborki__wrapper_list__title {
    font-size: 1em
  }
;
  .podborki__wrapper_list__compilation_info {
    display: grid;
    font-size: 0.8em;
  }
}
</style>
