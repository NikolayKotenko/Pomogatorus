<template>
  <v-dialog
    v-model='showModal'
    width='1080'
  >
    <v-card>
      <v-card-title class='d-flex justify-end'>
        <v-icon @click='closeModal'>mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <LoginAuth @closeModal='closeModal' />
      </v-card-text>
      <v-card-actions class='d-flex justify-center'>
        <v-btn
          color='primary'
          text
          @click='closeModal'
        >
          Закрыть
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import LoginAuth from '../frontLayouts/LoginAuth'

export default {
  name: 'AuthModal',
  components: { LoginAuth },
  data: () => ({
    showModal: false
  }),
  methods: {
    openModal() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    }
  }
}
</script>

<style scoped>

</style>
