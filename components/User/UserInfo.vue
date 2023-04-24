<template>
  <div class="modal_wrapper">
    <div class="card_title d-flex justify-space-between align-center mb-4">
      <h3>Настройки профиля</h3>
      <VIcon large @click="closeDetail">
        mdi-close
      </VIcon>
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

    <div class="modal_footer pa-5">
      <Transition mode="out-in" name="fade">
        <VBtn
          v-if="isChanged"
          :disabled="!isValid"
          :loading="isUpdating"
          class="mb-2"
          color="success"
          @click="saveUser"
        >
          Сохранить
        </VBtn>
      </Transition>
      <div v-if="isLoggedIn" class="modal_footer__new">
        <VDivider/>
        <VBtn
          block
          color="primary"
          @click="logout"
        >
          Выйти
        </VBtn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import LoginAuth from '../frontLayouts/LoginAuth'
import UserFields from './UserFields'

export default {
  name: 'UserInfo',
  components: {
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
      return this.userData && Object.keys(this.userData).length
    }
  },
  methods: {
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
    saveUser() {
      this.$store.dispatch('updateUser', { userId: this.userData.id, data: this.data })
    }
  }
}
</script>

<style lang='scss' scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>
