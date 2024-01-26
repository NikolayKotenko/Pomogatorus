<template>
  <VCombobox
    v-model="currentData"
    :chips="isChips"
    :class="isClass"
    :clearable="(localSearchInputSync || localSelected) ? isClearable : false"
    :dense="isDense"
    :disabled="isLoading"
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
    color="#95D7AE"
    @change="$emit('change-search', localSelected)"
    @click:clear="$emit('click-clear')"
    @update:search-input="$emit('update-search-input', localSearchInputSync)"
  >
    <!--      <template v-slot:append> -->
    <!--        <v-icon class="selectIcon">mdi-select</v-icon> -->
    <!--      </template> -->
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
      </v-list-item-content >
      
    </template>
    <!-- <template v-if="isCustomTemplateSelections" #item="data">
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
    </template> -->
    <!-- <template v-if="isCustomSearchSelections" #item="data">
      <div
        class="search_user_invite"
        @click="stopInput($event)"
      >
        <CardInviteUser
          :user-object="data.item"
        />
      </div>
    </template> -->
  </VCombobox>
</template>

<script>
import CardInviteUser from "./CardInviteUser.vue";
import HashTagStyled from "~/components/Common/HashTagStyled";

export default {
  name: "SearchStyled",
  components: { CardInviteUser, HashTagStyled },
  props: {
    isClass: {
      type: String,
      default: ""
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
      default: ""
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
      default: ""
    },
    isItemValue: {
      type: String,
      default: ""
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
    isGlobalSearch: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    localSearchInputSync: "",
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

      this.$emit("update-search-input", newVal);
    }
  },
  methods: {
    watchDataRedirect(data) {
      console.log('123', data)
      this.$emit("redirect", data);
    },
    getTitleString(text) {
      const { start, middle, end } = this.getMaskedCharacters(text);
      return `${start}${this.genHighlight(middle)}${end}`;
    },

    // Вспомогательные функции
    getMaskedCharacters(text) {
      const searchInput = (this.localSearchInputSync || "").toString().toLocaleLowerCase();
      const index = text.toLocaleLowerCase().indexOf(searchInput);

      if (index < 0) return { start: text, middle: "", end: "" };

      const start = text.slice(0, index);
      const middle = text.slice(index, index + searchInput.length);
      const end = text.slice(index + searchInput.length);
      return { start, middle, end };
    },
    genHighlight(text) {
      return `<span class="v-list-item__mask">${text}</span>`;
    },
    stopInput(e) {
      console.log("1", e);
      e.stopPropagation();
      e.preventDefault();
      console.log("2", e);
    }
  }
};
</script>

<style lang="scss" scoped>
.v-text-field--rounded {
  border-radius: 5px !important;
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

// TODO: Эти стили изменяют вообще все инпуты в приложении, надо выносить под какой-то класс
//.v-menu__content { display:none !important; }

//.v-input__slot {
//  min-height: 60px !important;
//}
.v-ripple__container {
  display: none !important;
}

.styleSearch {

  &.primary--text {
    color: #95D7AE !important;
  }

  font-size: 1.8em !important;
  border-radius: 5px;
  //min-width: 1144px;

  .v-input__slot {
    height: 40px;
  }

  .v-select__selections {
    height: 40px;
  }

  .v-input__append-inner {
    .v-input__icon--append {
      //margin-top: 8px;
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
      color: black;
    }

    input::placeholder {
      color: #878787;
      font-size: 0.8em;

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
    align-content: center;
    color: #F79256 !important;
  }
}
</style>
