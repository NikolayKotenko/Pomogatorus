<template>
  <v-btn
    :class="computedClass"
    :disabled="isDisabled"
    :href="href"
    :loading="isLoading"
    :nuxt="isNuxtLink"
    :max-width="maxWidth"
    :max-height="maxHeight"
    @click="$emit('click-button')"
  >
    <template v-if="customSlot">
      <slot/>
    </template>
    <template v-else>
      {{ localText }}
    </template>
  </v-btn>
</template>

<script>
export default {
  name: 'ButtonStyled',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isAnimation: {
      type: Boolean,
      default: false
    },
    href: {
      type: String,
      default: ''
    },
    localClass: {
      type: String,
      default: ''
    },
    isSolo: {
      type: Boolean,
      default: false
    },
    isNuxtLink: {
      type: Boolean,
      default: false
    },
    localText: {
      type: String,
      default: ''
    },
    customSlot: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    unsetWidth: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: String,
      default: ''
    },
    maxHeight: {
      type: String,
      default: ''
    }
  },
  computed: {
    computedClass() {
      const basedClass = 'btnStyled'
      const animatedClass = (this.isAnimation) ? 'animation_save' : ''
      const mobileClass = this.isMobile || this.unsetWidth ? '' : 'desktop_style'
      return `${basedClass} ${mobileClass} ${this.localClass} ${animatedClass}`
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'assets/styles/style';

.btnStyled {
  font-weight: 400;
  text-transform: none !important;
  letter-spacing: normal !important;
  //font-style: normal !important;
  font-size: 1em;
  border-radius: 25px;
  border: 2px solid #000000;
  transition: $transition;

  &:hover {
    background: darken(#ffffff, 5%);
  }

}

.desktop_style {
  height: 3.2em !important;
  width: 14.2em;
  max-height: 40px;
  max-width: 200px;
}

.v-btn.style_button {
  background-color: $background-element-color !important;
  color: $black-text-color;
  border: 1px solid #000000;
  transition: $transition;
  &:hover {
    background: #000000 !important;
    color: #FFFFFF;
  }
}
.v-btn.style_wide_button {
  background-color: $background-element-color !important;
  color: $black-text-color;
  border: 1px solid #000000;
  max-width: 560px !important;
  width: 560px !important;
  transition: $transition;
  &:hover {
    background: #000000 !important;
    color: #FFFFFF;
  }
}


.style_close {
  background: $background-element-color !important;
  color: $black-text-color;
  border: 1px solid $orange-color;
  transition: $transition;
  &:hover {
    background: $orange-color !important;
    color: #000000;

  }
}

</style>
