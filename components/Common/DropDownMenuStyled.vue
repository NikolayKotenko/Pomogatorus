<template>
  <v-menu
    :close-on-click="closeOnClickOutside"
    :close-on-content-click="closeOnContentClick"
    :left="isLeft"
    :nudge-bottom="nudgeBottom"
    :nudge-right="nudgeRight"
    :offset-y="isOffsetY"
    :top="isTop"
    bottom
  >
    <template #activator="{ on, attrs }">
      <div
        v-bind="attrs"
        v-on="on"
      >
        <slot name="icon"/>
      </div>
    </template>
    <slot name="content"/>
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
    },
    nudgeBottom: {
      type: Number,
      default: 0
    },
    nudgeRight: {
      type: Number,
      default: 0
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true
    },
    closeOnContentClick: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>

</style>
