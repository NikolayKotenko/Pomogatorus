<template>
  <v-btn
    :class="computedClass"
    :disabled="isDisabled"
    :href="href"
    :loading="isLoading"
    :nuxt="isNuxtLink"
    :max-width="maxWidth"
    :max-height="maxHeight"
    :elevation="elevation"
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
    },
    elevation: {
      type: Number,
      default: 0
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

// Обычные кнопки

.v-btn.regular_style_btn {
  @extend .regular-btn-text;
  border-radius: $b-r30;
  min-height: 40px;
  background-color: $grey1 !important;
  padding: 10px 20px !important;
  transition: $transition;
  &:hover {
    @extend  .white-regular-btn-text;
    background-color: $red !important;
  }
}

.v-btn.red_regular_style_btn {
  @extend  .white-regular-btn-text;
  border-radius: $b-r30;
  min-height: 40px;
  background-color: $red !important;
  padding: 10px 20px !important;
  transition: $transition;
  &:hover {
    @extend  .regular-btn-text;
    background-color: $white-color !important;
  }
}

.v-btn.bordered_regular_style_btn {
  @extend  .regular-btn-text;
  border-radius: $b-r30;
  min-height: 40px;
  border: 1px solid ($black-color);
  background-color: $white-color !important;
  padding: 10px 20px !important;
  transition: $transition;
  &:hover {
    @extend  .white-regular-btn-text;
    background-color: $black-color !important;
  }
}

.v-btn.black_regular_style_btn {
  @extend  .white-regular-btn-text;
  border-radius: $b-r30;
  min-height: 40px;
  border: 1px solid ($black-color);
  background-color: $black-color !important;
  padding: 10px 20px !important;
  transition: $transition;
  &:hover {
    @extend  .regular-btn-text;
    background-color: $white-color !important;
  }
}

.v-btn.grey_regular_style_btn {
  @extend  .regular-btn-text;
  border-radius: $b-r30;
  min-height: 40px;
  border: 1px solid ($grey1);
  background-color: $white-color !important;
  padding: 10px 20px !important;
  transition: $transition;
  &:hover {
    @extend  .grey-regular-btn-text;
    background-color: $grey1 !important;
  }
}


// Широкие кнопки

.v-btn.wide_style_btn {
  @extend  .wide-btn-text;
  border-radius: $b-r16;
  min-height: 40px;
  background-color: $grey1 !important;
  padding: 10px 20px !important;
  transition: $transition;
  &:hover {
    @extend  .white-wide-btn-text;
    background-color: $red !important;
  }
}

.v-btn.red_wide_style_btn {
  @extend  .white-wide-btn-text;
  border-radius: $b-r16;
  min-height: 40px;
  background-color: $red !important;
  padding: 10px 20px !important;
  transition: $transition;
  &:hover {
    @extend  .wide-btn-text;
    background-color: $grey1 !important;
  }
}

.v-btn.bordered_wide_style_btn {
  @extend  .wide-btn-text;
  border-radius: $b-r16;
  min-height: 40px;
  border: 2px solid ($black-color);
  background-color: $white-color !important;
  padding: 10px 20px !important;
  transition: $transition;
  &:hover {
    @extend  .white-wide-btn-text;
    background-color: $black-color !important;
  }
}

.v-btn.black_wide_style_btn {
  @extend  .white-wide-btn-text;
  border-radius: $b-r16;
  min-height: 40px;
  border: 2px solid ($black-color);
  background-color: $black-color !important;
  padding: 10px 20px !important;
  transition: $transition;
  &:hover {
    @extend  .wide-btn-text;
    background-color: $white-color !important;
  }
}

.v-btn.grey_wide_style_btn {
  @extend  .wide-btn-text;
  border-radius: $b-r16;
  min-height: 40px;
  border: 2px solid ($grey1);
  background-color: $white-color !important;
  padding: 10px 20px !important;
  transition: $transition;
  &:hover {
    @extend  .grey-wide-btn-text;
    background-color: $grey1 !important;
  }
}

.btnStyled {
  font-weight: 400;
  text-transform: none !important;
  letter-spacing: normal !important;
  //font-style: normal !important;
  font-size: 1em;
  border-radius: 25px;
  transition: $transition;

  &:hover {
    background: darken(#ffffff, 5%);
  }

}

//.desktop_style {
//  height: 3.2em !important;
//  width: 14.2em;
//  max-height: 40px;
//  max-width: 200px;
//}

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
.v-btn.red_style_button {
  padding: 0 20px !important;
  background-color: #FF6347 !important;
  color: #FFFFFF;
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

</style>
