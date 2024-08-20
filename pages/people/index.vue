<template>
  <div style="max-width: 850px; margin-right: auto; margin-left: auto;">
    <DevelopedMessage v-if="isDeveloped"/>
    <v-container v-else class="people_wrapper">
      <PeopleCard
        v-for="(item, index) in $store.state.CollaborationModule.listAllUsers"
        :key="index"
        :user-object="item"
      />
    </v-container>
  </div>
</template>

<script>

import PeopleCard from '../../components/People/PeopleCard.vue'
import UniversalFilter from '../../components/Common/UniversalFilter.vue'
import DevelopedMessage from '../../components/frontLayouts/DevelopedMessage.vue'

export default {
  components: { DevelopedMessage, UniversalFilter, PeopleCard },
  props: {
    isDeveloped: {
      type: Boolean,
      default: true
    }
  },
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
