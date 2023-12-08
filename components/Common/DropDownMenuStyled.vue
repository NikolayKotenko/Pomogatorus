<template>
  <v-menu
    :close-on-content-click="false"
    :left="isLeft"
    :offset-y="isOffsetY"
    :top="isTop"
  >
    <template #activator="{ on, attrs }">
      <div
        v-bind="attrs"
        v-on="on"
      >
        <slot name="icon"/>
      </div>
    </template>
    <v-card class="pa-4">
      <slot name="content"/>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'DropDownMenuStyled',
  props: {
    slotIcon: {
      type: Boolean,
      default: false
    },
    slotContent: {
      type: Boolean,
      default: false
    },
    isOffsetY: {
      type: Boolean,
      default: true
    },
    isTop: {
      type: Boolean,
      default: false
    },
    isLeft: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>

</style>
