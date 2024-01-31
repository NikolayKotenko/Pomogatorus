<template>
  <v-chip-group
    v-model="currentData"
    :multiple="isMultiple"
    :show-arrows="true"
    class="styleChip_container"
  >
    <v-chip
      v-for="(object, key) in listChips"
      :key="key"
      :filter="isFilter"
      :large="isLarge"
      :outlined="isOutlined"
      :small="isSmall"
      :value="object[valueField]"
      class="styleChip"
      @click="$emit('click-chip', object)"
    >
      {{ object[textField] }}
    </v-chip>
  </v-chip-group>
</template>

<script>
export default {
  name: 'ChipsStyled',
  props: {
    listChips: {
      type: Array,
      default: () => []
    },
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
    isFilter: {
      type: Boolean,
      default: false
    },
    isLarge: {
      type: Boolean,
      default: false
    },
    isSmall: {
      type: Boolean,
      default: false
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    textField: {
      type: String,
      default: 'text'
    },
    valueField: {
      type: String,
      default: 'value'
    }
  },
  computed: {
    currentData: {
      get() {
        return this.data;
      },
      set(value) {
        this.$emit('update-chips', value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.styleChip_container {
  margin: 1em 0;
  //width: auto;
  //max-width: $max-width;
}

.styleChip {
  //width:100px;
  //white-space: nowrap;
  //overflow: hidden;
  //text-overflow: ellipsis;

  border-radius: 5px;
  background: #FFFFFF !important;
  font-size: 1.3em;
  font-weight: 300;
  padding: 0.5em;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  transition: $transition;

  &:hover {
    background: #95D7AE !important;
    transition: 0.4s;
  }

  &.v-chip.v-chip--outlined.v-chip.v-chip {
    background-color: #95D7AE !important;

  }

}

</style>

<style lang="scss">
.styleChip_container {
  .v-slide-group__content {
    //width: 100%;
    //flex-wrap: wrap;
  }
}
</style>

