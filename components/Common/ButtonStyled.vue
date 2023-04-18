<template>
  <v-btn
    :class='computedClass'
    :loading='isLoading'
    @click="$emit('click-button')"
    :disabled="isDisabled"
    :href="href"
  >
    <template v-if='customSlot'>
      <slot></slot>
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
    localText: {
      type: String,
      default: ''
    },
    customSlot: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    computedClass(){
      const basedClass = 'btnStyled';
      const animatedClass = (this.isAnimation) ? 'animation_save' : '';
      return basedClass + ' ' + this.localClass + ' ' + animatedClass;
    }
  }
}
</script>

<style lang='scss' scoped>

.btnStyled {
  height: 3.2em !important;
  width: 14.2em;
  max-height: 45px;
  max-width: 200px;
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

.style_button {
  background-color: #ffffff !important;
  color: #000000;
  border: 1px solid rgba(149, 215, 174, 1);

  &:hover {
    background: #95D7AE !important;
    transition: 0.4s;
  }
}
.animation_save{
  background: #95D7AE !important;
  transition-property: transform;
  transition-duration: 2s;
  transition-timing-function: ease-out;
  transition-delay: 0s;
  transform: scale(1.1);
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
