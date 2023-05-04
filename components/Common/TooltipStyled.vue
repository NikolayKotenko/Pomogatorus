<template>
  <VTooltip :bottom="(! isTop)" :top="isTop">
    <template #activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <slot />
      </div>
    </template>
    <span class="tooltip-styled">{{ title }}</span>
  </VTooltip>
</template>

<script>
export default {
  name: "TooltipStyled",
  props: {
    title: {
      type: String,
      default: "Функционал в разработке"
    },
    isTop: {
      type: Boolean,
      default: false
    }
  }
};
</script>

