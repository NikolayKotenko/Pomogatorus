<template>
  <v-text-field
    v-model='currentData'
    :append-icon='appendIcon'
    :autofocus='isAutofocus'
    :disabled='isDisabled'
    :flat='isFlat'
    :loading='isLoading'
    :placeholder='computedPlaceholder'
    :prepend-inner-icon='prependIconInner'
    :readonly='isReadonly'
    :solo='isSolo'
    dense
    hide-details
    @click='onClick'
    @focus='isFocused = true'
    @focusout='isFocused = false'
  >
  </v-text-field>
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
        if (!this.fullSincProp) {
          if (this.data) {
            return this.data
          }
          return this.internalData
        }

        return this.data
      },
      set(value) {
        if (!this.data) {
          this.internalData = value
        }
        this.$emit('update-input', value)
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('on-click')
    }
  }
}
</script>

<style scoped>

</style>
