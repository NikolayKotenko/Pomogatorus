<template>
  <v-container class="wrapper">
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
      <DropDownMenuStyled>
        <template #icon>
          <IconTooltip
            :icon-text="'mdi-dots-horizontal-circle-outline'"
            :text-tooltip="'Другие действия'"
          />
        </template>
        <template #content>
          <v-card class="pa-2">
            <div>Не рекомедовать этого пользователя</div>
          </v-card>
        </template>
      </DropDownMenuStyled>
    </div>
    <v-divider style="margin: 10px 0 10px 0;"/>
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
          Территория оказания услуг
        </v-tab>
        <v-tab :key="2">
          Опыт работы с брендами
          <v-badge
            :content="userObject.services.length"
            :value="userObject.services.length"
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
          <v-card class="brand_wrapper" height="60" outlined>
            <v-img
              :src="require(`~/assets/svg/baxi_logo.svg`)"
              class="brand_img"
              contain
              max-width="100"
            />
            <span class="brand_text">Установленно оборудования Baxi: 23</span>
          </v-card>
          <v-card class="brand_wrapper" height="60" outlined>
            <v-img
              :src="require(`~/assets/svg/navien_logo.svg`)"
              class="brand_img"
              contain
              max-width="100"
            />
            <span class="brand_text">Установленно оборудования Navien: 23</span>
          </v-card>
          <v-card class="brand_wrapper" height="60" outlined>
            <v-img
              :src="require(`~/assets/svg/ariston_logo.svg`)"
              class="brand_img"
              contain
              max-width="100"
            />
            <span class="brand_text">Установленно оборудования Ariston: 23</span>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </div>
  </v-container>
</template>

<script>
import DropDownMenuStyled from '../Common/DropDownMenuStyled.vue';
import IconTooltip from '../Common/IconTooltip.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';


export default {
  name: 'MiniUserCard',
  components: { DropDownMenuStyled, IconTooltip, TooltipStyled },
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
    getCountServices() {
      this.userObject.services.length;
    }
  }
};

</script>


<style lang="scss" scoped>
@import '@/assets/styles/style.scss';

.wrapper {
  background: $background-element-color;
  height: 500px;
  width: 600px;

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
      padding: 20px;
      display: flex;
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

      .brand_img {
        max-height: 24px;
        margin-right: 50px;
        width: auto;
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
