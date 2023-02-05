<template>
  <div class="object-selector">
    <div class="object-selector__title">
      <span>Объект:</span>
    </div>

    <v-select
      v-model="currentData"
      :items='items'
      :item-text='item_text'
      :item-value='item_value'
      :autofocus='true'
      :disabled='isDisabled'
      :loading='isLoading'
      :placeholder='computedPlaceholder'
      solo
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
      <template v-slot:selection="data">
      <span v-bind="data.attrs">
        {{ data.item.name }}
      </span>
      </template>
      <template v-slot:item="data">
        <v-list-item-content>
          <v-list-item-title v-html="data.item.name"></v-list-item-title>
          <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </v-select>
  </div>
</template>

<script>
export default {
  name: "SelectObject",
  props: {
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
  },
  data: () => ({
    placeholder: '',
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

<style lang="scss" scoped>

</style>
