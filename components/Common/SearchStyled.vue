<template>
  <VCombobox
    v-model="currentData"
    :chips="isChips"
    :class="isCustomClass"
    :clearable="(localSearchInputSync || localSelected) ? isClearable : false"
    :dense="isDense"
    :disabled="isDisabled"
    :filled="isFilled"
    :hide-details="isHideDetails"
    :hide-no-data="isHideNoData"
    :hide-selected="isHideSelected"
    :item-text="isItemText"
    :item-value="isItemValue"
    :items="isItems"
    :loading="isLoading"
    :menu-props="(computedSearchInputState && compareSearchStringAndExistEntry) ? {} : {value: false}"
    :outlined="isOutlined"
    :placeholder="isPlaceholder"
    :return-object="isReturnObject"
    :rounded="isRounded"
    :search-input.sync="localSearchInputSync"
    background-color="#ffffff"
    color="black"
    @change="$emit('change-search', localSelected)"
    @click:clear="$emit('click-clear')"
    @update:search-input="$emit('update-search-input', localSearchInputSync)"
  >
    <template v-if="isIconPrepend" #prepend-inner>
      <v-progress-circular
        v-if="isLoading"
        class="mr-1"
        color="#95D7AE"
        indeterminate
        size="25"
      />
      <v-icon v-else class="selectIcon">
        {{ iconPrepend }}
      </v-icon>
    </template>
    <template
      v-if="isGlobalSearch"
      #item="data"
    >
      <v-list-item-content
        class="search_item"
        @click="watchDataRedirect(data.item)"
      >
        <span
          v-html="getTitleString(data.item.text)"
        />
        <span
          style="font-size: 0.8em; color: #B6B6B6;"
        >
          - {{ data.item.category }}
        </span>
      </v-list-item-content>
    </template>
    <template
      v-if="isCustomTemplateSelections"
      #item="data"
    >
      <v-list-item-content class="search_item">
        <span v-html="getTitleString(data.item.city)"/>
        <br>
        <span style="font-size: 0.8em; color: #B6B6B6;">{{ data.item.address }}</span>
      </v-list-item-content>
    </template>

    <!--
 <template v-if="isCustomTemplateSelections" #item="data">
      <v-list-item-content @click="watchDataRedirect(data.item)">
        <span>Cтатьи</span>
        <v-list-item-title v-if="data.category === 'Cтатьи'">
          <span v-html="getTitleString(data.item.text)"/>
        </v-list-item-title>
        <span>Подборки</span>
        <v-list-item-title v-if="data.item.category === 'Тэги'">
          <span v-html="getTitleString(data.item.text)"/>
        </v-list-item-title>
        <span>Оборудование</span>
        <v-list-item-title v-if="data.item.category === 'Оборудование'">
          <span v-html="getTitleString(data.item.text)"/>
        </v-list-item-title>

        <v-list-item-title v-else>
          <span v-html="getTitleString(data.item.text)"/>
        </v-list-item-title>
      </v-list-item-content>
    </template>
-->
    <!--
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
-->
  </VCombobox>
</template>

<script>
import CardInviteUser from './CardInviteUser.vue';
import HashTagStyled from '~/components/Common/HashTagStyled';

export default {
  name: 'SearchStyled',
  components: { CardInviteUser, HashTagStyled },
  props: {
    isCustomClass: {
      type: Boolean,
      default: false
    },
    isOutlined: {
      type: Boolean,
      default: true
    },
    fullWidth: {
      type: String,
      default: ''
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
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isGlobalSearch: {
      type: Boolean,
      default: false
    },
    isIconPrepend: {
      type: Boolean,
      default: false
    },
    iconPrepend: {
      type: String,
      default: ''
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
          return this.internalData;
        }
        return this.localSelected;
      },
      set(value) {
        this.localSelected = value;
      }
    },
    computedSearchInputState() {
      if (!this.localSearchInputSync) return false;

      return (this.localSearchInputSync.length > 2);
    },
    compareSearchStringAndExistEntry() {
      if (!this.localSelected) return true;

      return this.localSelected[this.isItemText] !== this.localSearchInputSync;
    }
  },
  watch: {
    internalData: function(newVal, oldVal) {
      if (!newVal) return false;

      this.$emit('update-search-input', newVal);
    }
  },
  methods: {
    watchDataRedirect(data) {
      this.$emit('redirect', data);
    },
    getTitleString(text) {
      const { start, middle, end } = this.getMaskedCharacters(text);
      return `${start}${this.genHighlight(middle)}${end}`;
    },

    // Вспомогательные функции
    getMaskedCharacters(text) {
      const searchInput = (this.localSearchInputSync || '').toString().toLocaleLowerCase();
      const index = text.toLocaleLowerCase().indexOf(searchInput);

      if (index < 0) return { start: text, middle: '', end: '' };

      const start = text.slice(0, index);
      const middle = text.slice(index, index + searchInput.length);
      const end = text.slice(index + searchInput.length);
      return { start, middle, end };
    },
    genHighlight(text) {
      return `<span class="v-list-item__mask">${text}</span>`;
    },
    stopInput(e) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
};
</script>

<style lang="scss" scoped>
.v-text-field--rounded {
  border-radius: 25px !important;
}

.search_item {
  display: inline;
}

.search_user_invite {
  width: 100%;
  max-width: 850px;
  cursor: default;
}
</style>

<style lang="scss">
@import 'assets/styles/style';

// TODO: Эти стили изменяют вообще все инпуты в приложении, надо выносить под какой-то класс
//.v-menu__content { display:none !important; }

//.v-input__slot {
//  min-height: 60px !important;
//}
.v-ripple__container {
  display: none !important;
}



.selectIcon {
  margin-right: 5px;
}
</style>
