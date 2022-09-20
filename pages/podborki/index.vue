<template>
   <div class="list_container">
      <v-card
         :href="$route.path + '/' + item.code"
         hover
         v-for="(item, key) in $store.state.PopularSelectionsModule
            .list_selections"
         :key="key"
      >
         <v-card-title>
            {{ item.name }}
         </v-card-title>
         <v-card-text v-html="item.description"> </v-card-text>
      </v-card>
   </div>
</template>

<script>
export default {
   name: 'index.vue',
   components: {},
   data: () => ({}),
   meta: {},
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
      this.$store.commit('change_breadcrumbs', [
         { text: 'Главная', disabled: false, link: true, exact: true, to: '/' },
         {
            text: 'Подборки',
            disabled: true,
            link: true,
            exact: true,
            to: '/podborki',
         },
      ])
   },
   methods: {},
}
</script>

<style scoped lang="scss"></style>
