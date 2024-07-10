<template>
  <v-card class="map_service_area" elevation="0">
    <SearchStyled
      :icon-prepend="'mdi-magnify'"
      :is-clearable="true"
      :is-custom-template-selections="true"
      :is-icon-prepend="true"
      :is-item-text="'address'"
      :is-item-value="'id'"
      :is-items="$store.state.UserSettings.listCities"
      :is-loading="$store.state.UserSettings.loading"
      :is-outlined="false"
      :is-placeholder="'Регион, город, населенный пункт'"
      class="invite_input"
      @update-search-input="localGetListCities"
      @change-search="$store.dispatch('UserSettings/setSelectedCity', $event)"
    />

    <ChipsStyled
      :data="$store.getters['UserSettings/getIdsSelectedCities']"
      :is-multiple="true"
      :is-outlined="true"
      :list-chips="$store.state.UserSettings.selectedCity"
      :text-field="'city'"
      :value-field="'id'"
      class="chips_list mt-2"
      @click-chip="$store.dispatch('UserSettings/localSetChips', $event)"
    />

    <span style="font-size: 0.87em;">
      Расширение радиуса поиска, км
    </span>
    <v-slider
      v-model="$store.state.UserSettings.selectedRange"
      :disabled="!$store.getters['UserSettings/getStateSelectedCities']"
      :max="5"
      :tick-labels="$store.state.UserSettings.rangeArea"
      color="#ED7100"
      thumb-color="#ED7100"
      track-color="#ED7100"
      track-fill-color="#ED7100"
    />
  </v-card>
</template>

<script>
import ChipsStyled from '~/components/Common/ChipsStyled';
import SearchStyled from '~/components/Common/SearchStyled';

export default {
  name: 'MapServiceArea',
  components: { SearchStyled, ChipsStyled },
  data: () => ({}),
  computed: {},
  mounted() {

    const existedEntry = this.$store.state.AuthModule.userData.range_area;
    const userSettingsRangeArea = this.$store.state.UserSettings.rangeArea;
    if (existedEntry) {
      const indexRangeArea = userSettingsRangeArea.findIndex((elem) => elem === existedEntry);
      this.$store.state.UserSettings.selectedRange = indexRangeArea;
    }

    const existedCities = this.$store.state.AuthModule.userData.cities;
    if (existedCities) {
      this.$store.state.UserSettings.selectedCity = existedCities;
    }
  },
  methods: {
    async localGetListCities(string) {
      await this.$store.dispatch('UserSettings/getListCitiesBySearch', string);
    }
  }
};
</script>

<style lang="scss" scoped>
.map_service_area {
  width: 100%;
  padding: 20px;
  border-radius: 30px;

  .chips_list {
    font-size: 0.8em;
  }
}
</style>
