<template>
  <v-autocomplete
    ref="autocomplete"
    v-model="currentData"
    :auto-select-first="true"
    :autofocus="isAutofocus"
    :class='{"selector-custom": currentData && customStyle}'
    :disabled="isDisabled"
    :item-text="itemText"
    :item-value="itemValue"
    :items="items"
    :loading="isLoading"
    :menu-props="{
            closeOnContentClick: true,
            bottom: true,
            offsetY: true,
            maxWidth: 250
          }"
    :multiple="false"
    :placeholder="computedPlaceholder"
    :search-input.sync="blockSearch"
    :solo="isSolo"
    dense
    hide-details
    return-object
    single-line
    @focus="isFocused = true"
    @focusout="focusOut"
    @keyup.delete="handleDelete()"
    @input.native.stop.prevent="stopInput($event)"
  >
    <template v-slot:selection="data">
      <template v-if="currentData">
        <span
          :class='{"scrolling-item": data.item[itemText] && data.item[itemText].length > 24}'
          class="selected-item"
          v-bind="data.attrs"
          @click="data.select; focusOn()"
        >
           {{ (visibleSelectedItem) ? data.item.name : "" }}
        </span>
      </template>
      <template v-else>
        <span>
          {{ computedPlaceholder }}
        </span>
      </template>
    </template>
    <template v-slot:append>
      <template v-if="!isFocused">
        <v-icon>mdi-chevron-down</v-icon>
      </template>
      <template v-else>
        <v-icon>mdi-minus</v-icon>
      </template>
    </template>
    <template v-slot:item="{ item }">
      <span class="wrapper_selected_items" @click="setVisibleSelectedItem(true)"
            v-html="getLintWords(item.name)"></span>
    </template>
    <template v-slot:no-data>
      <v-card class="wrapper_add_new_object" elevation="8">
        <v-card-actions>
          <v-btn :href="'/objects/'" block class="btn_add_new_object" plain small text>
            <v-icon>mdi-plus-circle-outline</v-icon>
            <span>Создать новый объект</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-autocomplete>
</template>

<script>
import { mapGetters } from "vuex";
import _clone from "../../helpers/deepClone";

export default {
  name: "SelectObjectStyled",
  props: {
    localClass: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "Выберите объект"
    },
    isSolo: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {
      }
    },
    itemText: {
      type: String,
      default: ""
    },
    itemValue: {
      type: String,
      default: ""
    },
    items: {
      type: Array,
      default: () => []
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isAutofocus: {
      type: Boolean,
      default: false
    },
    customStyle: {
      type: Boolean,
      default: false
    },
    haveTrigger: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    internalData: "",
    isFocused: false,
    visibleSelectedItem: true,
    blockSearch: "",
    defaultObject: {}
  }),
  watch: {
    "open_close_cabinet": {
      handler(v) {
        if (v && this.haveTrigger) {
          if (this.$refs.autocomplete) {
            this.defaultObject = _clone(this.$store.state.Objects.currentObject);
            this.$refs.autocomplete.focus();
            this.$refs.autocomplete.activateMenu();
            this.$refs.autocomplete.isMenuActive = true;
          } else {
            // TODO: мы не можем через наш селектор создать новый объект -> Необходимо продумать логику и отрисовать макет
            // this.$refs.createNewObj.focus()
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(["open_close_cabinet"]),

    computedPlaceholder() {
      if (this.isFocused) {
        return "";
      }
      return this.placeholder;
    },
    currentData: {
      get() {
        return this.data;
      },
      set(value) {
        this.$emit("update-input", value);
      }
    }
  },
  methods: {
    stopInput(e) {
      this.$nextTick(() => {
        if (this.currentData) {
          e.stopPropagation();
          e.preventDefault();
          // this.blockSearch = '';
          this.setVisibleSelectedItem(false);
        }
      });
    },
    focusOn() {
      this.$refs.autocomplete.isMenuActive = true;
    },
    focusOut() {
      this.isFocused = false;

      if (this.haveTrigger) {
        this.resetValues();
      }
    },
    handleDelete() {
      this.currentData = null;
    },
    resetValues() {
      // setTimeout(() => {
      //   if (_deepEqual(this.defaultObject, this.$store.state.Objects.currentObject)) {
      //     this.$store.commit("change_showCabinet", false);
      //   }
      // }, 400);
    },
    setVisibleSelectedItem(value) {
      this.visibleSelectedItem = value;

      if (value) {
        this.blockSearch = "";
      }
    },
    getLintWords(string) {
      if (!string) return string;
      if (!this.blockSearch) return string;

      const haystackString = string.toLowerCase();
      const needleString = this.blockSearch.toLowerCase();
      const resMatch = haystackString.match(needleString);
      if (!resMatch) return string;

      return this.highlightSearchTerm(haystackString, needleString);
    },
    highlightSearchTerm(string, substring) {
      const regex = new RegExp(`(${substring})`, "ig");
      return string.replace(regex, "<b>$1</b>");
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/global.scss';

.v-menu__content {
  &:hover {
    @extend .border-hover;
  }
}

.selector-custom {
  .v-select__selections {
    overflow: hidden;

    input {
      position: absolute !important;
      pointer-events: none !important;
      opacity: 1;
    }
  }
}

@keyframes my-animation {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-100%);
  }
}

.scrolling-item {
  animation: my-animation 10s linear infinite;
}

.selected-item {
  white-space: nowrap;
  cursor: pointer;
}
</style>
<style lang="scss" scoped>

.wrapper_selected_items {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  padding: 10px 16px 10px 16px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
  max-height: 40px;
}

.v-list {
  padding-bottom: unset;
}

.wrapper_add_new_object {
  margin-top: 5px;
  //position: absolute;
  //z-index: 9;
}

.btn_add_new_object {
  text-transform: unset;

  i {
    margin-right: 2px;
  }

  span {
    font-family: unset;
    font-size: 14px;
    text-decoration: underline;
  }
}

</style>
