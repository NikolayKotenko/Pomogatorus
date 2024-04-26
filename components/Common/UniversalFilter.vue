<template>
  <v-container class="filter_container">
    <!-- Параметры для отображения -->
    <DropDownMenuStyled
      :is-offset-y="true"
    >
      <template #icon>
        <IconTooltip
          :color-icon="'#b3b3b3'"
          :icon-text="'mdi-cog-outline'"
          :size-icon="'32'"
          :text-tooltip="'Параметры для отображения'"
        />
      </template>
      <template #content>
        <div class="options_wrapper">
          <div class="header_title">
            Параметры для отображения
          </div>
          <div class="option_container">
            <v-checkbox hide-details/>
            <div class="option_title">
              Артикул
            </div>
          </div>
          <div class="option_container">
            <v-checkbox hide-details/>
            <div class="option_title">
              Мощность кВт
            </div>
          </div>
          <div class="option_container">
            <v-checkbox hide-details/>
            <div class="option_title">
              Вид топлива
            </div>
          </div>
          <div class="option_container">
            <v-checkbox hide-details/>
            <div class="option_title">
              Камера сгорания
            </div>
          </div>
          <ButtonStyled
            :local-class="'style_button'"
            :local-text="'Отобразить выбранное'"
          />
        </div>
      </template>
    </DropDownMenuStyled>

    <div class="line"/>

    <!-- Фильтры -->
    <DropDownMenuStyled
      :is-offset-y="true"
      :is-left="true"
    >
      <template #icon>
        <IconTooltip
          :color-icon="'#b3b3b3'"
          :icon-text="'mdi-filter'"
          :size-icon="'32'"
          :text-tooltip="'Фильтры'"
        />
      </template>
      <template #content>
        <div class="options_wrapper">
          <div class="header_title">
            Фильтры
          </div>
          <div class="option_container">
            <v-checkbox hide-details/>
            <div class="option_title">
              Артикул
            </div>
          </div>
          <div class="option_container">
            <v-checkbox hide-details/>
            <div class="option_title">
              Мощность кВт
            </div>
          </div>
          <div class="option_container">
            <v-checkbox hide-details/>
            <div class="option_title">
              Вид топлива
            </div>
          </div>
          <div class="option_container">
            <v-checkbox hide-details/>
            <div class="option_title">
              Камера сгорания
            </div>
          </div>
          <ButtonStyled
            :local-class="'style_button'"
            :local-text="'Отфильтровать'"
          />
        </div>
      </template>
    </DropDownMenuStyled>
  </v-container>
</template>
<script>
import DropDownMenuStyled from './DropDownMenuStyled.vue'
import IconTooltip from './IconTooltip.vue'
import ButtonStyled from './ButtonStyled.vue'

export default {
  name: 'UniversalFilter',
  components: { ButtonStyled, IconTooltip, DropDownMenuStyled },
  props: {
    dataObject: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.filter_container {
  display: flex;
  width: 100%;
  align-items: center;
  grid-column-gap: 10px;
  .line {
    width: 100%;
    border-top: 2px solid $grey-text-color;
  }
}

.options_wrapper {
  display: grid;
  grid-row-gap: 20px;
  padding: 20px;
  width: 400px;
  background-color: $background-element-color;
  .header_title {
    font-size: 1.2em;
    font-weight: 700;
  }
  .option_container {
    display: flex;
    grid-column-gap: 10px;
    .option_title{

    }
  }

}
</style>
