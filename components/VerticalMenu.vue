<template>
  <div class="menu_container">
    <div
      v-for="(item, index) in $store.getters.menuItems"
      :key="index"
    >
      <v-divider v-if="item.divider" style="border-color: black;"/>
      <div
        v-if="item.visible"
        :class="{'active_element': getActiveMenuElement(item.path)}"
        class="btn_wrapper"
      >
        <v-btn
          :href="item.path"
          class="btn"
          text
        >
          <v-icon
            class="icon"
            size="24"
          >
            {{ item.icon }}
          </v-icon>
          <span class="text">
            {{ item.title }}
          </span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerticalMenu',
  data() {
    return {
      show: true
    };
  },
  computed: {},
  methods: {
    getActiveMenuElement(elem) {
      return this.$route.path === elem;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.menu_container {
  height: auto;
  width: auto;
  position: fixed;
  z-index: 1;
  top: 8%;
  left: 1%;
  overflow-x: hidden;

  .btn_wrapper {
    cursor: pointer;
    margin-bottom: 5px;

    .btn {
      display: flex;
      justify-content: flex-start;
      min-width: 190px;
      min-height: 44px;
      border-radius: 10px;

      .icon {
        color: #000000;
        margin-right: 10px;
      }

      .text {
        font-size: 1.2em;
        text-transform: none !important;
        font-weight: 400;
        font-style: normal !important;
        letter-spacing: 0 !important;
      }
    }
  }

}

.menu_container {
  .active_element {
    background-color: #FFFFFF;
    border-radius: 10px;

    .btn .icon {
      color: $green-color !important;
    }
  }
}


@media only screen and (max-width: 1600px) {
  .menu_container {
    display: none;
  }
}

</style>
