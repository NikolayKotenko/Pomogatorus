<template>
  <v-tooltip bottom>
    <template #activator='{ on, attrs }'>
      <div v-bind='attrs' v-on='on'>
        <slot></slot>
      </div>
    </template>
    <span class='upcoming-title'>Функционал в разработке!</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'UpcomingTitle'
}
</script>

<style scoped>

</style>
