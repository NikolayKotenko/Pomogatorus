<template>
  <v-select
    v-model="currentData"
    :append-icon="isAppendIcon"
    :autofocus="isAutofocus"
    :background-color="isBackgroundColor"
    :chips="isChips"
    :disabled="isDisabled"
    :item-text="itemText"
    :item-value="itemValue"
    :items="items"
    :loading="isLoading"
    :menu-props="{
      closeOnContentClick: true,
      bottom: true,
      offsetY: true,
    }"
    :multiple="isMultiple"
    :placeholder="computedPlaceholder"
    :solo="isSolo"
    color="#000000"
    dense
    hide-details
    item-color="#000000"
    return-object
    @focus="isFocused = true"
    @focusout="isFocused = false"
  />
</template>

<script>
export default {
  name: "SelectStyled",
  props: {
    placeholder: {
      type: String,
      default: ""
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
    isBackgroundColor: {
      type: String,
      default: "#FFFFFF"
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    isChips: {
      type: Boolean,
      default: false
    },
    isAppendIcon: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    internalData: "",
    isFocused: false
  }),
  computed: {
    computedPlaceholder() {
      if (this.isFocused) {
        return "";
      }
      return this.placeholder;
    },
    currentData: {
      get() {
        if (this.data) {
          return this.data;
        }
        return this.internalData;
      },
      set(value) {
        if (!this.data) {
          this.internalData = value;
        }
        this.$emit("update-input", value);
      }
    }
  }
};
</script>

<style scoped>

</style>
