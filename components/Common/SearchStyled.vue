<template>
  <div>
    <v-autocomplete
      v-model='localSelected'
      :class='isClass'
      :clearable='isClearable'
      :dense='isDense'
      :disabled='isDisabled'
      :hide-details='isHideDetails'
      :hide-no-data='isHideNoData'
      :hide-selected='isHideSelected'
      :item-text='isItemText'
      :item-value='isItemValue'
      :items='isItems'
      :loading='isLoading'
      :outlined='isOutlined'
      :placeholder='isPlaceholder'
      :return-object='isReturnObject'
      :search-input.sync='localSearchInputSync'
      class='styleSearch'
      @change="$emit('change-search', localSelected)"
      @click:clear="$emit('click-clear')"
      @update:search-input="$emit('update-search-input', localSearchInputSync)"
    >
      <template v-slot:append>
        <v-icon class='selectIcon'></v-icon>
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
    isHideSelected: {
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
    }
  },
  computed: {}
}
</script>

<style lang='scss'>

// TODO: Зачем это нужно было?
//.v-menu__content {
//  display: none !important;
//}

.styleSearch {
  font-size: 1.8em !important;
  border-radius: 5px;
  //min-width: 1144px;
  max-height: 60px;

  .v-select__slot {
    color: #37392E !important;

    input {
      margin: 10px 0 !important;
      padding: 15px 0;


    }
  }

  .selectIcon {
    color: #857885 !important;
    font-size: 1.2em !important;
    cursor: pointer;
    margin-top: 5px;

  }

  .mdi-close {
    font-size: 1.2em;
    margin-top: 20px;
  }
}
</style>
