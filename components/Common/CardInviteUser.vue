<template>
  <v-container class="card_invite_user">
    <v-avatar color="primary" size="50">
      <span class="white--text text-h5">CJ</span>
    </v-avatar>
    <div class="user_info">
      <section class="main_info">
        <span class="name">{{ lastName + ' ' + name }}</span>
        <section class="wrapper_role_email">
          <span class="role">Собственник</span>
          <v-icon>mdi-circle-small</v-icon>
          <span class="mail">{{ userEmail }}</span>
        </section>
      </section>
      <section class="wrapper_user_specialization">
        <section class="user_service">
          <span class="type">Роль участника: </span>
          <span class="name">Монтажник</span>
        </section>
        <section class="user_company">
          <span class="type">Компания: </span>
          <span class="name">"Термодинамика"</span>
        </section>
      </section>
      <section
        v-if="SearchStyled"
        class="access_rights"
      >
        <SelectStyled
          class="access_style"
          :item-text="'access'"
          :items="userAccess"
          :is-solo="true"
        />
      </section>
      <section
        v-if="!SearchStyled"
        class="invite_right"
      >
        <ButtonStyled
          :local-text="'Пригласить'"
          :local-class="'invite_button style_button'"
        />
      </section>
    </div>
  </v-container>
</template>

<script>
import SelectStyled from './SelectStyled.vue';
import SearchStyled from './SearchStyled.vue';
import ButtonStyled from './ButtonStyled.vue';

export default {
  name: 'CardInviteUser',
  components: { ButtonStyled, SelectStyled },
  data() {
    return {
      userAccess: [
        { access: 'Полный доступ',value: 1 },
        { access: 'Может редактировать',value: 2 },
        { access: 'Может комментировать',value: 3 },
        { access: 'Может смотреть',value: 4 },
      ],
      lastName: 'Иванов',
      name: 'Иван',
      userEmail: 'emailcheito@ffd.kz',

    }
  },
  computed: {
    SearchStyled() {
      return SearchStyled
    }
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
$grey-color: #857885;
$orange-color: #F79256;

.card_invite_user {
  display: inline-flex;
  grid-column-gap: 1em;
  align-items: center;
  width: 100%;

  border-radius: 5px;
  transition: all 0.4s ease-in-out;
  &:hover {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }

  .user_info{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    width: 100%;
    align-items: center;
    .main_info {
      display: grid;

      .name {
      }

      .wrapper_role_email {
        display: inline-flex;

        .role {
          color: $orange-color;
          font-weight: bold;
          font-size: 0.88em;
        }

        .mail {
          color: $grey-color;
          font-size: 0.88em;
        }
      }

    }
    .wrapper_user_specialization {
      color: $grey-color;
      font-size: 0.88em;
      margin-left: 3em;

      .type {
        color: $orange-color;
        font-weight: bold;
      }

      .name {

      }
    }
    .access_rights{
      margin-left: auto;
      .access_style{
        color: $grey-color !important;
        font-size: 0.88em;
        width: 230px;
      }
    }
    .invite_right{
      margin-left: auto;
    }
  }
}
</style>
