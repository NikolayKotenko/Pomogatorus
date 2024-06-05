<template>
  <v-container class="profile_container">
    <div class="left_column_wrapper">
      <div class="user_avatar">
        <v-avatar size="100">
          <v-img
            src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"
          />
        </v-avatar>
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
            <div v-if="isChange" class="header_name">
              Изменить информацию
            </div>
            <div v-else class="header_name">
              Ваша информация
            </div>
          </div>
          <div v-if="!isChange" class="tab_sub_header">
            Редактируйте общую информацию о себе
          </div>

          <!-- Если isChange = true, редактируемые поля -->
          <div v-if="isChange" class="editable_general_info_wrapper">
            <UserFields @is-changed="setChanged" @new-data="setData"/>
          </div>
          <ButtonStyled
            v-if="isLoggedIn && isChange === true "
            :is-loading="isUpdating"
            :local-text="'Сохранить'"
            :elevation="0"
            class="save_btn"
            local-class="style_save_button"
            @click-button="saveUser"
          />


          <!-- Если isChange = false, нередактируемые поля -->
          <div v-else class="general_info_wrapper">
            <div class="wrapper_title">
              Общая информация
            </div>
            <v-divider style="border-color: #DDDDDD;"/>
            <v-simple-table class="table_info" disabled>
              <tbody>
                <tr class="table_content">
                  <td>Фамилия</td>
                  <td class="table_right_content_text">
                    {{ userData.middle_name }}
                  </td>
                </tr>
                <tr class="table_content">
                  <td>Имя</td>
                  <td class="table_right_content">
                    {{ userData.first_name }}
                  </td>
                </tr>
                <tr class="table_content">
                  <td>Отчество</td>
                  <td class="table_right_content">
                    {{ userData.last_name }}
                  </td>
                </tr>
                <tr class="table_content">
                  <td>Вид деятельности</td>
                  <td class="table_right_content">
                    -
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
            <v-divider style="border-color: #DDDDDD;"/>
            <div class="info_footer_wrapper">
              <div class="change_info_btn" @click="isChange = true">
                <span class="btn_text">изменить</span>
              </div>
            </div>
          </div>
        </v-tab-item>
        <v-tab-item :key="1">
          <div class="tab_header">
            <v-divider vertical style="border-width: 3px; border-color: #000000;"/>
            <div class="header_name">
              Информация специалиста
            </div>
          </div>
          <div class="tab_sub_header">
            Редактируйте вашу информацию как специалиста
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
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import UserFields from '../../components/User/UserFields.vue'
import ButtonStyled from '../../components/Common/ButtonStyled.vue'

export default {
  components: { ButtonStyled, UserFields },
  data () {
    return {
      tab: null,
      isChange: false,
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
    }
  },
  computed: {
    ...mapState({
      userData: state => state.AuthModule.userData,
      isUpdating: (state) => state.UserSettings.isUpdating,
      defaultUserData: state => state.AuthModule.defaultUserData
    }),
    isLoggedIn() {
      return this.userData && Object.keys(this.userData).length
    },
  },
  watch: {
  },
  mounted() {
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
      await this.$store.dispatch('UserSettings/updateUser', {
        userId: this.userData.id,
        data: this.data,
      })
      this.$toast.success('Данные сохранены', { duration: 5000 })

      this.isChange = false
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
  .left_column_wrapper {
    max-width: 415px;
    width: 100%;
    .user_avatar {
      display: flex;
      align-items: center;
      grid-column-gap: 20px;
      margin-bottom: 30px;
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
    }
    .save_btn {
      display: flex;
      margin: 20px auto;
    }

    .general_info_wrapper {
      background-color: #FFFFFF;
      border-radius: 30px;
      width: 100%;
      .wrapper_title {
        font-size: 1.25em;
        font-weight: 600;
        padding: 20px 40px;
      }
      .table_info {
        padding: 0 20px;
        .table_content {
          &:hover {
            background: #FFFFFF !important;
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
