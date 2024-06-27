<template>
  <v-btn
    :class="computedClass"
    :disabled="isDisabled"
    :elevation="elevation"
    :href="href"
    :loading="isLoading"
    :max-height="maxHeight"
    :max-width="maxWidth"
    :min-height="minHeight"
    :min-width="minWidth"
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
    },
    unsetWidth: {
      type: Boolean,
      default: false
    },
    maxWidth: {
      type: [String, Number],
      default: ''
    },
    minWidth: {
      type: [String, Number],
      default: ''
    },
    minHeight: {
      type: [String, Number],
      default: ''
    },
    maxHeight: {
      type: [String, Number],
      default: ''
    },
    elevation: {
      type: Number,
      default: null
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

.v-btn.new_style_button {
  padding: 0 20px !important;
  background-color: #d9d9d9 !important;
  border: none;
  border-radius: 15px;
  text-wrap: nowrap;
  font-weight: 600 !important;
  display: flex;
  align-items: center;
  width: auto !important;
  height: 40px;
  cursor: pointer;
  font-size: 1em !important;
  box-shadow: none !important;

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

.v-btn.style_save_button {
  background-color: #FF6347 !important;
  color: #FFFFFF;
  border: 1px solid #FF6347;
  transition: $transition;

  &:hover {
    background: #FFFFFF !important;
    border: 1px solid #000000;
    color: #000000;
  }
}

.v-btn.style_object_button {
  background-color: $background-element-color !important;
  color: $black-text-color;
  border: 1px solid #000000;
  max-width: 375px !important;
  width: 375px !important;
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

.new-style-btn {
  border-radius: 30px;
}

.btn-save {
  background: #FF6347 !important;
  border: 1px solid #FF6347;
  color: white !important;
}

.btn-cancel {
  border: 1px solid #111111;
  background: transparent;
}

</style>
