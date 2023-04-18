<template>
  <v-tooltip bottom>
    <template #activator='{ on, attrs }'>
      <div v-bind='attrs' v-on='on'>
        <slot></slot>
      </div>
    </template>
    <span class='tooltip-styled'>{{ title }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'TooltipStyled',
  props:{
    title: {
      type: String,
      default: 'Функционал в разработке'
    },
  }
}
</script>

<style scoped>

</style>
