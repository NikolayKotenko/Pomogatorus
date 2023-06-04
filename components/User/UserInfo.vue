<template>
  <div class="user_info_wrapper">
    <div class="user_info_title">
      <h3>{{ isLoggedIn ? "Настройки профиля" : "Авторизуйтесь" }}</h3>
      <v-icon large @click="closeDetail">
        mdi-close
      </v-icon>
    </div>

    <div class="card_object pt-5 pb-5">
      <div v-if="isLoggedIn" class="card_object_container">
        <UserFields
          @is-changed="setChanged"
          @new-data="setData"
        />
      </div>
      <LoginAuth v-else />
    </div>

    <div class="save_logout_btn">
      <template v-if="isMobile">
        <ButtonStyled
          :custom-slot="true"
          :disabled="!isValid"
          :is-mobile="true"
          :loading="isUpdating"
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
          :disabled="!isValid"
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
import { mapState } from "vuex";

import LoginAuth from "../frontLayouts/LoginAuth";
import ButtonStyled from "../Common/ButtonStyled.vue";
import UserFields from "./UserFields";

export default {
  name: "UserInfo",
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
      return this.$device.isMobile;
    }
  },
  methods: {
    closeDetail() {
      this.$emit("close-detail");
    },
    logout() {
      this.$store.dispatch("logout");
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
      this.$store.dispatch("updateUser", { userId: this.userData.id, data: this.data });
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1em;

    padding: 0 30px 5px 30px;
    margin-top: 5px;
    background: white;
    box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25);

    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;

    .saveLogoutBtn {
      width: 100%;
    }
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
