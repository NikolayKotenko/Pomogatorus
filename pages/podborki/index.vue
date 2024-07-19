<template>
  <v-container class="podborki">
    <SubHeader/>
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
      class="search_container"
      @update-search-input="localGetListItems"
      @click-clear="$store.dispatch('PopularSelectionsModule/getListSelections');"
    />

    <v-card
      v-for="(item, key) in $store.state.PopularSelectionsModule.list_selections"
      :key="key"
      elevation="0"
      :href="$route.path + '/' + item.code"
      class="podborki__wrapper_list"
    >
      <v-img
        v-if="getPodborkiPhoto(item)"
        cover
        class="podborki_img"
        :src="getPodborkiPhoto(item)"
      />
      <div
        v-else
        class="empty_placeholder"
      />
      <div class="main_info">
        <div
          class="title"
        >
          {{ item.name }}
        </div>
        <div
          class="text_info"
          v-html="item.description"
        />
        <div class="podborki_info">
          <span>Заполненых параметров: </span>
          <span>Всего статей: </span>
        </div>
      </div>
    </v-card>
    <v-overlay
      :value="$store.state.PopularSelectionsModule.loadingState"
      opacity="1"
      z-index="10"
    >
      <v-progress-circular
        :size="50"
        color="#FFFFFF"
        indeterminate
        style="margin-top: 20px"
      />
    </v-overlay>
  </v-container>
</template>

<script>
import HashTagStyled from '../../components/Common/HashTagStyled.vue';
import SubHeader from '../../components/SubHeader.vue'
import SearchStyled from '@/components/Common/SearchStyled.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'index.vue',
  components: { SubHeader, SearchStyled, HashTagStyled },
  data: () => ({
    debounceTimeout: null
  }),
  head: {
    title: 'Теги',
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
    localGetListItems(searchString){
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)

      this.debounceTimeout = setTimeout(async () => {
        const payload = (searchString) ? { name: searchString } : null
        await this.$store.dispatch('PopularSelectionsModule/getListSelections', payload)
      }, 1000)
    },
    getPodborkiPhoto(elem) {
      if (elem.e_client_files.length) {
        return elem.e_client_files[0].url
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import 'assets/styles/style';

.empty_placeholder {
  background-color: #DDDDDD;
  min-width: 300px;
  min-height: 200px;
  background-image: url("assets/svg/icons/no_img_icon.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 50%;
  border-radius: $b-r16 !important;
  display: flex;
}

.podborki {
  display: grid;
  grid-row-gap: 20px;
  align-content: baseline;
  font-family: 'Inter', sans-serif;

  .search_container {
    max-width: 850px;
    width: 100%;
    margin: 0 auto;
  }

  &__wrapper_list {
    max-width: 850px;
    margin: 0 auto;
    height: 240px;
    display: flex;
    width: 100%;
    grid-column-gap: 20px;
    padding: 20px;
    border-radius: $b-r30 !important;
    transition: $transition;
    &:hover {
      box-shadow: $shadowBox !important;
    }

    .podborki_img {
      border-radius: $b-r16 !important;
      max-width: 300px;
      max-height: 200px;
    }
    .main_info {
      display: grid;
      grid-row-gap: 10px;
      width: 100%;
      .title {
        @extend .header-page;
      }
      .text_info {
        background-color: #D9D9D9;
        padding: 10px;
        border-radius: $b-r8;
        width: 100%;

      }
      .podborki_info {

      }
    }
  }
}

.podborki__wrapper_list__text {
  background-color: #D9D9D9;
  max-height: 85px;
  width: auto;
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
    font-size: 1em;
  }

  .podborki__wrapper_list__compilation_info {
    display: grid;
    font-size: 0.8em;
  }
}
</style>
