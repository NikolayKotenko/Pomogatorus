<template>
  <v-container class="collaboration">
    <section class="header">
      <span class="header_title">
        Совместная работа над объектом "{{ $store.state.Objects.currentObject.name }}"
      </span>
      <SearchStyled
        :is-clearable="true"
        :is-custom-search-selections="true"
        :is-filled="true"
        :is-hide-selected="true"
        :is-item-text="'email'"
        :is-item-value="'id'"
        :is-items="$store.state.CollaborationModule.listMembers"
        :is-outlined="false"
        :is-placeholder="'Пригласить новых участников'"
        :is-rounded="true"
        class="invite_input"
        @update-search-input="localGetListUsers"
      />
    </section>

    <div v-if="$store.state.CollaborationModule.listSearchedMembers.length">
      <CardInviteUser
        v-for="(item, index) in $store.state.CollaborationModule.listSearchedMembers"
        :key="index"
        :user-object="item"
        class="invite_user"
      />
      <v-overlay
        :value="$store.state.CollaborationModule.isLoading"
        absolute
        class="overlay_style"
        color="#F2F2F2"
        opacity="100"
      >
        <v-progress-circular
          color="#95D7AE"
          indeterminate
          size="64"
        />
      </v-overlay>
    </div>
    <!--    <div v-if="$store.getters['CollaborationModule/getFilteredListByRoleExperts'].length"> -->
    <!--      <span class="category_user">Знакомые специалисты</span> -->
    <!--      <hr> -->
    <!--      <CardInviteUser -->
    <!--        v-for="(item, index) in $store.getters['CollaborationModule/getFilteredListByRoleExperts']" -->
    <!--        :key="index" -->
    <!--        :user-object="item" -->
    <!--        class="invite_user" -->
    <!--      /> -->
    <!--    </div> -->
    <div v-if="$store.getters['CollaborationModule/getFilteredListByRoleUsers'].length">
      <span class="category_user">Приглашенные пользователи</span>
      <hr>
      <CardInviteUser
        v-for="(item) in $store.getters['CollaborationModule/getFilteredListByRoleUsers']"
        :key="item.id"
        :user-object="item"
        class="invite_user"
      />
      <v-overlay
        :value="$store.state.CollaborationModule.isLoading"
        absolute
        class="overlay_style"
        color="#F2F2F2"
        opacity="100"
      >
        <v-progress-circular
          color="#95D7AE"
          indeterminate
          size="64"
        />
      </v-overlay>
    </div>
  </v-container>
</template>

<script>
import SearchStyled from "~/components/Common/SearchStyled";
import CardInviteUser from "~/components/Common/CardInviteUser";

export default {
  name: "Collaboration",
  components: {
    SearchStyled,
    CardInviteUser
  },
  data() {
    return {
      debounceTimeout: null
    };
  },
  async mounted() {
  },
  methods: {
    async localGetListUsers(phrase) {
      await this.$store.dispatch("CollaborationModule/getSearchedListMembers", phrase);

      if (phrase) return false;

      await this.$store.dispatch("CollaborationModule/getListMembersByFilter", { id_object: this.$store.getters["Objects/getIdCurrentObject"] });
    }

  }
};
</script>

<style lang="scss" scoped>
.collaboration {
  padding: 20px;
  //position: absolute;
  //top: 0;
  //right: 0;
  //z-index: 9999;
  background-color: white;
  overflow: auto;
  width: 1080px;
  max-height: 650px;
  box-shadow: -2px 2px 4px 0px rgba(0, 0, 0, 0.25), 2px 2px 4px 0px rgba(0, 0, 0, 0.25);


  .header {
    display: grid;
    grid-row-gap: 1em;
    width: 100%;
    grid-column-gap: 1em;
    margin-bottom: 2em;
    background-color: #FFFFFF;
    position: sticky;

    top: 0;
    z-index: 9;

    .header_title {
      font-size: 1.5em;
      font-weight: 700;
    }

    .invite_input {
    }

    color: #37392E !important;

    .v-input__slot {
      height: unset !important;
      min-height: unset !important;
    }
  }

  .invite_button {
    width: unset;
    min-width: unset;
    height: unset !important;
  }
}

.category_user {
  font-size: 1.13em;
}

.invite_user {
  margin-top: 20px;
}
</style>

