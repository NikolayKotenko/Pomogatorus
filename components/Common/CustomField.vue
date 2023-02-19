<template>
  <div class='custom-fields'>
    <template v-if='type === "input"'>
      <v-text-field
        v-model='currentData'
        :append-icon='appendIcon'
        :autofocus='isAutofocus'
        :disabled='isDisabled'
        :flat='isFlat'
        :label='label'
        :loading='isLoading'
        :placeholder='placeholder'
        :prepend-inner-icon='prependIconInner'
        :readonly='isReadonly'
        :solo='isSolo'
        dense
        hide-details
        @click='onClick'
        @focus='focusStart'
        @focusout='focusEnd'
      />
    </template>

    <template v-if='type === "textarea"'>

    </template>

    <template v-if='type === "files"'>

    </template>
  </div>
</template>

<script>
export default {
  name: 'CustomField',
  props: {
    type: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
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
        this.$emit('update-field', value)
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('on-click')
    },
    focusStart() {
      this.isFocused = true
      this.$emit('focus-in')
    },
    focusEnd() {
      this.isFocused = false
      this.$emit('focus-out')
    }
  }
}
</script>

<style lang='scss'>
.custom-fields {
  .v-input {
    background: white;
    border-radius: 5px;
  }

  .v-input__slot {
    &::before {
      display: none !important;
    }

    &::after {
      display: none !important;
    }
  }

  .v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot {
    min-height: 56px;

    .v-label--active {
      transform: translateY(-35px) scale(1.2) !important;
      color: black !important;
    }

    label {
      top: 18px;
      background: white;
      padding: 4px 10px;
      font-family: 'Roboto', sans-serif;
      font-style: normal;
      font-weight: 400;
    }

    input {
      min-height: 56px !important;
      padding-left: 1rem;
    }
  }
}
</style>
