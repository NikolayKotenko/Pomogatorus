<template>
  <v-alert
    outlined
    text
    type="warning"
  >
    Функционал в разработке
  </v-alert>
</template>

<script>
export default {
  name: 'UpcomingAlert'
}
</script>

<style lang='scss' scoped>
.v-alert {

  min-height: 100px !important;
  display: flex !important;
  align-items: center !important;
}

::v-deep .v-icon {
  font-size: 48px !important;
}

::v-deep .v-alert__content {
  font-size: 1.5rem !important;
}
</style>
