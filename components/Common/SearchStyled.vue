<template>
  <div>
      <v-autocomplete
        class="styleSearch"
        :class="isClass"
        :outlined="isOutlined"
        :dense="isDense"
        :hide-details="isHideDetails"
        :placeholder="isPlaceholder"
        :loading="isLoading"
        :disabled="isDisabled"
        :hide-no-data="isHideNoData"
        :items="isItems"
        :item-text="isItemText"
        :item-value="isItemValue"
        :return-object="isReturnObject"
        :clearable="isClearable"
        :search-input.sync="localSearchInputSync"
        v-model="localSelected"
        @update:search-input="$emit('update-search-input', localSearchInputSync)"
        @change="$emit('change-search', localSelected)"
      >
        <template v-slot:append>
          <v-icon

          >mdi-magnify</v-icon>
        </template>
      </v-autocomplete>
  </div>
</template>

<script>

export default {
  name: 'SearchStyled',
  data: () => ({
    localSearchInputSync: '',
    localSelected: null
  }),
  props: {
    isClass: {
      type: String,
      default: ''
    },
    isOutlined: {
      type: Boolean,
      default: true
    },
    isDense: {
      type: Boolean,
      default: true
    },
    isHideDetails: {
      type: Boolean,
      default: true
    },
    isPlaceholder: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isHideNoData: {
      type: Boolean,
      default: false
    },
    isItems: {
      type: Array,
      default: () => []
    },
    isItemText: {
      type: String,
      default: ''
    },
    isItemValue: {
      type: String,
      default: ''
    },
    isReturnObject: {
      type: Boolean,
      default: true
    },
    isClearable: {
      type: Boolean,
      default: true
    },
  },
  computed: {}
}
</script>

<style lang='scss' scoped>
</style>

<style lang="scss">
.styleSearch {
  font-size: 2.5em !important;
  .v-select__slot {
    input {
      margin: 0 !important;
    }
  }
}
</style>
