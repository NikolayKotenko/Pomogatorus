<template>
  <div class="new_object">
    <div class="details_new_object">
      <div class="object_name">
        <div class="object_name_title">
          <v-icon color="#000000" style="margin-right: 10px">
            mdi-plus-circle-outline
          </v-icon>
          <span>Создайте новый объект</span>
        </div>
        <VTextField
          v-model="newObjName"
          :loading="isLoadingObjects"
          auto-grow
          class="text_field"
          clearable
          dense
          hide-details
          label="Введите название объекта"
          no-resize
          row-height="1"
          solo
          @keyup.enter="onCreateNewObject"
        />
      </div>
    </div>
    <div class="new_object_button">
      <ButtonStyled
        :is-disabled="!newObjName"
        :is-loading="isLoadingObjects"
        :local-text="'Создать объект'"
        local-class="style_button"
        @click-button="onCreateNewObject"
      />
    </div>
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
  display: flex;
  padding: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25);
  transition: $transition !important;

  &:hover {
    box-shadow: 0px 5px 20px 7px rgba(34, 60, 80, 0.2) !important;
    background-color: #FFF4CB;
  }

  .img {
    .empty_placeholder {
      background-color: #D9D9D9;
      min-width: 250px;
      min-height: 160px;
      margin-right: 20px;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #FFFFFF;
      font-size: 1.3em;
    }
  }

  .details_new_object {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .object_name {
      width: 100%;
      font-size: 1.5em;
      font-weight: 400;

      .object_name_title {
        display: flex;
        align-items: center;
      }

      .text_field {
        margin-top: 1em;
      }
    }

    .object_address {
      display: flex;
      align-items: flex-end;
      width: 100%;
    }

  }

  .new_object_button {
    display: flex;
    align-items: flex-end;
    margin-left: 20px;
  }
}

@media (max-width: 768px) {

  .new_object {
    flex-direction: column;
    row-gap: 1rem;

    .new_object_button {
      margin-left: 0;
      justify-content: center;
    }
  }
}
</style>
