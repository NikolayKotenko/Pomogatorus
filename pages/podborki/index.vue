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
        v-if="getPodborkiPhoto(item)"
        cover
        class="podborki_img"
        :src="getPodborkiPhoto(item)"
      />
      <div
        v-else
        class="empty_placeholder"
      >
        <span>Фото подборки</span>
      </div>
      <div class="main_info">
        <HashTagStyled
          class="info_title"
          :text="item.name"
        />
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
      absolute
      class="overlay_style"
      color="#F2F2F2"
      opacity="100"
    >
      <v-progress-circular
        color="#95D7AE"
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-container>
</template>

<script>
import HashTagStyled from '../../components/Common/HashTagStyled.vue';
import SearchStyled from '@/components/Common/SearchStyled.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'index.vue',
  components: { SearchStyled, HashTagStyled },
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

.empty_placeholder{
  background-color: #D9D9D9;
  min-width: 254px;
  min-height: 170px;
  border-radius: 5px !important;
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
    height: 210px;
    display: flex;
    grid-column-gap: 20px;
    padding: 20px;
    &:hover {
      background-color: #FFF4CB;
      box-shadow: 0px 5px 20px 7px rgba(34, 60, 80, 0.2) !important;
    }

    .podborki_img {
      border-radius: 5px !important;
      max-width: 254px;
      max-height: 170px;
    }
    .main_info {
      display: grid;
      grid-row-gap: 10px;
      .info_title {
        font-size: 1.5em;
      }
      .text_info {
        background-color: #D9D9D9;
        padding: 10px;
        border-radius: 5px;

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
