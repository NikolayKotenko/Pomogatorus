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
  border: 1px solid #95D7AE;
  box-shadow: rgba(0, 0, 0, 0.25);
  transition: 0.4s;

    &:hover {
      background: #95D7AE;
      transition: 0.4s;
    }

}

.style_save {
  background: #FFFFFF !important;
  color: #000000;
  border: 1px solid rgba(149, 215, 174, 1);

  &:hover {
    background: #95D7AE !important;
    transition: 0.4s;
  }
}

.style_download {
  margin-right: 30%;
  margin-left: 5%;
}

.style_close {
  background: #FFFFFF !important;
  color: #000000;
  border: 1px solid rgba(247, 146, 86, 1);

  &:hover {
    background: #F79256 !important;
    color: #000000;
    transition: 0.4s;
  }
}
</style>
