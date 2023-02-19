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
        v-for='(item, index) in testTab'
        :key='index'
      >
        {{ item.name }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model='current'>
      <v-tab-item
        v-for='(item, indexTab) in testTab'
        :key='indexTab'
      >
        <v-card flat>
          <div class='tab-items-wrapper'>
            <div v-for='(tabItem, index) in testTabItem[indexTab]' :key='index'
                 :class='{"active-tab-item": tabItem.active}'
                 class='tab-content'>
              <div class='tab-content__count'>
                <span>{{ calcCount(indexTab, index) }}</span>
              </div>
              <div class='tab-content__input'>
                <CustomField
                  :data='tabItem.answer'
                  :label='tabItem.placeholder'
                  type='input'
                  @update-input='changeAnswer'
                  @focus-in='focusIn(indexTab, index)'
                  @focus-out='focusOut(indexTab, index)'
                />
              </div>
            </div>
          </div>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import InputStyled from './InputStyled'
import CustomField from './CustomField'

export default {
  name: 'TabsCustom',
  components: { CustomField, InputStyled },
  props: {
    tabs: {
      type: Array,
      required: true
    },
    tabContent: {
      type: Array,
      required: true
    },
    dataObject: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    current: 0,
    customColor: '#95D7AE',
    innerTabContent: [],
    answer: '',
    activeItems: [],

    testTab: [
      {
        name: 'Test 1'
      },
      {
        name: 'Test 2'
      },
      {
        name: 'Test 3'
      },
      {
        name: 'Test 4'
      },
      {
        name: 'Test 5'
      },
      {
        name: 'Test 6'
      },
      {
        name: 'Test 7'
      },
      {
        name: 'Test 8'
      }
    ],
    testTabItem: [
      [
        {
          countAnswer: 1,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 2,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 3,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 4,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 5,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 6,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 7,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 8,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        }
      ],
      [
        {
          countAnswer: 1,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 2,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 3,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 4,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 5,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 6,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 7,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        },
        {
          countAnswer: 8,
          answer: '',
          placeholder: 'Введите значение',
          active: false
        }
      ]
    ],
    test: ''
  }),
  mounted() {
    this.innerTabContent = this.tabContent
  },
  methods: {
    changeAnswer(value) {
      this.answer = value
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
