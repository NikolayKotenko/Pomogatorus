<template>
  <v-container class="people_wrapper">
    <PeopleCard
      v-for="(item, index) in $store.state.CollaborationModule.listAllUsers"
      :key="index"
      :user-object="item"
    />
  </v-container>
</template>

<script>

import PeopleCard from '../../components/People/PeopleCard.vue'
import UniversalFilter from '../../components/Common/UniversalFilter.vue'

export default {
  components: { UniversalFilter, PeopleCard },
  data() {
    return {}

  },
  async mounted() {
    await this.$store.dispatch('CollaborationModule/getListAllUsers')
  }
}
</script>

<style scoped lang="scss">
.people_wrapper {
  display: grid;
  grid-row-gap: 20px;
  align-items: center;
}
</style>
