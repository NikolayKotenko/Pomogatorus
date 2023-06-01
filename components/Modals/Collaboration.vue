<template>
  <v-container class="collaboration">
    <section class="header">
      <SearchStyled
        class="invite_input"
        :is-placeholder="'Пригласить новый участников'"
        :is-filled="true"
        :is-rounded="true"
        :is-outlined="false"
        :is-loading="$store.state.CollaborationModule.isLoading"
        :is-items="$store.state.CollaborationModule.listUsers"
        :is-clearable="true"
        :is-item-text="'text'"
        :is-item-value="'text'"
        @update-search-input="setEmail"
      />
      <!--      <ButtonStyled -->
      <!--        local-text="Пригласить" -->
      <!--        local-class="invite_button style_button" -->
      <!--      /> -->
    </section>

    <span class="category_user">Приглашенные эксперты</span><hr>
    <CardInviteUser/>

    <span class="category_user">Приглашенные пользователи</span><hr>
    <CardInviteUser/>
  </v-container>
</template>

<script>
import InputStyled from '../Common/InputStyled'
import ButtonStyled from '~/components/Common/ButtonStyled';
import SearchStyled from '~/components/Common/SearchStyled';
import CardInviteUser from '~/components/Common/CardInviteUser';

export default {
  name: 'Collaboration',
  components: {
    SearchStyled,
    ButtonStyled,
    InputStyled,
    CardInviteUser
  },
  methods:{
    setEmail(string){

    }
  }
};
</script>

<style lang="scss" scoped>
.collaboration{
  padding: 15px;
  //position: absolute;
  //top: 0;
  //right: 0;
  //z-index: 9999;
  background: white;
  width: 900px;
  max-height: 650px;

  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);

  .header{
    display: inline-flex;
    width: 100%;
    grid-column-gap: 1em;
    margin-bottom: 2em;

    .invite_input{
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
}
</style>
