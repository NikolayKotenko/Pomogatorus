<template>
  <v-container class="user_account_wrapper">
    <div class="top_wrapper">
      Личный кабинет
    </div>
    <v-divider style="border-color: #D9D9D9;"/>

    <v-tabs v-model="tab" centered color="#ED7100" @change="checkServicesTab">
      <v-tab :key="0">
        Общая информация
      </v-tab>
      <v-tab :key="1">
        Мои услуги
      </v-tab>
      <v-tab :key="2">
        Портфель брендов
      </v-tab>

      <!-- Общая информация -->
      <v-tab-item :key="0">
        <UserFields @is-changed="setChanged" @new-data="setData"/>
      </v-tab-item>

      <!-- Услуги -->
      <v-tab-item :key="1" class="service_tab">
        <template v-if="$store.state.UserSettings.selectedRawServices.length">
          <div
            v-for="(item, index) in $store.state.UserSettings.selectedRawServices"
            :key="index"
          >
            <ServiceCard
              v-if="item.id"
              :key="index"
              class="service_card_style"
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
        </template>

        <template v-else>
          <span class="title">Вы ещё не добавил ни одной услуги</span>
        </template>

        <!-- Добавить услугу -->
        <UniversalAddInput
          :list-items-available-to-add="
            $store.getters['UserSettings/getListServicesExcludeAdded']
          "
          class="add_service_block"
          @add-service="setServiceByUser"
        />
      </v-tab-item>

      <!-- Портфель брендов -->
      <v-tab-item :key="2" class="brands_tab">
        <template v-if="$store.getters.getListBrandsByUser.length">
          <v-card
            v-for="(item, index) in $store.getters.getListBrandsByUser"
            :key="index"
            elevation="0"
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
          class="add_brand_block"
          :list-items-available-to-add="$store.state.BrandsModule.listBrands"
          @add-service="addBrand"
        />
      </v-tab-item>
    </v-tabs>
    <div class="buttons_wrapper">
      <!--      <ButtonStyled -->
      <!--        v-if="isLoggedIn" -->
      <!--        :is-loading="isUpdating" -->
      <!--        :local-text="'назад'" -->
      <!--        local-class="style_button saveLogoutBtn" -->
      <!--        @click-button="hiddenMenu" -->
      <!--      /> -->
      <ButtonStyled
        v-if="isLoggedIn"
        :is-loading="isUpdating"
        :local-text="'cохранить'"
        local-class="style_button saveLogoutBtn"
        @click-button="saveUser"
      />
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import ServiceCard from '../Collaboration/ServiceCard.vue';
import ButtonStyled from '../Common/ButtonStyled.vue';
import BrandCard from '../Common/BrandCard.vue';
import IconTooltip from '../Common/IconTooltip.vue';
import DropDownMenuStyled from '../Common/DropDownMenuStyled.vue';
import UniversalAddInput from '../Common/UniversalAddInput.vue';
import UserFields from './UserFields.vue';
import { MtoMUsersServices } from '~/helpers/constructors';


export default {
  components: { UniversalAddInput, DropDownMenuStyled, IconTooltip, BrandCard, ServiceCard, ButtonStyled, UserFields },
  data: () => ({
    isChanged: false,
    isValid: false,
    data: {},
    tab: 0,
  }),
  computed: {
    ...mapState({
      isUpdating: (state) => state.UserSettings.isUpdating,
      userData: (state) => state.AuthModule.userData,
    }),
    isLoggedIn() {
      return this.userData && Object.keys(this.userData).length
    },
  },
  async mounted() {
    await this.$store.dispatch('CollaborationModule/getListServices')
    await this.$store.dispatch('BrandsModule/getListBrands')
    await this.$store.dispatch('UserSettings/getUserServices')
  },
  methods: {
    hiddenMenu() {

      this.$store.commit('UserSettings/setStateVisibleMenu', false)
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

    addBrand(obj) {
      if (this.$store.state.AuthModule.userData.brands.find(item => item.id === obj.id)) {
        this.$toast.error('Такой бренд уже добавлен');
        return false;
      }

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

  }
}
</script>


<style scoped lang="scss">
@import 'assets/styles/style';

.v-tab.v-tab {
  color: #111111 !important;
}

.user_account_wrapper {
  width: 562px;
  height: 760px;
  padding: 0;
  margin: 4px 4px 10px 4px;
  border-radius: 30px;
  box-shadow: $shadowBox;
  background-color: #FFFFFF;
  overflow: auto;
  position: relative;
  .top_wrapper {
    padding: 20px 40px;
    font-size: 1.25em;
    font-weight: 600;
  }
  .buttons_wrapper {
    padding: 20px 40px;
    position: absolute;
    display: flex;
    bottom: 0;
  }

}

.service_tab {
  display: inline;
  font-family: 'Inter', sans-serif;
  margin-top: 16px;
  height: 540px;
  overflow: auto;
  padding: 20px 0;
  background-color: #EEEEEE;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  .title {
    padding: 16px 20px;
    margin: 0 20px;
  }
  .service_card_style {
    padding: 16px 20px;
    margin: 0 20px 10px;
    border-radius: 15px;
  }
  .add_service_block {
    padding: 16px 20px;
    margin: 0 20px;
    border-radius: 15px;
  }
}

.brands_tab {
  display: inline;
  font-family: 'Inter', sans-serif;
  margin-top: 16px;
  height: 540px;
  overflow: auto;
  padding: 20px 0;
  background-color: #EEEEEE;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  .title {
    padding: 16px 20px;
    margin: 0 20px;
  }
  .brand_wrapper {
    display: flex;
    justify-content: space-between;
    grid-column-gap: 10px;
    padding: 16px 20px;
    margin: 0 20px 10px;
    background-color: #FFFFFF;
    border-radius: 15px;
    .brand_img {

    }
    .brand_name {
      display: flex;
      font-weight: 700;
      align-items: center;
      margin-right: 10px;
    }
  }
  .add_brand_block {
    padding: 16px 20px;
    margin: 0 20px;
    border-radius: 15px;
  }
}

</style>
