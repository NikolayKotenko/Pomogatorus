<template>
  <v-menu
    :close-on-click="closeOnClickOutside"
    :close-on-content-click="closeOnContentClick"
    :open-on-hover="openOnHover"
    :open-on-click="openOnClick"
    :close-delay="closeDelay"
    :left="isLeft"
    :nudge-bottom="nudgeBottom"
    :nudge-right="nudgeRight"
    :nudge-top="nudgeTop"
    :nudge-left="nudgeLeft"
    :offset-y="isOffsetY"
    :top="isTop"
    :content-class="'content_menu_style'"
    :absolute="isAbsolute"
    :value="isValue"
    :disabled="isDisabled"
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
    <slot name="content" :class="{ 'custom_position': isCustomPosition}"/>
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
    nudgeTop: {
      type: Number,
      default: 0
    },
    nudgeLeft: {
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
    },
    roundedSize: {
      type: String,
      default: ''
    },
    isAbsolute: {
      type: Boolean,
      default: false
    },
    openOnHover: {
      type: Boolean,
      default: false
    },
    openOnClick: {
      type: Boolean,
      default: true
    },
    closeDelay: {
      type: String,
      default: ''
    },
    isValue: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    }

  }
};
</script>

<style lang="scss" scoped>
.custom_position {
  top: 0 !important;
  left: 0 !important;
}
</style>
