<template>

  <div>
    <div>
      <v-autocomplete class="search">
        outlined
        dense
        hide-details
        placeholder="Выберите агента"
        :loading="$store.state.loadingAgents"
        :disabled="$store.state.loadingAgents"
        hide-no-data
        label="Помощник назначения агента"
        :items="$store.state.listAgents"
        item-text="last_name"
        item-value="id"
        return-object
        clearable
        v-model="agent"
      </v-autocomplete>
      <v-chip-group class="tags"
    </div>
    <div v-if='articles' class='list_container'>
      <Article v-for='(article, index) in articles' :key='index' :article='article' />
    </div>
  </div>

</template>

<script>
import Article from '../../components/Article/Article'
import Request from '../../services/request'

export default {
  name: 'index.vue',
  components: { Article },
  data: () => ({}),
  head: {
    title: 'Поиск',
    meta: []
  },
  async asyncData({ store, params }) {
    try {
      const query = {
        'filter[activity]': true
      }
      const result = await Request.get(`${store.state.BASE_URL}/entity/articles`, query, true)
      const articles = result.data
      return { articles }
    } catch (error) {
      console.warn(error)
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style lang='scss' scoped></style>
