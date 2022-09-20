<template>
  <div class="subheader">
    <v-breadcrumbs :items="$store.state.breadcrumbs">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
export default {
  name: 'SubHeader',
  data: () => ({}),
  mounted() {},
  watch: {},
  computed: {},
  methods: {},
}
</script>

<style scoped lang="scss">
.subheader {
  max-width: 1160px;
  margin: 0 auto;
  width: 100%;
}
</style>
