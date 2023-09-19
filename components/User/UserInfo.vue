<template>
  <div class="user_info_wrapper">
    <div class="user_info_title">
      <h3>{{ isLoggedIn ? "Настройки профиля" : "Авторизуйтесь" }}</h3>
      <v-icon large @click="closeDetail">
        mdi-close
      </v-icon>
    </div>

    <v-tabs
      v-model="tab"
      class="wtf"
      color="#000000"
      grow
      @change="checkServicesTab"
    >
      <v-tab :key="0">
        Общая информация
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
        <div class="services_list">
          <div
            v-for="(item, index) in $store.state.UserSettings.selectedServices"
            :key="index"
            class="service_card"
          >
            <div style="display: flex; align-items: center;">
              <span class="service_title">{{ item.name }}</span>
              <TooltipStyled
                :title="'Описание услуги'"
              >
                <v-menu
                  offset-overflow
                  offset-y
                >
                  <template #activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      color="#5D80B5"
                      v-on="on"
                    >
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  <v-list>
                    <div class="explain_info">
                      <span>{{ item.description }}</span>
                    </div>
                  </v-list>
                </v-menu>
              </TooltipStyled>
            </div>
            <InputStyled
              class="service_price"
              :class="'styleTextField'"
              :is-label="'Договорная'"
              :is-outlined="true"
              :is-disabled="true"
            />
          </div>
        </div>
        <div class="services_search">
          <TooltipStyled :title="'Добавить услугу'">
            <v-icon
              class="add_service_button"
              size="56"
              @click="setServiceByUser"
            >
              mdi-plus-circle-outline
            </v-icon>
          </TooltipStyled>
          <v-combobox
            v-model="localSelectedService"
            :item-text="'name'"
            :item-value="'id'"
            :items="$store.state.UserSettings.listServices"
            clearable
            label="Выберите услуги"
            outlined
            placeholder="Выберите услуги"
            return-object
            solo
            @keyup.enter="setServiceByUser"
          />
        </div>
      </v-tab-item>
    </v-tabs>

    <div class="save_logout_btn">
      <template v-if="isMobile">
        <ButtonStyled
          v-if="isLoggedIn"
          :custom-slot="true"
          :is-mobile="true"
          :loading="isUpdating"
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
          :loading="isUpdating"
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
  </div>
</template>

<script>
import { mapState } from 'vuex';

import LoginAuth from '../frontLayouts/LoginAuth';
import ButtonStyled from '../Common/ButtonStyled.vue';
import SearchStyled from '../Common/SearchStyled.vue';
import InputStyled from '../Common/InputStyled.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import UserFields from './UserFields';

export default {
  name: 'UserInfo',
  components: {
    TooltipStyled,
    InputStyled,
    SearchStyled,
    ButtonStyled,
    UserFields,
    LoginAuth
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
    },
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
      await this.$store.dispatch('UserSettings/deleteEntriesServicesByUser');
      await this.$store.dispatch('UserSettings/setTetherUsersServices', this.$store.state.UserSettings.selectedServices)
      await this.$store.dispatch('UserSettings/updateUser', { userId: this.userData.id, data: this.data });
      this.$toast.success('Данные сохранены',{ duration: 5000 })
      this.closeDetail();
    },
    async setServiceByUser() {
      const checkExist = await this.$store.dispatch('UserSettings/addServicesAction', this.localSelectedService)
      if (checkExist) return false;

      this.$toast.success('Услуга добавлена',{ duration: 5000 })
    },
    checkServicesTab(tabId){
      if (tabId === 1) {
        this.$store.dispatch('UserSettings/getUserServices', this.userData.id)
      }
    },
  }
};
</script>

<style lang="scss" scoped>
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

.services_list{
  display: grid;
  margin-top: 2em;
  .container_title{
    font-size: 1.2em;
    font-weight: 500;
  }
  .service_card{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .service_title{
      font-size: 1.3em;
    }
    .service_price{
      max-width: 150px;
    }

  }
}
.services_search{
  display: flex;
  justify-content: space-between;
}
.add_service_button{
  cursor: pointer;
  &:hover {
    color: #000000;
  }

}
</style>
