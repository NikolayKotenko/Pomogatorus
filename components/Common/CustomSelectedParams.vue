<template>
  <div class="filter-params-wrapper">
    <div class="filter-params-wrapper__title">
      Отображаемые параметры
    </div>

    <div v-if="isLoadingParams || !paramsData.length">
      <ShimmerParams class="filter-params-wrapper__items"/>
    </div>

    <div v-else class="filter-params-wrapper__items">
      <div v-for="(param, pIndex) in paramsData" :key="'params-' + pIndex" class="filter-params-wrapper__items__elem">
        <v-checkbox
          v-model="innerParams"
          :label="param.name"
          :value="param.value"
          class="c-checkbox"
          color="#FF6347"
          dense
          hide-details
        />
      </div>
    </div>

    <div class="filter-params-wrapper__actions">
      <ButtonStyled
        local-class="new-style-btn btn-save"
        local-text="Отобразить выбранное"
        min-height="40"
        min-width="240"
        unset-width
        @click-button="acceptParams"
      />
    </div>
  </div>
</template>

<script>
import ShimmerParams from '../Shimmers/ShimmerParams'
import ButtonStyled from './ButtonStyled'

export default {
  name: 'CustomSelectedParams',
  components: { ShimmerParams, ButtonStyled },
  props: {
    paramsData: {
      type: Array,
      required: true
    },
    isLoadingParams: {
      type: Boolean,
      default: true
    },
    selectedParams: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    innerParams: {
      get() {
        return this.selectedParams
      },
      set(value) {
        // TODO: Передать правильно параметр
        console.log(value)
      }
    }
  },
  methods: {
    acceptParams() {

    }
  }
}
</script>
