<template>
  <v-select
    v-model="currentData"
    :items='items'
    :item-text='item_text'
    :item-value='item_value'
    :autofocus='isAutofocus'
    :disabled='isDisabled'
    :loading='isLoading'
    :placeholder='computedPlaceholder'
    :solo='isSolo'
    dense
    hide-details
    @focus='isFocused = true'
    @focusout='isFocused = false'
    :menu-props='{
            closeOnContentClick: true,
            bottom: true,
            offsetY: true,
          }'
    return-object
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
      default: () => {}
    },
    item_text: {
      type: String,
      default: ''
    },
    item_value: {
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
