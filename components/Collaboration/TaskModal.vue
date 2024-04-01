<template>
  <v-dialog
    v-model="showModal"
    class="modal"
    persistent
    width="850"
  >
    <Task
      :get-services-tethered-by-user-object="getServicesTetheredByUserObject"
      :get-state-tethered-user-in-object="getStateTetheredUserInObject"
      :user-id="userId"
      @close-modal="closeModal"
    />
  </v-dialog>
</template>

<script>
import Task from '../Collaboration/Task.vue';
import { setStateModalByUrlHash } from '~/helpers/urlHelper';

export default {
  name: 'TaskModal',
  components: {
    Task
  },
  props: {
    getStateTetheredUserInObject: {
      type: Boolean,
      default: false
    },
    listServicesAvailableToAdd: {
      type: Array,
      default: () => ([])
    },
    getServicesTetheredByUserObject: {
      type: Array,
      default: () => ([])
    },
    userId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      showModal: false,
      selectedUserId: null
    };
  },
  created() {
    this.$on('add-user-to-task', userId =>{
      this.selectedUserId = userId
    })
  },
  methods: {
    closeModal() {
      this.showModal = false;
      setStateModalByUrlHash('inviteUserModal', false);
    },
    openModal() {
      if (!this.$store.getters.stateAuth) {
        this.$store.commit('set_modal_auth', true);
        setStateModalByUrlHash('inviteUserModal', false);
        return false;
      }
      // TODO доделать когда будет разделение прав
      if (!this.$store.getters['Objects/getIdCurrentObject']) {
        setStateModalByUrlHash('createObjectModal', true);
        return false;
      }

      this.showModal = true;
      setStateModalByUrlHash('inviteUserModal', true);
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  min-height: 760px;
}
</style>
