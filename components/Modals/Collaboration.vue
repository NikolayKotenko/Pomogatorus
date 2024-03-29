<template>
  <v-container class="collaboration">
    <section class="header">
      <span class="header_title">
        Ваши специалисты
      </span>
      <SearchStyled
        :is-clearable="true"
        :is-custom-search-selections="true"
        :is-filled="true"
        :is-hide-selected="true"
        :is-item-text="'email'"
        :is-item-value="'id'"
        :is-items="$store.state.CollaborationModule.listAllUsers"
        :is-outlined="false"
        :is-placeholder="'Поиск специалистов'"
        :is-rounded="true"
        class="invite_input"
      />
    </section>

    <v-tabs
      color="black"
      grow
    >
      <v-tab :key="0">
        Избранные специалисты
        <v-badge
          :value="$store.getters['CollaborationModule/getCountFavoriteUsers']"
          :content="$store.getters['CollaborationModule/getCountFavoriteUsers']"
          color="#95D7AE"
        />
      </v-tab>
      <v-tab :key="1">
        Приглашенные специалисты
      </v-tab>
      <v-tab-item :key="0">
        <FavoriteUserCard
          v-for="(item, index) in $store.state.CollaborationModule.listFavoriteUsers"
          :key="index"
          :user-object="item"
        />
      </v-tab-item>
      <v-tab-item :key="1"/>
    </v-tabs>
  </v-container>
</template>

<script>
import FavoriteUserCard from '../People/FavoriteUserCard.vue'
import SearchStyled from '~/components/Common/SearchStyled';
import CardInviteUser from '~/components/Common/CardInviteUser';

export default {
  name: 'Collaboration',
  components: {
    FavoriteUserCard,
    SearchStyled,
    CardInviteUser
  },
  data() {
    return {
      debounceTimeout: null
    };
  },
  async mounted() {
    await this.$store.dispatch('CollaborationModule/getListFavoriteUsers')
    await this.$store.dispatch('CollaborationModule/getListAllUsers')
  },
  methods: {
    // async localGetListUsers(phrase) {
    //   await this.$store.dispatch('CollaborationModule/getSearchedListMembers', phrase);
    //
    //   if (phrase) return false;
    //
    //   await this.$store.dispatch('CollaborationModule/getListMembersByFilter', { id_object: this.$store.getters['Objects/getIdCurrentObject'] });
    // }

  }
};
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.collaboration {
  padding: 20px;
  //position: absolute;
  //top: 0;
  //right: 0;
  //z-index: 9999;
  background-color: white;
  overflow: auto;
  width: 740px;
  max-height: 840px;
  box-shadow: $shadowBox;


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

