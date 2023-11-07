<template>
  <v-btn
    :class="computedClass"
    :disabled="isDisabled"
    :href="href"
    :loading="isLoading"
    :nuxt="isNuxtLink"
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
    }
  },
  computed: {
    computedClass() {
      const basedClass = 'btnStyled'
      const animatedClass = (this.isAnimation) ? 'animation_save' : ''
      const mobileClass = this.isMobile ? '' : 'desktop_style'
      return `${basedClass} ${mobileClass} ${this.localClass} ${animatedClass}`
    }
  }
}
</script>

<style lang='scss' scoped>

.btnStyled {
  font-weight: 400;
  text-transform: none !important;
  letter-spacing: normal !important;
  //font-style: normal !important;
  font-size: 1em;
  border-radius: 5px;
  border: 1px solid #857885;
  box-shadow: rgba(0, 0, 0, 0.25);
  transition: 0.4s;

  &:hover {
    background: darken(#ffffff, 5%);
    transition: 0.4s;
  }

}

.desktop_style {
  height: 3.2em !important;
  width: 14.2em;
  max-height: 45px;
  max-width: 200px;
}

.v-btn.style_button {
  background-color: #ffffff !important;
  color: #000000;
  border: 1px solid rgba(149, 215, 174, 1);

  &:hover {
    background: #95D7AE !important;
    transition: 0.4s;
  }
}


.style_close {
  background: #FFFFFF !important;
  color: #000000;
  border: 1px solid rgba(247, 146, 86, 1);
  margin-left: auto;

  &:hover {
    background: #F79256 !important;
    color: #000000;
    transition: 0.4s;
  }
}
</style>
