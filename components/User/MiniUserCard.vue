<template>
  <div class="wrapper">
    <div class="top">
      <div class="left_column">
        <div class="avatar">
          <v-avatar size="100">
            <v-img
              src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"
            />
          </v-avatar>
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
            size="20"
          />
        </div>
        <div class="user_info">
          <div class="user_name">
            {{ userObject.user_fio }}
          </div>
          <div class="user_company">
            Компания: {{ getCompanyName }}
          </div>
          <div class="user_mail">
            {{ userObject.email }}
          </div>
        </div>
      </div>
      <DropDownMenuStyled
        :close-on-content-click="true"
        :is-top="true"
        :close-on-click-outside="true"
      >
        <template #icon>
          <IconTooltip
            :icon-text="'mdi-dots-horizontal-circle-outline'"
            :text-tooltip="'Действия с пользователем'"
            :size-icon="'32'"
            :color-icon="'#B3B3B3'"
          />
        </template>
        <template #content>
          <UserActionsButton
            :user-object="userObject"
          />
        </template>
      </DropDownMenuStyled>
    </div>
    <div class="bottom">
      <v-tabs color="#000000">
        <v-tab :key="0">
          Услуги
          <v-badge
            :content="userObject.services.length"
            :value="userObject.services.length"
            color="#95D7AE"
          />
        </v-tab>
        <v-tab :key="1">
          Территория обслуживания
        </v-tab>
        <v-tab :key="2">
          Опыт работы с брендами
          <v-badge
            :content="userObject.brands.length"
            :value="userObject.brands.length"
            color="#95D7AE"
          />
        </v-tab>

        <!-- Услуги -->
        <v-tab-item :key="1">
          <v-card
            v-for="(item, index) in userObject.services"
            :key="index"
            class="service_wrapper"
          >
            <div class="left">
              <div class="service_name">
                {{ item.name }}
              </div>
              <TooltipStyled
                :title="'Описание услуги'"
              >
                <v-menu
                  offset-overflow
                  offset-y
                >
                  <template #activator="{ on, attrs }">
                    <v-icon
                      color="#5D80B5"
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  <v-list>
                    <div class="service_description">
                      <span>{{ item.description }}</span>
                    </div>
                  </v-list>
                </v-menu>
              </TooltipStyled>
            </div>
            <v-text-field
              v-model="price"
              class="price"

              disabled
              hide-details
              label="Цена"
              outlined
            />
          </v-card>
        </v-tab-item>

        <!-- Локация -->
        <v-tab-item :key="2">
          <div class="location_wrapper">
            <div class="location_title">
              В радиусе 100 км от населенного пункта:
            </div>
            <div class="city">
              Челябинск
            </div>
          </div>
        </v-tab-item>

        <!-- Бренды -->
        <v-tab-item :key="3">
          <v-card
            v-for="(item, index) in userObject.brands"
            :key="index"
            class="brand_wrapper"
            height="60"
          >
            <div style="display: flex;">
              <span class="brand_name">{{ item.name }}</span>
              <DropDownMenuStyled
                :is-left="true"
                :is-offset-y="true"
              >
                <template #icon>
                  <v-img
                    :src="getBrandPhoto(item)"
                    width="60"
                    height="24"
                  />
                </template>
                <template #content>
                  <BrandCard
                    :brand-object="item"
                  />
                </template>
              </DropDownMenuStyled>
            </div>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </div>
  </div>
</template>

<script>
import DropDownMenuStyled from '../Common/DropDownMenuStyled.vue';
import IconTooltip from '../Common/IconTooltip.vue';
import BrandCard from '../Common/BrandCard.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import UserActionsButton from '../Common/UserActionsButton.vue'


export default {
  name: 'MiniUserCard',
  components: { UserActionsButton, DropDownMenuStyled, IconTooltip, TooltipStyled, BrandCard },
  props: {
    userObject: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data() {
    return {
      price: 'Договорная'
    };
  },
  computed: {
    getCompanyName() {
      return this.userObject.company?.name;
    }
  },
  methods: {
    getBrandPhoto(elem) {
      if (elem.e_client_files.length) {
        return elem.e_client_files[0].url
      }
    },
  }
};

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
    padding: 0 5px;
    &:hover {
      background-color: #dadada;
    }
  }
}

.wrapper {
  padding: 20px;
  background: $background-element-color;
  overflow: auto;
  height: 500px;
  width: 650px;

  .top {
    display: flex;
    justify-content: space-between;

    .left_column {
      display: flex;

      .avatar {
        margin-right: 20px;
      }

      .user_info {
        .user_name {
          font-size: 1.5em;
          font-weight: 700;
        }

        .user_company {

        }

        .user_mail {
          color: $grey-text-color;
        }
      }
    }
  }

  .bottom {
    .service_wrapper {
      display: flex;
      padding: 10px;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .left {
        display: flex;

        .service_name {
        }

        .service_description {
          background-color: $background-element-color;
          padding: 10px;
        }

      }

      .price {
        max-width: 100px;
      }
    }

    .location_wrapper {
      .location_title {
        font-size: 1.3em;
        font-weight: 700;
      }

      .city {
        font-size: 1.3em;

        text-decoration: underline;
      }
    }

    .brand_wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 1em;
      margin-bottom: 10px;
      .brand_name {
        font-weight: 400;
        font-size: 1.5em;
        margin-right: 10px;
      }

    }
  }
}
</style>

<style lang="scss">
.v-rating .v-icon {
  padding: 0 !important;
}

.v-text-field--filled > .v-input__control > .v-input__slot, .v-text-field--full-width > .v-input__control > .v-input__slot, .v-text-field--outlined > .v-input__control > .v-input__slot {
  min-height: 32px;
}

.v-card > *:last-child:not(.v-btn):not(.v-chip):not(.v-avatar) {
  border-radius: 5px !important;
}
</style>
