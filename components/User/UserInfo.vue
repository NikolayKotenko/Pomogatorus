<template>
  <div class="user_info_wrapper">
    <div class="user_info_title">
      <h3>
        {{ isLoggedIn ? 'Настройки профиля' : 'Войти или Зарегистрироваться' }}
      </h3>
      <v-icon large @click="$store.commit('set_modal_auth', false)">
        mdi-close
      </v-icon>
    </div>

    <v-tabs v-model="tab" color="#000000" grow @change="checkServicesTab">
      <v-tab :key="0">
        <span class="tab_header">{{
          isLoggedIn ? 'Общая информация' : 'Авторизация'
        }}</span>
      </v-tab>
      <v-tab v-if="isLoggedIn" :key="1">
        <span class="tab_header">Мои услуги</span>
        <v-badge
          :content="$store.getters['UserSettings/getCountServices']"
          :value="$store.getters['UserSettings/getCountServices']"
          color="#95D7AE"
        />
      </v-tab>
      <v-tab
        v-if="isLoggedIn && userData.installation_engineering_systems === 1"
        :key="2"
      >
        <span class="tab_header">Портфель брендов</span>
        <v-badge
          :content="$store.getters['BrandsModule/getCountFavoriteBrands']"
          :value="$store.getters['BrandsModule/getCountFavoriteBrands']"
          color="#95D7AE"
        />
      </v-tab>
      <!-- Общая информация -->
      <v-tab-item :key="0">
        <div class="card_object pt-5 pb-5">
          <div v-if="isLoggedIn" class="card_object_container">
            <UserFields @is-changed="setChanged" @new-data="setData"/>
          </div>
          <LoginAuth v-else/>
        </div>
      </v-tab-item>

      <!-- Услуги -->
      <v-tab-item :key="1">
        <!-- Поиск | Сортировка -->
        <div class="search_sort">
          <SearchStyled
            :class="'search_services'"
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
          <div
            v-for="(item, index) in $store.state.UserSettings
              .selectedRawServices"
            :key="index"
          >
            <ServiceCard
              v-if="item.id"
              :key="index"
              :is-equipment-exist="false"
              :is-loading="$store.state.UserSettings.loading"
              :is-quantity-exist="false"
              :iteration-key="index + 1"
              :list-additional-data-services="
                $store.getters['UserSettings/getAdditionalDataByIdServices'](
                  item.id_services
                )
              "
              :service-object="item"
              @delete-one-service="deleteOneService(item, $event)"
              @update-price-field="setPrice(item, $event)"
            />
          </div>
        </div>

        <!-- Добавить услугу -->
        <UniversalAddInput
          :list-items-available-to-add="
            $store.getters['UserSettings/getListServicesExcludeAdded']
          "
          class="mt-5"
          @add-service="setServiceByUser"
        />
      </v-tab-item>

      <!-- Портфель брендов -->
      <v-tab-item :key="2" class="brands_tab">
        <template v-if="$store.getters.getListBrandsByUser.length">
          <span class="title">Бренды с которыми вы работаете</span>
          <v-card
            v-for="(item, index) in $store.getters.getListBrandsByUser"
            :key="index"
            class="brand_wrapper"
            height="60"
            outlined
          >
            <div style="display: flex;">
              <DropDownMenuStyled
                :is-left="true"
                :is-offset-y="true"
              >
                <template #icon>
                  <v-img
                    :src="getBrandPhoto(item)"
                    class="brand_img"
                    contain
                  />
                </template>
                <template #content>
                  <BrandCard
                    :brand-object="item"
                  />
                </template>
              </DropDownMenuStyled>
              <span class="brand_name">{{ item.name }}</span>
            </div>
            <IconTooltip
              :color-icon="'#B3B3B3'"
              :icon-text="'mdi-close'"
              :size-icon="'24'"
              :text-tooltip="'Удалить бренд'"
              @click-icon="deleteBrand(item)"
            />
          </v-card>
          <v-overlay
            :value="$store.state.BrandsModule.isLoading"
            absolute
            class="overlay_style"
            color="#FFFFFF"
            opacity="100"
          >
            <v-progress-circular
              color="#95D7AE"
              indeterminate
              size="64"
            />
          </v-overlay>
        </template>
        <template v-else>
          <span class="title">У вас нет брендов с которыми вы работаете</span>
        </template>
        <UniversalAddInput
          :list-items-available-to-add="$store.state.BrandsModule.listBrands"
          @add-service="addBrand"
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

    <v-overlay :value="isUpdating" absolute color="#F2F2F2">
      <v-progress-circular color="#95D7AE" indeterminate size="64"/>
    </v-overlay>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import LoginAuth from '../frontLayouts/LoginAuth';
import ButtonStyled from '../Common/ButtonStyled.vue';
import SearchStyled from '../Common/SearchStyled.vue';
import IconTooltip from '../Common/IconTooltip.vue';
import DropDownMenuStyled from '../Common/DropDownMenuStyled.vue'
import BrandCard from '../Common/BrandCard.vue'
import UserFields from './UserFields';
import ServiceCard from '@/components/Collaboration/ServiceCard.vue';
import UniversalAddInput from '@/components/Common/UniversalAddInput.vue';
import { MtoMUsersServices } from '~/helpers/constructors';
import SelectStyled from '~/components/Common/SelectStyled';

export default {
  name: 'UserInfo',
  components: {
    BrandCard, DropDownMenuStyled,
    SelectStyled,
    SearchStyled,
    ButtonStyled,
    UserFields,
    LoginAuth,
    ServiceCard,
    UniversalAddInput,
    IconTooltip,
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
      (v) => Number.isInteger(v) || 'Поле должно быть числом',
    ],
    debounceTimeout: null,
    arrSort: [
      {
        action: 'По алфавиту',
        value: '&sort[name]=asc',
      },
      {
        action: 'По дате',
        value: '&sort[created_at]=desc',
      },
    ],
    deleteBrandModal: false
  }),
  async mounted() {
    await this.$store.dispatch('CollaborationModule/getListServices')
    await this.$store.dispatch('BrandsModule/getListBrands')
    await this.$store.dispatch('BrandsModule/getListBrandsByUser')
  },
  computed: {
    ...mapState({
      isUpdating: (state) => state.UserSettings.isUpdating,
      userData: (state) => state.AuthModule.userData,
    }),

    isLoggedIn() {
      return this.userData && Object.keys(this.userData).length
    },
    isMobile() {
      return this.$device.isMobile
    },
  },
  methods: {
    openModal() {
      this.deleteBrandModal = true
    },
    closeModal() {
      this.deleteBrandModal = false
    },
    closeDetail() {
      this.$emit('close-detail')
    },
    logout() {
      this.$store.dispatch('logout')
    },
    setChanged(value) {
      this.isChanged = value
    },
    setData(value) {
      this.data = value.data
      this.data.email_state = this.userData.email_state
      this.data.telephone_state = this.userData.telephone_state
      this.isValid = value.isValid
    },
    async saveUser() {
      await this.$store.dispatch('UserSettings/updateUser', {
        userId: this.userData.id,
        data: this.data,
      })
      this.$toast.success('Данные сохранены', { duration: 5000 })
      this.closeDetail()
    },
    async setServiceByUser(serviceData) {
      const checkExist = this.$store.state.UserSettings.selectedServices.some(
        (elem) => {
          return elem.id === serviceData.id
        }
      )
      if (checkExist) {
        this.$toast.error('Такая услуга уже добавлена!')
        return false
      }

      await this.$store.dispatch(
        'UserSettings/addServicesAction',
        new MtoMUsersServices(serviceData.id)
      )
      await this.$store.dispatch(
        'UserSettings/getUserServices',
        this.userData.id
      )
      this.$toast.success('Услуга добавлена')
    },
    checkServicesTab(tabId) {
      if (tabId === 1) {
        this.$store.dispatch('UserSettings/getUserServices', this.userData.id)
      }
    },
    async deleteOneService(serviceRawObj, event) {
      await this.$store.dispatch(
        'UserSettings/deleteOneServiceAssignToUser',
        serviceRawObj.id_services
      )
      await this.$store.dispatch(
        'UserSettings/getUserServices',
        this.userData.id
      )
      this.$toast.success('Услуга удалена')
    },
    setPrice(object, price) {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
      this.debounceTimeout = setTimeout(async () => {
        await this.$store.dispatch(
          'UserSettings/addServicesAction',
          new MtoMUsersServices(object.id_services, price)
        )
        this.$store.state.UserSettings.updatedEntryPrice = object.id
        await this.$store.dispatch(
          'UserSettings/getUserServices',
          this.userData.id
        )
        this.$toast.success('Услуга обновлена')
      }, 2000)
    },
    filterListService(string) {
      if (!string) {
        string = ''
      }

      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
      this.debounceTimeout = setTimeout(async () => {
        this.$store.state.UserSettings.searchServiceByName = string
        await this.$store.dispatch(
          'UserSettings/getUserServices',
          this.userData.id
        )
      }, 1000)
    },
    sortListServices(object) {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout)
      this.debounceTimeout = setTimeout(async () => {
        this.$store.state.UserSettings.sortListServicesValue = object.value
        await this.$store.dispatch(
          'UserSettings/getUserServices',
          this.userData.id
        )
      }, 1000)
    },
    addBrand(obj) {
      this.$store.dispatch('BrandsModule/addBrandToUser', obj.id)

      const message = 'Добавлен бренд ' + obj.name
      this.$toast.success(message);
    },
    deleteBrand(obj){
      this.$store.dispatch('BrandsModule/deleteBrandByUser', obj.id)

      const message = 'Удалён бренд ' + obj.name
      this.$toast.success(message);
    },
    getBrandPhoto(elem) {
      if (elem.e_client_files.length) {
        return elem.e_client_files[0].url
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.user_info_wrapper {
  height: 100%;
  padding: 20px 30px;
  display: flex;
  grid-row-gap: 1em;
  flex-direction: column;

  .tab_header {
    font-size: 1.5em;
  }

  .user_info_title {
    font-size: 1.1em;
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

    .saveLogoutBtn {
      font-size: 1em;
    }

    .mobile_save_btn {
      max-width: 64px;
    }
  }
}

.brands_tab {
  display: grid;
  grid-row-gap: 10px;

  .title {
    font-size: 1.5em !important;
    font-weight: 700;
  }

  .brand_wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 1em;

    .brand_img {
      max-height: 24px;
      margin-right: 20px;
    }
    .brand_name {
      font-weight: 700;

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
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
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
  margin-top: 20px;

  .search_services {
    font-size: 1.5em !important;
  }

  .wrapper_sort {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-column-gap: 10px;
    align-items: center;
    justify-self: end;

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
