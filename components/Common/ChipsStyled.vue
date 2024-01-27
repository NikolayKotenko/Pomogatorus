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

  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  border-radius: 3px;
  background: #FFFFFF !important;
  font-size: 1.3em;
  font-weight: 300;
  padding: 0.5em;
  transition: 0.4s;

  &:hover {
    background: #95D7AE !important;
    transition: 0.4s;
  }

  &.v-slide-item--active.v-chip--active {
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

