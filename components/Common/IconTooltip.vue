<template>
  <TooltipStyled
    :is-top="isTopTooltip"
    :title="! isDisabled ? textTooltip : ''"
  >
    <v-icon
      :color="colorIcon"
      :disabled="isDisabled"
      :size="sizeIcon"
      class="hover_style"
      @click="$emit('click-icon')"
    >
      {{ iconText }}
    </v-icon>
  </TooltipStyled>
</template>

<script>
import TooltipStyled from '../Common/TooltipStyled.vue';

export default {
  name: 'IconTooltip',
  components: {
    TooltipStyled
  },
  props: {
    sizeIcon: {
      type: String,
      default: '24'
    },
    colorIcon: {
      type: String,
      default: '#5D80B5'
    },
    iconText: {
      type: String,
      default: 'mdi-help-circle-outline'
    },
    textTooltip: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isTopTooltip: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss" scoped>
.hover_style {
  transition: all 0.4s ease-in-out;
  &:hover {
    color: #000000 !important;

  }
}
</style>

