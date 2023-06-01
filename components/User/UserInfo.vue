<template>
  <div class="user_info_wrapper">
    <div class="user_info_title">
      <h3>{{ isLoggedIn ? "Настройки профиля" : "Авторизуйтесь" }}</h3>
      <v-icon large @click="closeDetail">
        mdi-close
      </v-icon>
    </div>

    <div class="card_object flex-grow-1 flex-shrink-1 pa-5">
      <div v-if="isLoggedIn" class="card_object_container">
        <UserFields
          @is-changed="setChanged"
          @new-data="setData"
        />
      </div>
      <LoginAuth v-else/>
    </div>

    <div class="save_logout_btn">
      <template v-if="isMobile">
        <div @click="saveUser">
          <ButtonStyled
            :custom-slot="true"
            :is-mobile="true"
            local-class="style_button"
            :disabled="!isValid"
            :loading="isUpdating"
          >
            <v-icon>mdi-content-save-outline</v-icon>
          </ButtonStyled>
        </div>
        <div
          v-if="isLoggedIn"
          @click="logout"
        >
          <ButtonStyled
            :custom-slot="true"
            :is-mobile="true"
            local-class="style_close"
          >
            <v-icon>mdi-exit-to-app</v-icon>
          </ButtonStyled>
        </div>
      </template>
      <template v-else>
        <div @click="saveUser">
          <ButtonStyled
            :local-text="'Сохранить изменения'"
            local-class="style_button"
            :disabled="!isValid"
            :loading="isUpdating"
          />
        </div>
        <div
          v-if="isLoggedIn"
          @click="logout"
        >
          <ButtonStyled
            :local-text="'Выйти'"
            local-class="style_close"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import LoginAuth from '../frontLayouts/LoginAuth';
import ButtonStyled from '../Common/ButtonStyled.vue';
import UserFields from './UserFields';

export default {
  name: 'UserInfo',
  components: {
    ButtonStyled,
    UserFields,
    LoginAuth
  },
  data: () => ({
    isChanged: false,
    data: {},
    isValid: false
  }),
  computed: {
    ...mapState({
      isUpdating: state => state.UserSettings.isUpdating,
      userData: state => state.AuthModule.userData
    }),

    isLoggedIn() {
      return this.userData && Object.keys(this.userData).length;
    },
    isMobile() {
      return this.$device.isMobile
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
    saveUser() {
      this.$store.dispatch('updateUser', { userId: this.userData.id, data: this.data });
    }
  }
};
</script>

<style lang="scss" scoped>
.user_info_wrapper {
  height: 100%;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;

  .user_info_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .save_logout_btn {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
  }
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>
