<template>
  <v-dialog
    v-model="showModal"
    width="1080"
  >
    <v-card>
      <v-card-title class="d-flex justify-end">
        <v-icon @click="closeModal">
          mdi-close
        </v-icon>
      </v-card-title>
      <v-card-text>
        <CreateNewObject/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { setStateModalByUrlHash } from '~/helpers/urlHelper';
import CreateNewObject from '~/components/UserObjects/CreateNewObject';

export default {
  name: 'CreateObjectModal',
  components: { CreateNewObject },
  data: () => ({
    showModal: false
  }),
  methods: {
    openModal() {
      this.showModal = true;
      setStateModalByUrlHash('createObjectModal', true);
    },
    closeModal() {
      this.showModal = false;
      setStateModalByUrlHash('createObjectModal', false);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
