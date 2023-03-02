<template>
  <v-autocomplete
    ref='autocomplete'
    v-model='currentData'
    :autofocus='isAutofocus'
    :class='{"selector-custom": currentData && customStyle}'
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
    :multiple='false'
    :no-filter='currentData && customStyle'
    :placeholder='computedPlaceholder'
    :search-input='blockSearch'
    :solo='isSolo'
    dense
    hide-details
    return-object
    single-line
    @focus='isFocused = true'
    @focusout='isFocused = false'
    @keyup.delete='handleDelete()'
    @input.native.stop.prevent='stopInput($event)'
  >
    <template v-slot:selection='data'>
      <template v-if='currentData'>
        <span
          :class='{"scrolling-item": data.item[itemText].length > 24}'
          class='selected-item'
          v-bind='data.attrs'
          @click='data.select; focusOn()'
        >
          {{ data.item[itemText] }}
        </span>
      </template>
      <template v-else>
        <span>
          {{ computedPlaceholder }}
        </span>
      </template>
    </template>
    <template v-slot:append>
      <template v-if='!isFocused'>
        <v-icon>mdi-chevron-down</v-icon>
      </template>
      <template v-else>
        <v-icon>mdi-minus</v-icon>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: 'SelectObjectStyled',
  props: {
    placeholder: {
      type: String,
      default: 'Выберите объект'
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
    },
    customStyle: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    internalData: '',
    isFocused: false,
    blockSearch: ''
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
        return this.data
      },
      set(value) {
        this.$emit('update-input', value)
      }
    }
  },
  methods: {
    stopInput(e) {
      this.$nextTick(() => {
        if (this.currentData) {
          e.stopPropagation()
          e.preventDefault()
          this.blockSearch = ''
        }
      })
    },
    focusOn() {
      this.$refs.autocomplete.isMenuActive = true
    },
    handleDelete() {
      this.currentData = null
    }
  }
}
</script>

<style lang='scss'>
.selector-custom {
  .v-select__selections {
    overflow: hidden;

    input {
      position: absolute !important;
      pointer-events: none !important;
      opacity: 0;
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