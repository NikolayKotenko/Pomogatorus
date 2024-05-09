<template>
  <v-container class="user_account_wrapper">
    <div class="top_wrapper">
      Личный кабинет
    </div>
    <v-divider style="border-color: #D9D9D9;"/>

    <v-tabs v-model="tab" centered color="#ED7100">
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
      <v-tab-item :key="1">
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
      </v-tab-item>

      <!-- Портфель брендов -->
      <v-tab-item :key="2"></v-tab-item>
    </v-tabs>
    <div class="buttons_wrapper">
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
import UserFields from './UserFields.vue';
import { MtoMUsersServices } from '~/helpers/constructors';


export default {
  components: { ServiceCard, ButtonStyled, UserFields },
  data: () => ({
    isChanged: false,
    isValid: false,
    data: {},
    tab: 0
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
  },
  methods: {
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
      console.log('123', this.userData.id)
      await this.$store.dispatch('UserSettings/updateUser', {
        userId: this.userData.id,
        data: this.data,
      })
      console.log('321', this.userData.id)
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
  max-height: 800px;
  height: 800px;
  padding: 0;
  margin: 4px 4px 10px 4px;
  border-radius: 30px;
  box-shadow: $shadowBox;
  background-color: #FFFFFF;
  overflow: auto;
  .top_wrapper {
    padding: 20px 40px;
    font-size: 1.25em;
    font-weight: 600;
  }
  .buttons_wrapper {
    padding: 20px 40px;
  }

}
</style>
