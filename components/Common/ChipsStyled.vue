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
  font-family: 'Inter', sans-serif;
  //width:100px;
  //white-space: nowrap;
  //overflow: hidden;
  //text-overflow: ellipsis;
  border-radius: 0 !important;
  font-size: 1em !important;

  font-weight: 400;
  padding: 0.5em;

  transition: $transition;


  //&.v-chip.v-chip--outlined.v-chip.v-chip {
  //  background-color: #EEEEEE !important;
  //
  //
  //}
  &.v-chip {
    border-bottom: 3px solid #DFDFDF !important;
  }
  &.v-chip--active {
    border-bottom: 3px solid #FF6347 !important;
  }
  &.v-chip:before {
    background-color: #DFDFDF !important;
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

