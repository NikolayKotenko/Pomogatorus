<template>
  <v-chip
    class="styleChip"
    :class="isClass"
    :column="isColumn"
    :outlined="isOutlined"
    :large="isLarge"
    @click="$emit('click-chip')"
  >
    {{localText}}
  </v-chip>
</template>

<script>
export default {
  name: "ChipStyled",
  props: {
    isClass: {
      type: String,
      default: ''
    },
    isColumn: {
      type: Boolean,
      default: false
    },
    localText: {
      type: String,
      default: ''
    },
    isOutlined: {
      type: Boolean,
      default: false
    },
    isLarge: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.styleChip {
  margin: 1em 0;
  border-radius: 3px;
  background: #D9D9D9 !important;
  font-size: 1.3em;
  font-weight: 300;
  padding: 0;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  }

}
</style>

