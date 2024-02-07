<template><v-container/></template>

<script>

export default {
  name: 'Index',
  components: {},
  methods: {
    openModal() {
      this.$store.commit('UserSettings/setListServices', []);

      this.$refs.inviteUserModal.openModal();
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
