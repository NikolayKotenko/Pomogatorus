<template>
  <v-btn
    :class='localClass'
    class="btnStyled"
    @click="$emit('click-button')"
  >
    {{localText}}
  </v-btn>
</template>

<script>
export default {
  name: "ButtonStyled",
  props: {
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
  }
}
</script>

<style lang="scss" scoped>

.btnStyled {
  font-weight: 400;
  text-transform: none !important;
  letter-spacing: normal;
  font-size: 1em;
  border-radius: 5px;
  border: 0.5px solid rgba(133, 120, 133, 1);
  box-shadow: rgba(0, 0, 0, 0.25);
}

.style_save {
  background: #FFFFFF !important;
  color: #95D7AE;
  border: 1px solid rgba(149, 215, 174, 1);

  &:hover {
    background: #95D7AE !important;
    color: #FFFFFF;
    transition: 0.5s;
  }

}

.style_download {
  margin-right: 45%;
}

.style_close {
  background: #FFFFFF !important;
  color: #F79256;
  border: 1px solid rgba(247, 146, 86, 1);

  &:hover {
    background: #F79256 !important;
    color: #FFFFFF;
    transition: 0.5s;
  }
}
</style>
