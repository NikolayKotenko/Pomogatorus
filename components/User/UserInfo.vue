<template>
  <div class="user_info_wrapper">
    <div class="user_info_title">
      <h3>{{ isLoggedIn ? "Настройки профиля" : "Войти или Зарегистрироваться" }}</h3>
      <v-icon large @click="$store.commit('set_modal_auth', false)">
        mdi-close
      </v-icon>
    </div>

    <v-tabs
      v-model="tab"
      color="#000000"
      grow
      @change="checkServicesTab"
    >
      <v-tab
        :key="0"
      >
        {{ isLoggedIn ? "Общая информация" : "Авторизация" }}
      </v-tab>
      <v-tab
        v-if="isLoggedIn"
        :key="1"
      >
        Мои услуги
        <v-badge
          :content="$store.getters['UserSettings/getCountServices']"
          :value="$store.getters['UserSettings/getCountServices']"
          color="#95D7AE"
        />
      </v-tab>
      <!-- Общая информация -->
      <v-tab-item :key="0">
        <div class="card_object pt-5 pb-5">
          <div v-if="isLoggedIn" class="card_object_container">
            <UserFields
              @is-changed="setChanged"
              @new-data="setData"
            />
          </div>
          <LoginAuth v-else/>
        </div>
      </v-tab-item>

      <!-- Услуги -->

      <v-tab-item :key="1">
        <!-- Поиск | Сортировка -->
        <div class="search_sort">
          <SearchStyled
            :is-class="'styleSearch'"
            :is-clearable="true"
            :is-hide-selected="true"
            :is-item-text="'text'"
            :is-item-value="'text'"
            :is-loading="$store.state.UserSettings.loading"
            :is-placeholder="'Фильтр по наименованию услуги'"
            @update-search-input="filterListService"
          />
          <div class="wrapper_sort">
            <section>Сортировка:</section>
            <SelectStyled
              :data="arrSort[0]"
              :is-solo="false"
              :item-text="'action'"
              :item-value="'value'"
              :items="arrSort"
              :placeholder="'Выберите действие'"
              class="select_sort"
              @update-input="sortListServices"
            />
          </div>
        </div>

        <div class="services_list">
          <div v-for="(item, index) in $store.state.UserSettings.selectedRawServices" :key="index">
            <ServiceCard
              v-if="item.id"
              :key="index"
              :is-equipment-exist="false"
              :is-loading="$store.state.UserSettings.loading"
              :is-quantity-exist="false"
              :iteration-key="index+1"
              :service-object="item"
              @delete-one-service="deleteOneService(item)"
              @update-price-field="setPrice(item, $event)"
            />
          </div>
        </div>

        <!-- Добавить услугу -->
        <UniversalAddInput
          :list-services-available-to-add="$store.state.UserSettings.listServices"
          class="mt-5"
          @add-service="setServiceByUser"
        />
      </v-tab-item>
    </v-tabs>

    <div class="save_logout_btn">
      <template v-if="isMobile">
        <ButtonStyled
          v-if="isLoggedIn"
          :custom-slot="true"
          :is-loading="isUpdating"
          :is-mobile="true"
          class="mobile_save_btn"
          local-class="style_button"
          @click-button="saveUser"
        >
          <v-icon>mdi-content-save-outline</v-icon>
        </ButtonStyled>
        <ButtonStyled
          v-if="isLoggedIn"
          :custom-slot="true"
          :is-mobile="true"
          local-class="style_close"
          @click-button="logout"
        >
          <v-icon>mdi-exit-to-app</v-icon>
        </ButtonStyled>
      </template>
      <template v-else>
        <ButtonStyled
          v-if="isLoggedIn"
          :is-loading="isUpdating"
          :local-text="'Сохранить'"
          local-class="style_button saveLogoutBtn"
          @click-button="saveUser"
        />
        <ButtonStyled
          v-if="isLoggedIn"
          :local-text="'Выйти'"
          local-class="style_close saveLogoutBtn"
          @click-button="logout"
        />
      </template>
    </div>

    <v-overlay
      :value="isUpdating"
      absolute
      color="#F2F2F2"
    >
      <v-progress-circular
        color="#95D7AE"
        indeterminate
        size="64"
      />
    </v-overlay>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import LoginAuth from "../frontLayouts/LoginAuth";
import ButtonStyled from "../Common/ButtonStyled.vue";
import SearchStyled from "../Common/SearchStyled.vue";
import InputStyled from "../Common/InputStyled.vue";
import TooltipStyled from "../Common/TooltipStyled.vue";
import UserFields from "./UserFields";
import ServiceCard from "@/components/Collaboration/ServiceCard.vue";
import UniversalAddInput from "@/components/Common/UniversalAddInput.vue";
import { MtoMUsersServices } from "~/helpers/constructors";
import SelectStyled from "~/components/Common/SelectStyled";

export default {
  name: 'UserInfo',
  components: {
    SelectStyled,
    TooltipStyled,
    InputStyled,
    SearchStyled,
    ButtonStyled,
    UserFields,
    LoginAuth,
    ServiceCard,
    UniversalAddInput
  },
  data: () => ({
    isChanged: false,
    data: {},
    isValid: false,
    tab: 0,
    loading: false,
    serviceName: '',
    servicePrice: '',
    localSelectedService: null,
    isErrorMessagesPrice: [
      v => Number.isInteger(v) || 'Поле должно быть числом'
    ],
    debounceTimeout: null,
    arrSort: [
      {
        'action': 'По алфавиту',
        'value': '&sort[name]=asc'
      },
      {
        'action': 'По дате',
        'value': '&sort[created_at]=desc'
      }
    ]
  }),
  async mounted() {
    await this.$store.dispatch('UserSettings/getListServices');
  },
  computed: {
    ...mapState({
      isUpdating: state => state.UserSettings.isUpdating,
      userData: state => state.AuthModule.userData
    }),

    isLoggedIn() {
      return this.userData && Object.keys(this.userData).length;
    },
    isMobile() {
      return this.$device.isMobile;
    }
  },
  methods: {
    closeDetail() {
      this.$emit('close-detail');
    },
    logout() {
      this.$store.dispatch('logout');
    },
    setChanged(value) {
      this.isChanged = value;
    },
    setData(value) {
      this.data = value.data;
      this.data.email_state = this.userData.email_state;
      this.data.telephone_state = this.userData.telephone_state;
      this.isValid = value.isValid;
    },
    async saveUser() {
      await this.$store.dispatch("UserSettings/updateUser", { userId: this.userData.id, data: this.data });
      this.$toast.success("Данные сохранены", { duration: 5000 });
      this.closeDetail();
    },
    async setServiceByUser(serviceData) {
      const checkExist = this.$store.state.UserSettings.selectedServices.some((elem) => {
        return elem.id === serviceData.id;
      });
      if (checkExist) {
        this.$toast.error('Такая услуга уже добавлена!');
        return false;
      }

      await this.$store.dispatch('UserSettings/addServicesAction', new MtoMUsersServices(serviceData.id));
      await this.$store.dispatch('UserSettings/getUserServices', this.userData.id);
      this.$toast.success('Услуга добавлена');
    },
    checkServicesTab(tabId) {
      if (tabId === 1) {
        this.$store.dispatch('UserSettings/getUserServices', this.userData.id);
      }
    },
    async deleteOneService(serviceRawObj) {
      await this.$store.dispatch('UserSettings/deleteOneServiceAssignToUser', serviceRawObj.id_services);
      await this.$store.dispatch('UserSettings/getUserServices', this.userData.id);

      this.$store.commit("UserSettings/changeStateDeleteServiceModal", false);
      this.$toast.success("Услуга удалена");
    },
    setPrice(object, price) {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(async () => {
        await this.$store.dispatch('UserSettings/addServicesAction', new MtoMUsersServices(
          object.id_services,
          price
        ));
        this.$store.state.UserSettings.updatedEntryPrice = object.id;
        await this.$store.dispatch('UserSettings/getUserServices', this.userData.id);
        this.$toast.success('Услуга обновлена');
      }, 2000);
    },
    filterListService(string) {
      if (!string) {
        string = '';
      }

      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(async () => {
        this.$store.state.UserSettings.searchServiceByName = string;
        await this.$store.dispatch('UserSettings/getUserServices', this.userData.id);
      }, 1000);
    },
    sortListServices(object) {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(async () => {
        this.$store.state.UserSettings.sortListServicesValue = object.value;
        await this.$store.dispatch('UserSettings/getUserServices', this.userData.id);
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.user_info_wrapper {
  height: 100%;
  padding: 20px 30px;
  display: flex;
  grid-row-gap: 1em;
  flex-direction: column;

  .user_info_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .save_logout_btn {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1em;

    padding: 0 30px 30px 30px;
    margin-top: 5px;
    background: white;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25);

    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;

    .mobile_save_btn {
      max-width: 64px;
    }
  }
}

.close {
  max-height: 45px;
  max-width: 200px;
  z-index: 999;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}

.services_list {
  display: grid;
  padding: 0 2px;
  grid-row-gap: 1em;

  .container_title {
    font-size: 1.2em;
    font-weight: 500;
  }

  .service_card {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .service_title {
      font-size: 1.3em;

    }

    .service_price {
      max-width: 150px;
    }

  }
}

.search_sort {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2em;
  margin-bottom: 2em;

  .wrapper_sort {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-column-gap: 10px;
    align-items: center;

    .select_sort {
      margin-top: 0 !important;
    }
  }
}

.add_service_button {
  cursor: pointer;

  &:hover {
    color: #000000;
  }

}
</style>
