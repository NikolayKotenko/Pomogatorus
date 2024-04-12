<template>
  <v-dialog
    v-model="$store.state.TaskModule.stateModal"
    class="modal"
    persistent
    width="850"
  >
    <Task/>
  </v-dialog>
<!--  <v-dialog -->
<!--    v-model="$store.state.TaskModule.stateModal" -->
<!--    class="modal" -->
<!--    persistent -->
<!--    width="850" -->
<!--  > -->
<!--    <template #activator="{ on, attrs }"> -->
<!--      <div -->
<!--        v-bind="attrs" -->
<!--        v-on="on" -->
<!--      > -->
<!--        <slot name="text"/> -->
<!--      </div> -->
<!--    </template> -->
<!--    <slot name="content"/> -->
<!--  </v-dialog> -->
</template>

<script>
import Task from '../Collaboration/Task.vue';

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
      selectedUserId: null
    };
  },
  created() {
    this.$on('add-user-to-task', userId =>{
      this.selectedUserId = userId
    })
  },
  methods: {
    // closeModal() {
    //   setStateModalByUrlHash('inviteUserModal', false);
    // },
    // openModal() {
    //   if (!this.$store.getters.stateAuth) {
    //     this.$store.commit('set_modal_auth', true);
    //     setStateModalByUrlHash('inviteUserModal', false);
    //     return false;
    //   }
    //   // TODO доделать когда будет разделение прав
    //   if (!this.$store.getters['Objects/getIdCurrentObject']) {
    //     setStateModalByUrlHash('createObjectModal', true);
    //     return false;
    //   }
    //
    //   setStateModalByUrlHash('inviteUserModal', true);
    // }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  min-height: 760px;
}
</style>
