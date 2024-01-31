<template>
  <v-dialog
    v-model="showModal"
    class="modal"
    width="850"
    persistent
  >
    <Task
      :user-object="userObject"
      :get-services-tethered-by-user-object="getServicesTetheredByUserObject"
      :get-state-tethered-user-in-object="getStateTetheredUserInObject"
      @close-modal="closeModal"
    />
  </v-dialog>
</template>

<script>
import Task from '../Collaboration/Task.vue'

export default {
  name: 'TaskModal',
  components: {
    Task,
  },
  props: {
    getStateTetheredUserInObject: {
      type: Boolean,
      default: false
    },
    userObject:{
      type: Object,
      required: true,
      default: () => ({})
    },
    getServicesTetheredByUserObject: {
      type: Array,
      required: true,
      default: () => ([])
    },
  },
  data() {
    return {
      showModal: false,
    }
  },
  methods: {
    closeModal() {
      this.showModal = false
    },

    openModal() {
      this.showModal = true
    },
  }
} 
</script>

<style lang="scss" scoped>

</style>
