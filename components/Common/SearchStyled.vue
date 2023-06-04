<template>
  <VCombobox
    v-model="currentData"
    :chips="isChips"
    :class="isClass"
    :clearable="(localSearchInputSync || localSelected) ? isClearable : false"
    :dense="isDense"
    :disabled="false"
    :filled="isFilled"
    :hide-details="isHideDetails"
    :hide-no-data="isHideNoData"
    :hide-selected="isHideSelected"
    :item-text="isItemText"
    :item-value="isItemValue"
    :items="isItems"
    :loading="false"
    :menu-props="(computedSearchInputState && compareSearchStringAndExistEntry) ? {} : {value: false}"
    :outlined="isOutlined"
    :placeholder="isPlaceholder"
    :return-object="isReturnObject"
    :rounded="isRounded"
    :search-input.sync="localSearchInputSync"
    @change="$emit('change-search', localSelected)"
    @click:clear="$emit('click-clear')"
    @update:search-input="$emit('update-search-input', localSearchInputSync)"
  >
    <!--      <template v-slot:append> -->
    <!--        <v-icon class="selectIcon">mdi-select</v-icon> -->
    <!--      </template> -->
    <template v-if="isCustomTemplateSelections" #item="data">
      <VListItemContent @click="watchDataRedirect(data.item)">
        <VListItemTitle v-if="data.item.category === 'Тэги'">
          <HashTagStyled :text="getTitleString(data.item.text)"/>
        </VListItemTitle>
        <VListItemTitle v-else>
          <span v-html="getTitleString(data.item.text)"/>
        </VListItemTitle>
      </VListItemContent>
    </template>
    <template v-if="isCustomSearchSelections" #item="data">
      <div
        class="search_user_invite"
        @click="stopInput($event)"
      >
        <CardInviteUser
          :user-object="data.item"
        />
      </div>
    </template>
  </VCombobox>
</template>

<script>
import CardInviteUser from './CardInviteUser.vue';
import HashTagStyled from '~/components/Common/HashTagStyled'

export default {
  name: 'SearchStyled',
  components: { CardInviteUser, HashTagStyled },
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
    isFilled: {
      type: Boolean,
      default: false
    },
    isRounded: {
      type: Boolean,
      default: false
    },
    isHideDetails: {
      type: Boolean,
      default: true
    },
    isPlaceholder: {
      type: String,
      default: ''
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
      default: false
    },
    isChips: {
      type: Boolean,
      default: false
    },
    internalData: {
      type: [String, Number],
      default: null
    },
    isCustomTemplateSelections: {
      type: Boolean,
      default: false
    },
    isCustomSearchSelections: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    localSearchInputSync: '',
    localSelected: null
  }),
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
    computedSearchInputState() {
      if (!this.localSearchInputSync) return false

      return (this.localSearchInputSync.length > 2)
    },
    compareSearchStringAndExistEntry() {
      if (!this.localSelected) return true

      return this.localSelected[this.isItemText] !== this.localSearchInputSync
    }
  },
  watch: {
    internalData: function(newVal, oldVal) {
      if (!newVal) return false

      this.$emit('update-search-input', newVal)
    }
  },
  methods: {
    watchDataRedirect(data) {
      this.$emit('redirect', data)
    },
    getTitleString(text) {
      const { start, middle, end } = this.getMaskedCharacters(text)
      return `${start}${this.genHighlight(middle)}${end}`
    },

    // Вспомогательные функции
    getMaskedCharacters(text) {
      const searchInput = (this.localSearchInputSync || '').toString().toLocaleLowerCase()
      const index = text.toLocaleLowerCase().indexOf(searchInput)

      if (index < 0) return { start: text, middle: '', end: '' }

      const start = text.slice(0, index)
      const middle = text.slice(index, index + searchInput.length)
      const end = text.slice(index + searchInput.length)
      return { start, middle, end }
    },
    genHighlight(text) {
      return `<span class='v-list-item__mask'>${text}</span>`
    },
    stopInput(e) {
      console.log('1', e);
      e.stopPropagation();
      e.preventDefault();
      console.log('2', e);
    },
  }
}
</script>

<style lang='scss' scoped>
.v-text-field--rounded {
  border-radius: 5px !important;
}
.search_user_invite{
  width: 100%;
  max-width: 850px;
  cursor: default;
}
</style>

<style lang='scss'>

// TODO: Эти стили изменяют вообще все инпуты в приложении, надо выносить под какой-то класс
//.v-menu__content { display:none !important; }

//.v-input__slot {
//  min-height: 60px !important;
//}
.v-ripple__container {
  display:none !important;
}

.styleSearch {
  &.primary--text {
    color: #95D7AE !important;
  }

  font-size: 1.8em !important;
  border-radius: 5px;
  //min-width: 1144px;

  .v-input__slot {
    height: 60px;
  }

  .v-select__selections {
    height: 60px;
  }

  .v-input__append-inner {
    .v-input__icon--append {
      margin-top: 8px;
    }

    //height: 60px;
    //display: flex;
    //align-items: center;
    //padding: 0;
    //margin: 0;
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
