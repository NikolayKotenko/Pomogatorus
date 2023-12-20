<template>
  <v-menu
    :close-on-click="closeOnClickOutside"
    :close-on-content-click="false"
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
    }
  }
};
</script>

<style scoped>

</style>
