<template>
  <v-text-field
    v-if="isNumber"
    ref="input"
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
    :single-line="isSingleLine"
    :solo="isSolo"
    class="styleTextField"
    dense
    type="number"
    @change="onChange"
    @click="onClick"
    @focus="isFocused = true"
    @focusout="isFocused = false"
  />

  <v-text-field
    v-else
    ref="input"
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
    :single-line="isSingleLine"
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
  name: 'InputStyled',
  props: {
    fullSincProp: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    isLabel: {
      type: String,
      default: ''
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
      type: [String, Number],
      default: ''
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
      default: ''
    },
    prependIconInner: {
      type: String,
      default: ''
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
      default: ''
    },
    isSingleLine: {
      type: Boolean,
      default: false
    },
    /* ONLY NUMBERS */
    isNumber: {
      type: Boolean,
      default: false
    },
    max: {
      type: [String, Number],
      default: ''
    },
    min: {
      type: [String, Number],
      default: ''
    }
  },
  data: () => ({
    internalData: '',
    isFocused: false,
    resetChange: false
  }),
  computed: {
    computedPlaceholder() {
      if (this.isFocused) {
        return ''
      }
      return this.placeholder
    },
    isNumberWithCondition() {
      return this.isNumber && this.fullSincProp && (this.max || this.min)
    },
    currentData: {
      get() {
        if (!this.fullSincProp) {
          if (this.data) {
            return this.data
          }
          return this.internalData
        }

        return this.data
      },
      set(value) {
        if (this.resetChange) {
          return
        }

        let calcValue = value

        // Если это инпут с цифрами и есть max и min
        if (this.isNumberWithCondition) {
          if (this.max !== '' && calcValue > this.max) {
            calcValue = parseInt(this.max)
          }

          if (this.min !== '' && calcValue < this.min) {
            calcValue = ''
          }

          this.$nextTick(() => {
            this.resetChange = true
            this.$refs.input.internalValue = calcValue

            setTimeout(() => {
              this.resetChange = false
            }, 100)
          })
        }

        if (!this.data) {
          this.internalData = calcValue
        }
        this.$emit('update-input', calcValue)
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('on-click')
    },
    onChange(value) {
      this.$emit('on-change', value)
    }
  }
}
</script>

<style lang='scss' scoped>
@import 'assets/styles/style';

.v-text-field--rounded {
  border-radius: 10px !important;
}

.styleTextField {
  border-radius: 5px;


  &.primary--text {
    color: #ED7100 !important;
  }
}

.styleQuantityField {
  max-width: 70px;
}
</style>
