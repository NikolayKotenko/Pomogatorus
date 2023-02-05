<template>
  <div>
    <v-tabs
      v-model="current"
      align-with-title
    >
      <v-tabs-slider :color="customColor"></v-tabs-slider>

      <v-tab
        v-for="item in tabs"
        :key="item"
      >
        {{ item.name }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="current">
      <v-tab-item
        v-for="item in innerTabContent"
        :key="item"
      >
        <v-card flat>
          <div class="tab-content">
            <div class="tab-content__count">
              <span>{{ item.countAnswer }}</span>
            </div>

            <div class="tab-content__input">
              <InputStyled
                :data='item.answer'
                :placeholder='item.placeholder'
                is-solo
                @update-input='changeAnswer'
              />
            </div>
          </div>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import InputStyled from "./InputStyled";
export default {
  name: "TabsCustom",
  components: {InputStyled},
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
    answer: ''
  }),
  mounted() {
    this.innerTabContent = this.tabContent
  },
  methods: {
    changeAnswer(value) {
      this.answer = value
    },
  }
}
</script>

<style scoped>

</style>
