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

    <DropDownMenuStyled
      :is-left="true"
      :is-offset-y="true"
    >
      <template #icon>
        <span style="text-decoration: underline; color: #5d80b5;">
          Специалисты, занимающиеся брендом {{ brandObject.name }}
        </span>
      </template>
      <template #content>
        <div class="card_users_wrapper">
          <div
            v-for="(item, index) in localListUsersByBrand"
            :key="index"
            class="user_wrapper"
          >
            <div class="user_info">
              <DropDownMenuStyled :is-left="true" :is-offset-y="true">
                <template #icon>
                  <v-avatar size="50">
                    <v-img
                      src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"
                    />
                  </v-avatar>
                </template>
                <template #content>
                  <MiniUserCard :user-object="item"/>
                </template>
              </DropDownMenuStyled>
              <div class="user_fio_and_rating">
                {{ item.user_fio }}
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
              </div>
            </div>

            <DropDownMenuStyled
              :close-on-content-click="true"
              :is-top="true"
            >
              <template #icon>
                <IconTooltip
                  :icon-text="'mdi-dots-horizontal-circle-outline'"
                  :text-tooltip="'Действия с пользователем'"
                  :size-icon="'24'"
                  :color-icon="'#B3B3B3'"
                />
              </template>
              <template #content>
                <div class="action_menu">
                  <div class="menu_elem">
                    Пригласить на объект
                  </div>
                  <div
                    class="menu_elem"
                    @click="$store.dispatch('CollaborationModule/addUserToFavoriteUsers', item.id)"
                  >
                    Добавить в избранные пользователи
                  </div>
                  <div class="menu_elem">
                    Не рекомедовать этого пользователя
                  </div>
                </div>
              </template>
            </DropDownMenuStyled>
          </div>
        </div>
      </template>
    </DropDownMenuStyled>
  </div>
</template>

<script>
import MiniUserCard from '../User/MiniUserCard.vue'
import DropDownMenuStyled from './DropDownMenuStyled.vue'
import IconTooltip from './IconTooltip.vue'

export default {
  name: 'BrandCard',
  components: { MiniUserCard, IconTooltip, DropDownMenuStyled },
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

.card_users_wrapper {
  padding: 10px;
  background-color: $background-element-color;
  display: grid;
  grid-row-gap: 10px;
  .user_wrapper {
    display: flex;
    justify-content: space-between;
    .user_info {
      display: flex;
      grid-column-gap: 20px;
      .user_fio_and_rating {
        display: grid;
        grid-row-gap: 5px;
      }
    }
  }
}

</style>
