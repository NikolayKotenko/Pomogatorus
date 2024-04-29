<template>
  <div class="brand_container">
    <div class="top_wrapper">
      <div class="brand_name">
        {{ brandObject.name }}
      </div>
      <v-img
        :src="getBrandPhoto(brandObject)"
        height="24"
        max-width="60"
        contain
      />
    </div>

    <v-divider style="margin: 10px 0 10px 0;"/>

    <div class="bot_wrapper" v-html="brandObject.description"/>

    <v-divider style="margin: 10px 0 10px 0;"/>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Специаслисты занимающиеся Монтажем {{ brandObject.name }}
        </v-expansion-panel-header>
        <v-expansion-panel-content
          v-for="(item, index) in localListUsersByBrand"
          :key="index"
        >
          <div class="user_card">
            <v-avatar size="50">
              <v-img
                src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"
              />
            </v-avatar>
            <div class="user_fio">
              {{ item.user_fio }}
              <div class="rating">
                <v-rating
                  :value="4"
                  background-color="#B3B3B3"
                  color="#95D7AE"
                  empty-icon="mdi-star-outline"
                  full-icon="mdi-star"
                  half-icon="mdi-star-half-full"
                  hover
                  length="5"
                  readonly
                  size="16"
                />
                <span>12 отзывов</span>
              </div>
            </div>
            <div class="user_actions">
              <DropDownMenuStyled
                :close-on-content-click="true"
                :is-top="true"
              >
                <template #icon>
                  <IconTooltip
                    :icon-text="'mdi-dots-horizontal'"
                    :text-tooltip="'Действия с пользователем'"
                    :size-icon="'24'"
                    :color-icon="'#B3B3B3'"
                  />
                </template>
                <template #content>
                  <UserActionsButton
                    :user-object="item"
                  />
                </template>
              </DropDownMenuStyled>
            </div>

          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

  </div>
</template>

<script>
import MiniUserCard from '../User/MiniUserCard.vue'
import DropDownMenuStyled from './DropDownMenuStyled.vue'
import IconTooltip from './IconTooltip.vue'
import UserActionsButton from './UserActionsButton.vue'

export default {
  name: 'BrandCard',
  components: { UserActionsButton, MiniUserCard, IconTooltip, DropDownMenuStyled },
  props: {
    brandObject: {
      type: Object,
      require: true,
      default: () => ({})
    }
  },
  data() {
    return {
      localListUsersByBrand: []
    }
  },
  async mounted() {
    await this.$store.dispatch('CollaborationModule/getListAllUsers')
    await this.getListUsersByBrandLocal()
  },
  methods: {
    getBrandPhoto(elem) {
      if (elem.e_client_files.length) {
        return elem.e_client_files[0].url
      }
    },
    async getListUsersByBrandLocal() {
      this.localListUsersByBrand = await this.$store.dispatch('CollaborationModule/getListMembersByBrand', this.brandObject.id)
    }

  }
}
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.v-expansion-panel-content {
  background: #DDDDDD !important;
}

.action_menu {
  padding: 10px;
  display: grid;
  grid-row-gap: 5px;
  border-radius: 5px;
  border: 1px solid #FFDB58;
  background-color: $background-element-color;
  .menu_elem {
    width: 100%;
    cursor: pointer;
    transition: $transition;
    &:hover {
      background-color: #dadada;
    }
  }
}

.brand_container {
  padding: 20px;
  background-color: #FFFFFF;
  max-width: 500px;
  border-radius: 30px;
  box-shadow: $shadowBox;
  margin: 4px 4px 10px 4px;
  .top_wrapper{
    display: flex;
    .brand_name {
      font-weight: 400;
      font-size: 2.2em;
      margin-right: 10px;
    }
  }
  .bot_wrapper {
    .title {
      font-size: 1em !important;
      font-weight: 400 !important;
      font-style: normal;
      line-height: normal !important;
      letter-spacing: normal !important;
    }

  }
}

.user_card {
  display: flex;
  background: #FFFFFF;
  border-radius: 30px;
  margin-top: 20px;
  padding: 6px 20px 6px 6px;
  align-content: center;
  justify-content: space-between;
  grid-column-gap: 10px;
  .user_fio {
    margin-right: auto;
    .rating {
      display: flex;
      grid-column-gap: 10px;
      color: #8A8784;
      font-size: 0.9em;
    }
  }
  .user_actions {
    display: grid;
    align-content: center;
  }
}

</style>
