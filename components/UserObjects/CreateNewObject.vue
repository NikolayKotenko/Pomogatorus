<template>
  <div class="new_object">
    <span class="object_name_title">Создать новый объект</span>
    <v-text-field
      v-model="newObjName"
      auto-grow
      outlined
      class="text_field"
      clearable
      dense
      hide-details
      label="Новый объект"
      no-resize
      row-height="1"
      @keyup.enter="onCreateNewObject"
    />
    <ButtonStyled
      :is-disabled="!newObjName"
      :is-loading="isLoadingObjects"
      :local-text="'Создать'"
      local-class="new_style_button"
      @click-button="onCreateNewObject"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ButtonStyled from '../Common/ButtonStyled.vue';


export default {
  name: 'CreateNewObject',
  components: { ButtonStyled },
  data: () => ({
    newObjAddress: '',
    newObjName: ''
  }),
  computed: {
    ...mapState('Objects', ['listObjects', 'isLoadingObjects'])
  },
  methods: {
    ...mapActions('Objects', ['createNewObject', 'getListObjectsByUserId']),

    async onCreateNewObject() {
      this.$toast.success('Объект создан', { duration: 5000 });
      await this.createNewObject({
        address: this.newObjAddress,
        name: this.newObjName
      });
      this.newObjAddress = '';

      await this.getListObjectsByUserId();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.new_object {
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 890px;
  width: 100%;
  padding: 20px 40px;
  border-radius: 30px;
  background-color: #FFFFFF;
  box-shadow: 0px -10px 15px 0px rgba(0, 0, 0, 0.25), 0px 10px 15px 0px rgba(0, 0, 0, 0.25);
  transition: $transition !important;
  .object_name_title {
    font-size: 1.25em;
  }
  .text_field {
    max-width: 430px;
    border-radius: 8px;
  }
}
</style>
