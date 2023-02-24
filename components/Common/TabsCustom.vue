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
            <template v-if='isLoadingData'>
              <v-progress-circular
                :size='50'
                color='primary'
                indeterminate
                style='margin: 20px auto 40px auto'
              ></v-progress-circular>
            </template>

            <template v-else>
              <div v-for='(tabItem, index) in tabData' :key='index'
                   :class='{"active-tab-item": tabItem.active || getObjectProperty(tabItem.code)}'
                   class='tab-content'>
                <div class='tab-content__count'>
                  <span>{{ calcCount(indexTab, index) }}</span>
                </div>
                <div class='tab-content__input'>
                  <CustomField
                    :data='getObjectProperty(tabItem.code)'
                    :label='tabItem.name'
                    :type='getInputType(tabItem)'
                    @update-input='changeAnswer'
                    @uploaded-file='changeFileData'
                    @focus-in='focusIn(indexTab, index)'
                    @focus-out='focusOut(indexTab, index)'
                  />
                </div>
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
    }
  },
  data: () => ({
    current: 0,
    customColor: '#95D7AE',
    answer: ''
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
        await this.changeTab(this.tabs[0].code)
      }
    },
    changeTab(code) {
      this.getTabInfo(code)
    },
    getObjectProperty(key) {
      return this.dataObject[key] ? this.dataObject[key] : null
    },
    getInputType(input) {
      return input?.d_property_objects?.code ? input.d_property_objects.code : 'stroka'
    },

    changeAnswer(value) {
      this.answer = value
    },
    changeFileData(data) {

    },
    calcCount(indexTab, indexItem) {
      return `${indexTab + 1}.${indexItem + 1}`
    },
    focusIn(indexTab, indexItem) {
      this.testTabItem[indexTab][indexItem].active = true
    },
    focusOut(indexTab, indexItem) {
      this.testTabItem[indexTab][indexItem].active = false
    }
  }
}
</script>

<style lang='scss'>

.object-tabs {
  .v-tab {
    border-bottom: 4px solid #D9D9D9;
  }
}

.tab-items-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
  margin-top: 1.2rem;
}

.tab-content {
  display: flex;
  padding: 0 10px 10px 20px;
  background: #B3B3B3;
  box-shadow: 0 2px 4px rgb(0 0 0 / 25%);
  border-radius: 5px;
  align-items: center;
  column-gap: 20px;
  transition: background-color 0.4s ease-in-out;

  &__count {
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    color: #FFFFFF;
  }

  &__input {
    flex: 1;
    width: 100%;
  }
}

.active-tab-item {
  background: #95D7AE;
}
</style>
