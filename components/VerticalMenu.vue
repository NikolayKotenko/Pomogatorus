<template>
  <div class="vertical_menu">
    <div class="vertical_menu__element">
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-btn
            :href="$store.getters.menuItems[1].path"
            text
            class="vertical_menu__element__btn"
          >
            <v-icon
              v-if="$store.getters.menuItems[1].visible"
              class="vertical_menu__element__icon"
              v-bind="attrs"
              large
              v-on="on"
            >
              {{ $store.getters.menuItems[1].icon }}
            </v-icon>
          </v-btn>
        </template>
        <span class="vertical_menu__element__title">{{ $store.getters.menuItems[1].title }}</span>
      </v-tooltip>
    </div>
    <div class="vertical_menu__element">
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-btn
            :href="$store.getters.menuItems[2].path"
            text
            class="vertical_menu__element__btn"
          >
            <v-icon
              v-if="$store.getters.menuItems[2].visible"
              class="vertical_menu__element__icon"
              v-bind="attrs"
              large
              v-on="on"
            >
              {{ $store.getters.menuItems[2].icon }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $store.getters.menuItems[2].title }}</span>
      </v-tooltip>
    </div>
    <div class="vertical_menu__element">
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-btn
            :href="$store.getters.menuItems[3].path"
            text
            class="vertical_menu__element__btn"
          >
            <v-icon
              v-if="$store.getters.menuItems[3].visible"
              class="vertical_menu__element__icon"
              v-bind="attrs"
              large
              v-on="on"
            >
              {{ $store.getters.menuItems[3].icon }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $store.getters.menuItems[3].title }}</span>
      </v-tooltip>
    </div>
    <div class="vertical_menu__element">
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-btn
            :href="$store.getters.menuItems[4].path"
            text
            class="vertical_menu__element__btn"
          >
            <v-icon
              v-if="$store.getters.menuItems[4].visible"
              class="vertical_menu__element__icon"
              v-bind="attrs"
              large
              v-on="on"
            >
              {{ $store.getters.menuItems[4].icon }}
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $store.getters.menuItems[4].title }}</span>
      </v-tooltip>
    </div>
    <v-divider class="vertical_menu__divider"/>
    <div class="vertical_menu__element">
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-icon
            class="vertical_menu__element__icon"
            v-bind="attrs"
            large
            v-on="on"
            @click="$store.state.listModal[0].isOpen = !$store.state.listModal[0].isOpen"
          >
            mdi-account
          </v-icon>
        </template>
        <span>Личный кабинет</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerticalMenu',
  data() {
    return {
      show: true
    }
  }
}
</script>

<style lang="scss" scoped>
.vertical_menu {
  height: auto;
  width: auto;
  position: fixed;
  z-index: 1;
  top: 40%;
  left: 10%;
  overflow-x: hidden;
  border-right: 2px solid rgba(179, 179, 179, 1);

    &__element {
      margin: 0.5em 1em;
      cursor: pointer;

        &__icon {
          color: #857885 !important;

          &:hover {
            color: #95D7AE !important;
          }
        }

        &__btn {
          margin: 0 0 0 0!important;
          padding: 0 0 0 0 !important;
          min-width: 0 !important;

          &:active {
            color: #E9E9E9 ;
          }
        }
        &__title {

        }
      }

    &__divider {
      border-color: rgba(179, 179, 179, 1) !important;
      border-width: 1px;
      max-width: 50px;
      margin-left: 0.6em;

    }
}


@media only screen and (max-width: 1600px) {
  .vertical_menu{
    display: none;
  }
}

</style>
