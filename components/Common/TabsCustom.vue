<template>
  <div class='object-tabs'>
    <v-tabs
      v-model='current'
      :show-arrows='false'
      :slider-size='4'
      grow
    >
      <v-tabs-slider :color='customColor'></v-tabs-slider>

      <v-tab
        v-for='(item, index) in tabs'
        :key='index'
        @change='changeTab(item.code)'
      >
        {{ item.name }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model='current'>
      <v-tab-item
        v-for='(item, indexTab) in tabs'
        :key='indexTab'
      >
        <v-card flat>
          <div class='tab-items-wrapper'>
            <template v-if='isLoadingData || !dataObject || !Object.keys(dataObject).length'>
              <v-progress-circular
                :size='50'
                color='primary'
                indeterminate
                style='margin: 20px auto 40px auto'
              ></v-progress-circular>
            </template>

            <template v-else>
              <div v-for='(tabItem, index) in tabData' :key='index'
                   :class='{"active-tab-item": tabItem.active || isNotEmpty(tabItem.code)}'
                   class='tab-content'>
                <div class='tab-content__count'>
                  <span v-if='item.code !== "all"'>{{ calcCount(indexTab, index) }}</span>
                  <span v-else>{{ calcCountNormal(index) }}</span>
                </div>
                <CustomField
                  :data='getObjectProperty(tabItem.code)'
                  :deleted-file='deletedFile'
                  :id-object='dataObject.id'
                  :id-property='tabItem.id'
                  :items='getItems(tabItem)'
                  :label='tabItem.name'
                  :type='getInputType(tabItem)'
                  @update-field='changeAnswer($event, tabItem.code)'
                  @uploaded-file='changeFileData($event, tabItem.code)'
                  @remove-file='removeFile($event, tabItem.code)'
                  @focus-in='focusIn(tabItem)'
                  @focus-out='focusOut(tabItem)'
                />
              </div>
            </template>
          </div>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import InputStyled from './InputStyled'
import CustomField from './CustomField'

import { mapActions, mapState } from 'vuex'

export default {
  name: 'TabsCustom',
  components: { CustomField, InputStyled },
  props: {
    dataObject: {
      type: Object,
      required: true
    },
    deletedFile: {
      type: [Number, String],
      default: 0
    }
  },
  data: () => ({
    current: 0,
    customColor: '#95D7AE'
  }),
  mounted() {
    this.getTabData()
  },
  computed: {
    ...mapState('Tabs', ['tabs', 'isLoading', 'tabData', 'isLoadingData'])
  },
  methods: {
    ...mapActions('Tabs', ['getTabs', 'getTabInfo', 'getInputTypes']),

    async getTabData() {
      await this.getTabs()
      await this.getInputTypes()
      if (this.tabs && this.tabs.length) {
        await this.changeTab('all')
      }
    },
    changeTab(code) {
      this.getTabInfo(code)
      this.$emit('change-tab')
    },
    isNotEmpty(key) {
      return this.dataObject[key] ? Array.isArray(this.dataObject[key]) ? !!this.dataObject[key].length : this.dataObject[key] : null
    },
    getObjectProperty(key) {
      return this.dataObject[key] ? this.dataObject[key] : null
    },
    getInputType(input) {
      return input?.d_property_objects?.code ? input.d_property_objects.code : 'stroka'
    },
    getItems(input) {
      return input?.d_dictionaries?.d_dictionary_attributes && input?.d_dictionaries?.d_dictionary_attributes.length ? input?.d_dictionaries?.d_dictionary_attributes : []
    },

    changeAnswer(value, code) {
      this.$emit('update-prop', { key: code, value })
    },
    changeFileData(value, code) {
      this.$emit('update-file', { key: code, value })
    },
    removeFile(value, code) {
      this.$emit('remove-file', { key: code, value })
    },
    calcCount(indexTab, indexItem) {
      return `${indexTab}.${indexItem + 1}`
    },
    calcCountNormal(index) {
      return index + 1
    },
    focusIn(item) {
      item.active = true
    },
    focusOut(item) {
      item.active = false
    }
  }
}
</script>
