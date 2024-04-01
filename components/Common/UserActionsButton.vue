<template>
  <div class="action_menu">
    <div
      class="menu_elem"
      @click="addUserToTask(userObject.id)"
    >
      Пригласить на объект
    </div>
    <div
      class="menu_elem"
      @click="addOrDeleteFavoritesUser(userObject.id)"
    >
      {{ ! stateCurrentUser ? 'Добавить в избранные специалисты' : 'Убрать из избранных специалистов' }}
    </div>
    <div class="menu_elem">
      Не рекомедовать этого пользователя
    </div>
    <TaskModal
      ref="inviteUserModal"
      :get-services-tethered-by-user-object="
        getServicesTetheredByUserObject
      "
      :get-state-tethered-user-in-object="getStateTetheredUserInObject"
      :list-services-available-to-add="userObject.services"
      :user-id="userObject.id"
    />
  </div>
</template>

<script>
import TaskModal from '../Collaboration/TaskModal.vue';
export default {
  name: 'PeopleCard',
  components: { TaskModal },
  props: {
    userObject: {
      type: Object,
      default: () => {},
      required: true,
    }
  },
  computed: {
    stateCurrentUser() {
      return this.$store.state.CollaborationModule.listFavoriteUsers.some((elem) => {
        return elem.id_favorite_user === this.userObject.id
      })
    },

  },
  methods: {
    addOrDeleteFavoritesUser(favoriteUserId) {
      ! this.stateCurrentUser
        ? this.$store.dispatch('CollaborationModule/addUserToFavoriteUsers', favoriteUserId)
        : this.$store.dispatch('CollaborationModule/deleteFavoriteUser', favoriteUserId)
    },
    addUserToTask(userId) {
      this.$refs.inviteUserModal.openModal()
      this.$emit('add-user-to-task', userId)
    }
  }

}
</script>


<style scoped lang="scss">
@import 'assets/styles/style';

.action_menu {
  padding: 10px;
  display: grid;
  grid-row-gap: 5px;
  border-radius: 5px;
  border: 1px solid #FFDB58;
  background-color: $background-element-color;
  .menu_elem {
    width: 100%;
    cursor: pointer;
    transition: $transition;
    &:hover {
      background-color: #dadada;
    }
  }
}
</style>
