<template>
  <v-textarea
    v-model='currentData'
    :autofocus='isAutofocus'
    :disabled='isDisabled'
    :loading='isLoading'
    :placeholder='computedPlaceholder'
    :solo='isSolo'
    auto-grow
    clearable
    dense
    hide-details
    row-height='25'
    rows='3'
    @focus='isFocused = true'
    @focusout='isFocused = false'
  ></v-textarea>
</template>

<script>
export default {
  name: 'TextAreaStyled',
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    isSolo: {
      type: Boolean,
      default: false
    },
    data: {
      type: String,
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
    isAutofocus: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    internalData: '',
    isFocused: false
  }),
  computed: {
    computedPlaceholder() {
      if (this.isFocused) {
        return ''
      }
      return this.placeholder
    },
    currentData: {
      get() {
        if (this.data) {
          return this.data
        }
        return this.internalData
      },
      set(value) {
        if (!this.data) {
          this.internalData = value
        }
        this.$emit('update-input', value)
      }
    }
  }
}
</script>

<style scoped>

</style>
