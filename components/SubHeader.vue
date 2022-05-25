<template>
  <div class="subheader">
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
export default {
  name: "SubHeader",
  data: () => ({
    items: [
      {
        text: 'Главная',
        disabled: false,
        href: 'breadcrumbs_dashboard',
      },
      {
        text: 'Статьи',
        disabled: false,
        href: 'breadcrumbs_link_1',
      },
      {
        text: 'Статья #1',
        disabled: true,
        href: 'breadcrumbs_link_2',
      },
    ],
  }),
}
</script>

<style scoped lang="scss">
.subheader {
  max-width: 1160px;
  margin: 0 auto;
  width: 100%;
}
</style>
