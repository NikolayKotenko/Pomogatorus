<template>
  <v-container class="card_invite_user">
    <v-avatar color="primary" size="56"></v-avatar>
    <section class="main_info">
      <span class="name">Иванов иван</span>
      <section class="wrapper_role_email">
        <span class="role">Собственник</span>
        <v-icon>mdi-circle-small</v-icon>
        <span class="mail">emailcheito@ffd.kz</span>
      </section>
      <section class="wrapper_type_name_company">
        <span class="type">Компания</span>
        <span class="name">"Термодинамика"</span>
      </section>
    </section>
    <section class="access_rights">
      Полный доступ
      <v-icon>mdi-chevron-down</v-icon>
    </section>
  </v-container>
</template>

<script>
export default {
  name: "CardInviteUser"
};
</script>

<style lang="scss" scoped>
$grey-color: #857885;

.card_invite_user {
  display: inline-flex;
  grid-column-gap: 1em;
  align-items: center;
  width: 100%;

  .main_info {
    display: grid;

    .name {
    }

    .wrapper_role_email {
      display: inline-flex;

      .role {
        color: #F79256;
        font-weight: bold;
        font-size: 0.88em;
      }

      .mail {
        color: $grey-color;
        font-size: 0.88em;
      }
    }

    .wrapper_type_name_company {
      color: $grey-color;
      font-size: 0.88em;

      .type {
      }

      .name {
        font-weight: bold;
      }
    }
  }

  .access_rights {
    color: $grey-color;
    font-size: 0.88em;
    margin-left: auto;
  }
}
</style>
