<template>
    <v-combobox
      class="styleSearch"
      :class="isClass"
      :outlined="isOutlined"
      :dense="isDense"
      :hide-details="isHideDetails"
      :hide-selected="isHideSelected"
      :placeholder="isPlaceholder"
      :loading="isLoading"
      :disabled="isDisabled"
      :hide-no-data="isHideNoData"
      :items="isItems"
      :chips="isChips"
      :item-text="isItemText"
      :item-value="isItemValue"
      :return-object="isReturnObject"
      :clearable="isClearable"
      @click:clear="$emit('click-clear')"
      :search-input.sync="localSearchInputSync"
      v-model="currentData"
      @update:search-input="$emit('update-search-input', localSearchInputSync)"
      @change="$emit('change-search', localSelected)"
      >
<!--      <template v-slot:append>-->
<!--        <v-icon class="selectIcon"></v-icon>-->
<!--      </template>-->
    </v-combobox>
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
    },
    isChips: {
      type: Boolean,
      default: false
    },
    internalData: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    currentData: {
      get() {
        if (this.internalData) {
          return this.internalData
        }
        return this.localSelected
      },
      set(value) {
        this.localSelected = value
      }
    },
    computedMenu(){
      if (! this.localSearchInputSync) return false;
      if (this.localSelected) return false;

      return (this.localSearchInputSync.length > 2);
    }
  },
  watch: {
    internalData: function(newVal, oldVal) {
      if (!newVal) return false

      this.$emit('update-search-input', newVal)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>

<style lang='scss'>

// TODO: Эти стили изменяют вообще все инпуты в приложении, надо выносить под какой-то класс
//.v-menu__content { display:none !important; }

//.v-input__slot {
//  min-height: 60px !important;
//}

.styleSearch {
  &.primary--text {
    color: #95D7AE !important;
  }

  font-size: 1.8em !important;
  border-radius: 5px;
  //min-width: 1144px;
  min-height: 60px !important;
  max-height: 60px;

  .v-select__selections{
    height: 60px;
  }
  .v-input__append-inner{
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
  }
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
    font-size: 1em;
    margin-top: 20px;
    align-content: center;
    color: #F79256 !important;
  }
}
</style>
