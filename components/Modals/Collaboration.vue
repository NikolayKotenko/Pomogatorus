<template>
  <v-container class="collaboration">
    <section class="header">
      <SearchStyled
        class="invite_input"
        :is-placeholder="'Пригласить новый участников'"
        :is-filled="true"
        :is-rounded="true"
        :is-outlined="false"
        :is-custom-search-selections="true"
        :is-loading="$store.state.CollaborationModule.isLoading"
        :is-items="$store.state.CollaborationModule.listSearchedUsers"
        :is-clearable="true"
        :is-item-text="'email'"
        :is-item-value="'id'"
        @update-search-input="localGetListUsers"
      />
    </section>

    <span class="category_user">Приглашенные эксперты</span><hr>
    <CardInviteUser
      v-for="(item, index) in $store.getters['CollaborationModule/getFilteredListByRoleExperts']"
      :key="index"
      :user-object="item"
    />
    <span class="category_user">Приглашенные пользователи</span><hr>
    <CardInviteUser
      v-for="(item) in $store.getters['CollaborationModule/getFilteredListByRoleUsers']"
      :key="item.id"
      :user-object="item"
    />
  </v-container>
</template>

<script>
import InputStyled from '../Common/InputStyled'
import Header from '../Header.vue';
import ButtonStyled from '~/components/Common/ButtonStyled';
import SearchStyled from '~/components/Common/SearchStyled';
import CardInviteUser from '~/components/Common/CardInviteUser';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Collaboration',
  components: {
    SearchStyled,
    CardInviteUser
  },
  data() {
    return {
      debounceTimeout: null,
    }
  },
  async mounted() {
    await this.$store.dispatch('CollaborationModule/getListTetheredUsers');
  },
  methods:{
    localGetListUsers(){
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);

      this.debounceTimeout = setTimeout(async () => {
        await this.$store.dispatch('CollaborationModule/getListSearchedUsers')
      }, 2000);
    },

  },
};
</script>

<style lang="scss" scoped>
.collaboration{
  padding: 15px;
  //position: absolute;
  //top: 0;
  //right: 0;
  //z-index: 9999;
  background-color: white;
  overflow: auto;
  width: 900px;
  max-height: 650px;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);


  .header{
    display: inline-flex;
    width: 100%;
    grid-column-gap: 1em;
    margin-bottom: 2em;


    .invite_input{
      }
        color: #37392E!important;
      .v-input__slot{
        height: unset!important;
        min-height: unset!important;
      }
    }
    .invite_button{
      width: unset;
      min-width: unset;
      height: unset!important;
    }
  }

  .category_user{
    font-size: 1.13em;
  }
</style>

