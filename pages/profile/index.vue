<template>
  <v-container>
    <SubHeader/>
    <div class="profile_container">
      <div class="left_column_wrapper">
        <div class="user_avatar_and_name">
          <div v-if="$store.getters.getUserId" class="user_avatar">
            <DropzoneInput
              :id-user="$store.getters.getUserId"
              :data="$store.getters.getUserPhotos"
              :object-template="false"
              :is-avatar="true"
              class="dropzone_style"
              @uploaded-file="changeFileData"
              @remove-file="removeFile"
            />
            <v-avatar class="avatar_style" size="100">
              <v-img
                v-if="$store.getters.getUserAvatar"
                :src="$store.getters.getUserAvatar"
              />
              <div v-else class="empty_avatar"/>
            </v-avatar>
          </div>
          <div class="user_info">
            <div class="name">
              {{ userData.user_fio }}
            </div>
            <div class="mail">
              {{ userData.email }}
            </div>
          </div>
        </div>
        <div class="menu_tabs">
          <v-tabs v-model="tab" hide-slider vertical background-color="#DFDFDF">
            <v-tab :key="0">
              <img :src="require(`~/assets/svg/icons/profile_icon.svg`)">
              Ваша информация
            </v-tab>
            <v-tab :key="1">
              <img :src="require(`~/assets/svg/icons/wrench_icon.svg`)">
              Информация специалиста
            </v-tab>
            <v-tab :key="2">
              <img :src="require(`~/assets/svg/icons/password_icon.svg`)">
              Настройки входа
            </v-tab>
          </v-tabs>
        </div>
      </div>
      <div class="right_column_wrapper">
        <v-tabs-items v-model="tab">
          <v-tab-item :key="0">
            <div class="tab_header">
              <v-divider vertical style="border-width: 3px; border-color: #000000;"/>
              <div v-if="isChangeGeneralInfo" class="header_name">
                Изменить информацию
              </div>
              <div v-else class="header_name">
                Ваша информация
              </div>
            </div>
            <div v-if="!isChangeGeneralInfo" class="tab_sub_header">
              Редактируйте общую информацию о себе
            </div>

            <!-- Если isChangeGeneralInfo = true, редактируемые поля -->
            <div v-if="isChangeGeneralInfo" class="editable_general_info_wrapper">
              <UserFields @is-changed="setChanged" @new-data="setData"/>
            </div>
            <ButtonStyled
              v-if="isLoggedIn && isChangeGeneralInfo === true "
              :is-loading="isUpdating"
              :local-text="'Сохранить'"
              :elevation="0"
              class="save_btn"
              local-class="style_save_button"
              @click-button="saveUser"
            />


            <!-- Если isChangeGeneralInfo = false, нередактируемые поля -->
            <div v-else class="general_info_wrapper">
              <div class="wrapper_title">
                Общая информация
              </div>
              <v-divider style="border-color: #DDDDDD;"/>
              <div class="table_info" disabled>
                <div class="table_content">
                  <div class="table_left_content_text">
                    Фамилия
                  </div>
                  <div class="table_right_content_text">
                    {{ userData.middle_name }}
                  </div>
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="table_content">
                  <div class="table_left_content_text">
                    Имя
                  </div>
                  <div class="table_right_content_text">
                    {{ userData.first_name }}
                  </div>
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="table_content">
                  <div class="table_left_content_text">
                    Отчество
                  </div>
                  <div class="table_right_content_text">
                    {{ userData.last_name }}
                  </div>
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="table_content">
                  <div class="table_left_content_text">
                    Вид деятельности
                  </div>
                  <div class="table_right_content_text">
                    -
                  </div>
                </div>
              </div>
              <v-divider style="border-color: #DDDDDD;"/>
              <div class="info_footer_wrapper">
                <div class="change_info_btn" @click="isChangeGeneralInfo = true">
                  <span class="btn_text">изменить</span>
                </div>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item :key="1">
            <div class="tab_header">
              <v-divider vertical style="border-width: 3px; border-color: #000000;"/>
              <div v-if="isChangeServicesInfo || isChangeCitiesInfo || isChangeBrandInfo" class="header_name">
                Изменить информацию
              </div>
              <div v-else class="header_name">
                Информация специалиста
              </div>
            </div>
            <div v-if="! isChangeServicesInfo && ! isChangeCitiesInfo && ! isChangeBrandInfo" class="tab_sub_header">
              Редактируйте вашу информацию как специалиста
            </div>

            <div v-if="isShowCitiesInfo">
              <!-- Если isChangeCitiesInfo = true, редактируемые поля -->
              <div v-if="isChangeCitiesInfo" class="editable_general_info_wrapper">
                <MapServiceArea/>
              </div>
              <ButtonStyled
                v-if="isLoggedIn && isChangeCitiesInfo === true "
                :is-loading="isUpdating"
                :local-text="'Сохранить'"
                :elevation="0"
                class="save_btn"
                local-class="style_save_button"
                @click-button="saveCitiesInfo"
              />

              <!-- Если isChangeCitiesInfo = false, нередактируемые поля -->
              <div v-if="! isChangeCitiesInfo" class="general_info_wrapper">
                <div class="wrapper_title">
                  Территория обслуживания
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="table_info" disabled>
                  <div class="table_content">
                    <div class="table_left_content_text">
                      Город/населенный пункт
                    </div>
                    <div class="table_right_content_text">
                      {{ $store.getters['getCitiesByUser'] }}
                    </div>
                  </div>
                  <v-divider style="border-color: #DDDDDD;"/>
                  <div class="table_content">
                    <div class="table_left_content_text">
                      Радиус обслуживания
                    </div>
                    <div class="table_right_content">
                      {{ userData.range_area }}
                    </div>
                  </div>
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="info_footer_wrapper">
                  <div class="change_info_btn" @click="changeCitiesInfo">
                    <span class="btn_text">изменить</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isShowBrandsInfo">
              <!-- Если isChangeBrandInfo = true, редактируемые поля -->
              <div v-if="isChangeBrandInfo" class="editable_brand_info_wrapper">
                <UniversalAddInput
                  class="add_brand_block"
                  :list-items-available-to-add="$store.state.BrandsModule.listBrands"
                  @add-service="addBrand"
                />
                <v-divider style="border-color: #DDDDDD;"/>
                <div
                  v-for="(item, index) in $store.getters.getListBrandsByUser"
                  :key="index"
                >
                  <div class="brand_container">
                    <div style="text-transform: uppercase">
                      {{ item.name }}
                    </div>
                    <IconTooltip
                      :color-icon="'#B3B3B3'"
                      :icon-text="'mdi-close'"
                      :size-icon="'24'"
                      :text-tooltip="'Удалить бренд'"
                      @click-icon="deleteBrand(item)"
                    />
                  </div>
                  <v-divider style="border-color: #DDDDDD;"/>
                </div>
                <div style="height: 50px;"/>
              </div>
              <ButtonStyled
                v-if="isLoggedIn && isChangeBrandInfo === true "
                :is-loading="isUpdating"
                :local-text="'Сохранить'"
                :elevation="0"
                class="save_btn"
                local-class="style_save_button"
                @click-button="saveBrandInfo"
              />

              <!-- Если isChangeBrandInfo = false, нередактируемые поля -->
              <div v-if="! isChangeBrandInfo" class="general_info_wrapper">
                <div class="wrapper_title">
                  Предпочитаемые бренды
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div
                  v-for="(item, index) in $store.getters.getListBrandsByUser"
                  :key="index"
                  class="table_info"
                  disabled
                >
                  <div
                    class="table_content"
                  >
                    <div>
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
                    <div class="table_right_content_text">
                      {{ item.name }}
                    </div>
                  </div>
                  <v-divider v-if="index !== $store.getters.getListBrandsByUser.length - 1" style="border-color: #DDDDDD;"/>
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="info_footer_wrapper">
                  <div class="change_info_btn" @click="changeBrandsInfo">
                    <span class="btn_text">изменить</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isShowServicesInfo">
              <!-- Если isChangeServicesInfo = true, редактируемые поля -->
              <div v-if="isChangeServicesInfo" class="editable_brand_info_wrapper">
                <UniversalAddInput
                  :list-items-available-to-add="
                    $store.getters['UserSettings/getListServicesExcludeAdded']"
                  class="add_service_block"
                  @add-service="setServiceByUser"
                />
                <v-divider style="border-color: #DDDDDD;"/>
                <div
                  v-for="(item, index) in $store.state.UserSettings.selectedRawServices"
                  :key="index"
                >
                  <div class="service_card_style">
                    <ServiceCard
                      v-if="item.id"
                      :key="index"
                      :is-equipment-exist="false"
                      :is-loading="$store.state.UserSettings.loading"
                      :is-quantity-exist="false"
                      :iteration-key="index + 1"
                      :list-additional-data-services="
                        $store.getters['UserSettings/getAdditionalDataByIdServices'](item.id_services)"
                      :service-object="item"
                      @delete-one-service="deleteOneService(item, $event)"
                      @update-price-field="setPrice(item, $event)"
                    />
                  </div>
                  <v-divider style="border-color: #DDDDDD;"/>
                </div>
                <div style="height: 50px;"/>
              </div>
              <ButtonStyled
                v-if="isLoggedIn && isChangeServicesInfo === true "
                :is-loading="isUpdating"
                :local-text="'Сохранить'"
                :elevation="0"
                class="save_btn"
                local-class="style_save_button"
                @click-button="saveServicesInfo"
              />

              <!-- Если isChangeServicesInfo = false, нередактируемые поля -->
              <div v-if="! isChangeServicesInfo" class="general_info_wrapper">
                <div class="wrapper_title">
                  Мои услуги
                </div>
                <v-divider style="border-color: #DDDDDD;"/>

                <div
                  v-for="(item, index) in $store.state.UserSettings.selectedRawServices"
                  :key="index"
                  class="table_info"
                >
                  <div
                    class="table_content"
                  >
                    <div class="table_left_content_text">
                      {{ item.service_data.name }}
                    </div>
                    <div class="table_right_content_text">
                      {{ item.price }}
                    </div>
                  </div>
                  <v-divider v-if="index !== $store.state.UserSettings.selectedRawServices.length - 1" style="border-color: #DDDDDD;"/>
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="info_footer_wrapper">
                  <div class="change_info_btn" @click="changeServicesInfo">
                    <span class="btn_text">изменить</span>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item :key="2">
            <div class="tab_header">
              <v-divider vertical style="border-width: 3px; border-color: #000000;"/>
              <div class="header_name">
                Настройки входа
              </div>
            </div>
            <div class="tab_sub_header">
              Редактируйте ваши данные входа
            </div>

            <div v-if="isShowTelephoneInfo">
              <!-- Если isChangeCitiesInfo = true, редактируемые поля -->
              <div v-if="isChangeTelephone" class="editable_general_info_wrapper">
                <div class="wrapper_title">
                  Номер телефона
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="telephone_input">
                  <div>Изменить номер</div>
                  <v-text-field
                    v-model="form.telephone"
                    v-mask="mask"
                    dense
                    class="input_style"
                    hide-details
                    label="Телефон"
                    outlined
                    @change="setTelephoneData"
                  />
                </div>

                <v-divider style="border-color: #DDDDDD;"/>
                <div style="height: 50px;"/>
              </div>
              <ButtonStyled
                v-if="isLoggedIn && isChangeTelephone === true "
                :is-loading="isUpdating"
                :local-text="'Сохранить'"
                :elevation="0"
                class="save_btn"
                local-class="style_save_button"
                @click-button="saveTelephoneInfo"
              />

              <!-- Если isChangeCitiesInfo = false, нередактируемые поля -->
              <div v-if="! isChangeTelephone" class="general_info_wrapper">
                <div class="wrapper_title">
                  Номер телефона
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="table_info" disabled>
                  <div class="table_content">
                    <div class="table_left_content_text">
                      Номер телефона
                    </div>
                    <div class="table_right_content_text">
                      {{ userData.telephone }}
                    </div>
                  </div>
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="info_footer_wrapper">
                  <div class="change_info_btn" @click="changeTelephoneInfo">
                    <span class="btn_text">изменить</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isShowMailInfo">
              <!-- Если isChangeMail = true, редактируемые поля -->
              <div v-if="isChangeMail" class="editable_general_info_wrapper">
                <div class="wrapper_title">
                  Адрес электронной почты
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="old_mail_container">
                  <div class="container_text">
                    Старый адрес эл.почты
                  </div>
                  <div>
                    {{ userData.email }}
                  </div>
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="telephone_input">
                  <div>Новый адрес эл.почты</div>
                  <InputStyled
                    :class="'styleTextField'"
                    :data="form.email"
                    :is-label="'Email'"
                    :is-outlined="true"
                    :rules="emailRules"
                    class="input_style"
                    @update-input="setEmailData"
                  />
                </div>

                <v-divider style="border-color: #DDDDDD;"/>
                <div style="height: 50px;"/>
              </div>
              <ButtonStyled
                v-if="isLoggedIn && isChangeMail === true "
                :is-loading="isUpdating"
                :local-text="'Сохранить'"
                :elevation="0"
                class="save_btn"
                local-class="style_save_button"
                @click-button="saveMailInfo"
              />

              <!-- Если isChangeCitiesInfo = false, нередактируемые поля -->
              <div v-if="! isChangeMail" class="general_info_wrapper">
                <div class="wrapper_title">
                  Адрес электронной почты
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="table_info" disabled>
                  <div class="table_content">
                    <div class="table_left_content_text">
                      Адрес эл. почты
                    </div>
                    <div class="table_right_content_text">
                      {{ userData.email }}
                    </div>
                  </div>
                </div>
                <v-divider style="border-color: #DDDDDD;"/>
                <div class="info_footer_wrapper">
                  <div class="change_info_btn" @click="changeMailInfo">
                    <span class="btn_text">изменить</span>
                  </div>
                </div>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import UserFields from '../../components/User/UserFields.vue'
import ButtonStyled from '../../components/Common/ButtonStyled.vue'
import MapServiceArea from '../../components/Widgets/MapServiceArea.vue'
import DropDownMenuStyled from '../../components/Common/DropDownMenuStyled.vue'
import BrandCard from '../../components/Common/BrandCard.vue'
import UniversalAddInput from '../../components/Common/UniversalAddInput.vue'
import IconTooltip from '../../components/Common/IconTooltip.vue'
import ServiceCard from '../../components/Collaboration/ServiceCard.vue'
import InputStyled from '../../components/Common/InputStyled.vue';
import SubHeader from '../../components/SubHeader.vue';
import ButtonUploadFiles from '../../components/Common/ButtonUploadFiles.vue'
import DropzoneInput from '../../components/Common/DropzoneInput.vue'
import { MtoMUsersServices } from '~/helpers/constructors';

export default {
  components: { DropzoneInput, ButtonUploadFiles, SubHeader, InputStyled, ServiceCard, IconTooltip, UniversalAddInput, BrandCard, DropDownMenuStyled, MapServiceArea, ButtonStyled, UserFields, Dropzone },
  data () {
    return {
      data: {},
      tab: null,
      isChangeGeneralInfo: false,
      isChangeCitiesInfo: false,
      isChangeBrandInfo: false,
      isChangeServicesInfo: false,
      isShowCitiesInfo: true,
      isShowBrandsInfo: true,
      isShowServicesInfo: true,
      isChangeTelephone: false,
      isChangeMail: false,
      isChangePassword: false,
      isShowTelephoneInfo: true,
      isShowMailInfo: true,
      isShowPasswordInfo: true,
      isValid: false,
      form: {
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        telephone: '',
        home_owner: '',
        installation_engineering_systems: '',
        selling_engineering_equipment: '',
        marketing_and_sales: ''
      },
      mask: '+7 (###) ###-##-##',
      emailRules: [
        v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Введите корректный email'
      ],
    }
  },
  computed: {
    ...mapState({
      userData: state => state.AuthModule.userData,
      isUpdating: (state) => state.UserSettings.isUpdating,
      defaultUserData: state => state.AuthModule.defaultUserData,
    }),
    isLoggedIn() {
      return this.userData && Object.keys(this.userData).length
    },

  },
  watch: {
    '$store.getters.getUserId': {
      async handler(value) {
        await this.$store.dispatch('BrandsModule/getListFavoritesBrands')
        await this.$store.dispatch('BrandsModule/getListBrands')
        await this.$store.dispatch('UserSettings/getUserServices', this.$store.getters.getUserId)
        await this.$store.dispatch('CollaborationModule/getListServices')
      },
    },
  },
  async mounted() {
    await this.$store.dispatch('BrandsModule/getListFavoritesBrands')
    await this.$store.dispatch('BrandsModule/getListBrands')
    await this.$store.dispatch('UserSettings/getUserServices', this.$store.getters.getUserId)
    await this.$store.dispatch('CollaborationModule/getListServices')
  },
  methods: {
    changeCitiesInfo() {
      this.isChangeCitiesInfo = true
      this.isShowBrandsInfo = false
      this.isShowServicesInfo = false
    },
    saveCitiesInfo() {
      this.saveUser()

      this.isChangeCitiesInfo = false
      this.isShowBrandsInfo = true
      this.isShowServicesInfo = true
    },
    changeBrandsInfo() {
      this.isChangeBrandInfo = true
      this.isShowCitiesInfo = false
      this.isShowServicesInfo = false
    },
    saveBrandInfo() {
      this.isChangeBrandInfo = false
      this.isShowCitiesInfo = true
      this.isShowServicesInfo = true
    },
    changeServicesInfo() {
      this.isChangeServicesInfo = true
      this.isShowCitiesInfo = false
      this.isShowBrandsInfo = false
    },
    saveServicesInfo() {
      this.isChangeServicesInfo = false
      this.isShowCitiesInfo = true
      this.isShowBrandsInfo = true
    },
    changeTelephoneInfo() {
      this.isChangeTelephone = true
      this.isShowMailInfo = false
      this.isShowPasswordInfo = false
    },
    saveTelephoneInfo() {
      this.saveUser()

      this.isChangeTelephone = false
      this.isShowMailInfo = true
      this.isShowPasswordInfo = true
    },
    changeMailInfo() {
      this.isChangeMail = true
      this.isShowPasswordInfo = false
      this.isShowTelephoneInfo = false
    },
    saveMailInfo() {
      this.saveUser()

      this.isChangeMail = false
      this.isShowTelephoneInfo = true
      this.isShowPasswordInfo =  true
    },

    setChanged(value) {
      this.isChanged = value
    },
    setEmailData(name) {
      this.data.email = this.form.email
    },
    setTelephoneData(name) {
      this.data.telephone = this.form.telephone
    },
    setData(value) {
      this.data = value.data
      this.isValid = value.isValid
    },
    async saveUser() {
      await this.$store.dispatch('UserSettings/updateUser', {
        userId: this.userData.id,
        data: this.data,
      })
      this.$toast.success('Данные сохранены', { duration: 5000 })

      this.isChangeGeneralInfo = false
      this.isChangeCitiesInfo = false
    },
    getBrandPhoto(elem) {
      if (elem.e_client_files.length) {
        return elem.e_client_files[0].url
      }
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
    async changeFileData(value, code) {
      await this.$store.dispatch('getCurrentUserData')
    },
    removeFile(id) {
      const index = this.files.findIndex(elem => elem.data.id === id)
      if (index !== -1) {
        this.files.splice(index, 1)
        this.uploadedFiles = [...this.files]
      }
    },

  },
}

</script>


<style scoped lang="scss">
@import 'assets/styles/style';

.profile_container {
  font-family: 'Inter', sans-serif;
  display: flex;
  grid-column-gap: 20px;
  max-width: 1140px;
  margin-left: 0;
  margin-right: 0;
  .left_column_wrapper {
    max-width: 415px;
    width: 100%;
    .user_avatar_and_name {
      display: flex;
      grid-column-gap: 20px;
      margin-bottom: 30px;
      align-items: center;
      .user_avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        grid-column-gap: 20px;
        position: relative;
        height: 100px;
        width: 100px;
        .dropzone_style {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          border-radius: 50px;
          width: 100%;
          height: 100%;
          z-index: 9;
          background-color: #d9d9d9;
          opacity: 0;
          transition: $transition;
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }
        .avatar_style {
          position: absolute;
          z-index: 8;
          .empty_avatar {
            width: 100%;
            height: 100%;
            border-radius: 50px;
            background-color: #7D7D7D;
          }
        }

      }
      .user_info {
        .name {
          font-size: 1.25em;
          font-weight: 700;
        }
        .mail {
          color: #444444;
        }
      }
    }
    .v-tab {
      color: #000000 !important;
      display: flex;
      justify-content: flex-start;
      grid-column-gap: 10px;
      max-width: 300px;
    }
    .v-tab:before {
      border-radius: 30px;
      background-color: #777777;
    }
    .v-tab--active {
      border-radius: 30px;
      background: #FFFFFF;
      color: #000000;
    }
  }
  .right_column_wrapper {
    width: 100%;

    .v-tabs-items {
      background-color: #DFDFDF;
    }
    .tab_header {
      display: flex;
      grid-column-gap: 10px;
      margin-bottom: 20px;
      .header_name {
        font-size: 2em;
        font-weight: 500;
      }
    }
    .tab_sub_header {
      margin: 0 auto 20px auto;
    }

    .editable_general_info_wrapper {
      background-color: #FFFFFF;
      border-radius: 30px;
      width: 100%;
      .wrapper_title {
        font-size: 1.25em;
        font-weight: 600;
        padding: 20px 40px;
      }
      .telephone_input {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 40px;
        .input_style {
          width: auto;
          margin-left: 50px;
        }
      }
      .old_mail_container {
        display: flex;
        align-items: center;
        padding: 20px 40px;
        .container_text {
          margin-right: 50px;
        }
      }
    }
    .editable_brand_info_wrapper {
      background-color: #FFFFFF;
      border-radius: 30px;
      width: 100%;
      .add_brand_block {
        border-radius: 8px;
        padding-top: 20px;
      }
      .add_service_block {
        border-radius: 8px;
        padding-top: 20px;
        .service_card_style {
          padding: 0 20px !important;
        }
      }
      .brand_container {
        display: flex;
        padding: 16px 40px;
        align-items: center;
        justify-content: space-between;
      }
    }
    .save_btn {
      display: flex;
      margin: 20px auto;
    }

    .general_info_wrapper {
      background-color: #FFFFFF;
      border-radius: 30px;
      width: 100%;
      margin-bottom: 20px;
      .wrapper_title {
        font-size: 1.25em;
        font-weight: 600;
        padding: 20px 40px;
      }
      .table_info {
        padding: 0 20px;
        display: grid;
        .table_content {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          padding: 20px;
          .table_left_content_text {
            font-size: 0.875em;
            color: #777777;
          }
          .table_right_content_text {
            font-size: 1em !important;
          }
        }

      }
      .info_footer_wrapper {
        display: flex;
        justify-content: flex-end;
        .change_info_btn {
          display: flex;
          justify-content: center;
          margin: 20px 20px 20px auto;
          max-width: 170px;
          background-color: #d9d9d9;
          border-radius: 30px;
          cursor: pointer;
          .btn_text {
            padding: 10px 40px;
          }
        }
      }
    }
  }
}

</style>
