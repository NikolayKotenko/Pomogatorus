<template>
  <v-text-field
    v-if="isNumber"
    v-model.number="currentData"
    :append-icon="appendIcon"
    :autofocus="isAutofocus"
    :disabled="isDisabled"
    :error-messages="isErrorMessages"
    :filled="isFilled"
    :flat="isFlat"
    :hide-details="isHideDetails"
    :label="isLabel"
    :loading="isLoading"
    :outlined="isOutlined"
    :placeholder="computedPlaceholder"
    :prepend-inner-icon="prependIconInner"
    :readonly="isReadonly"
    :rounded="isRounded"
    :rules="isRules"
    :solo="isSolo"
    class="styleTextField"
    dense
    type="number"
    @change="onChange"
    @click="onClick"
    @focus="isFocused = true"
    @focusout="isFocused = false"
  ></v-text-field>

  <v-text-field
    v-else
    v-model="currentData"
    :append-icon="appendIcon"
    :autofocus="isAutofocus"
    :disabled="isDisabled"
    :error-messages="isErrorMessages"
    :filled="isFilled"
    :flat="isFlat"
    :hide-details="isHideDetails"
    :label="isLabel"
    :loading="isLoading"
    :outlined="isOutlined"
    :placeholder="computedPlaceholder"
    :prepend-inner-icon="prependIconInner"
    :readonly="isReadonly"
    :rounded="isRounded"
    :rules="isRules"
    :solo="isSolo"
    class="styleTextField"
    dense
    @change="onChange"
    @click="onClick"
    @focus="isFocused = true"
    @focusout="isFocused = false"
  />
</template>

<script>
export default {
  name: "InputStyled",
  props: {
    fullSincProp: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ""
    },
    isLabel: {
      type: String,
      default: ""
    },
    isSolo: {
      type: Boolean,
      default: false
    },
    isRounded: {
      type: Boolean,
      default: false
    },
    data: {
      type: String,
      default: ""
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isOutlined: {
      type: Boolean,
      default: false
    },
    isAutofocus: {
      type: Boolean,
      default: false
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    appendIcon: {
      type: String,
      default: ""
    },
    prependIconInner: {
      type: String,
      default: ""
    },
    isFlat: {
      type: Boolean,
      default: false
    },
    isFilled: {
      type: Boolean,
      default: false
    },
    isRules: {
      type: Array,
      default: () => []
    },
    isHideDetails: {
      type: Boolean,
      default: true
    },
    isErrorMessages: {
      type: String,
      default: ""
    },
    isNumber: {
      type: Boolean,
      default: false
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
        if (!this.fullSincProp) {
          if (this.data) {
            return this.data;
          }
          return this.internalData;
        }

        return this.data;
      },
      set(value) {
        if (!this.data) {
          this.internalData = value;
        }
        this.$emit("update-input", value);
      }
    }
  },
  methods: {
    onClick() {
      this.$emit("on-click");
    },
    onChange(value) {
      this.$emit("on-change", value);
    }
  }
};
</script>

<style lang="scss" scoped>

.v-text-field--rounded {
  border-radius: 10px !important;
}

.styleTextField {
  border-radius: 5px;
  margin-bottom: 1em !important;

  &.primary--text {
    color: #95D7AE !important;
  }
}

.styleQuantityField {
  max-width: 70px;
}
</style>
