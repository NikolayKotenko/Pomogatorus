<template>
  <v-text-field
    v-model='currentData'
    :autofocus='isAutofocus'
    :disabled='isDisabled'
    :loading='isLoading'
    :placeholder='computedPlaceholder'
    :solo='isSolo'
    dense
    hide-details
    @focus='isFocused = true'
    @focusout='isFocused = false'
  >
  </v-text-field>
</template>

<script>
export default {
  name: 'InputStyled',
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
