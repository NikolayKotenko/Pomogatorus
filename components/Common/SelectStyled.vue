<template>
  <v-select
    v-model='currentData'
    :autofocus='isAutofocus'
    :disabled='isDisabled'
    :item-text='itemText'
    :item-value='itemValue'
    :items='items'
    :loading='isLoading'
    :menu-props='{
            closeOnContentClick: true,
            bottom: true,
            offsetY: true,
          }'
    :placeholder='computedPlaceholder'
    :solo='isSolo'
    dense
    hide-details
    return-object
    @focus='isFocused = true'
    @focusout='isFocused = false'
  >
  </v-select>
</template>

<script>
export default {
  name: 'SelectStyled',
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
      type: Object,
      default: () => {
      }
    },
    itemText: {
      type: String,
      default: ''
    },
    itemValue: {
      type: String,
      default: ''
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
