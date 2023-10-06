<template>
  <v-dialog
    v-model="showModal"
    width="600"
  >
    <v-card class="application_card">
      <template v-if="!getStateTetheredUserInObject">
        <div class="application_header">
          <span class="header_title">Составление заявки</span>
          <v-icon large @click="closeModal">
            mdi-close
          </v-icon>
        </div>

        <!-- Блок с пользователями. -->
        <div class="info_wrapper">
          <span class="info_title">Пригласить пользователя: </span>
          <!-- v-for usersArray  -->

          <li class="info_text">
            {{ getValueField(userObject.middle_name) + ' ' + getValueField(userObject.first_name) + ' ' + getValueField(userObject.last_name) }}
          </li>
        </div>
      </template>
      <template v-else>
        <div class="application_header">
          <span class="header_title">Просмотр заявки</span>
          <v-icon large @click="closeModal">
            mdi-close
          </v-icon>
        </div>
        <div class="info_wrapper">
          <span class="info_title">Редактирование услуг пользователя: </span>
          <li class="info_text">
            {{ getValueField(userObject.middle_name) + ' ' + getValueField(userObject.first_name) + ' ' + getValueField(userObject.last_name) }}
          </li>
        </div>
      </template>
      <div class="services_table">
        <div class="info_wrapper">
          <span class="info_title">Услуги: </span>
          <!-- TODO: v props -->
          <div
            v-for="(item, index) in getServicesTetheredByUserObject"
            :key="index"
            class="services_table_elem"
          >
            <li>{{ getValueField(item.name) }}</li>
            <div class="services_table_buttons">
              <v-text-field
                outlined
                color="#000000"
                type="number"
              />
              <v-dialog
                v-model="showDeleteOneServiceModal"
                width="600"
              >
                <template #activator="{ on, attrs }">
                  <TooltipStyled :title="'Удалить услугу'">
                    <v-icon
                      size="30"
                      color="#000000"
                      v-bind="attrs"
                      v-on="on"
                      @click="showDeleteOneServiceModal = true"
                    >
                      mdi-delete-outline
                    </v-icon>
                  </TooltipStyled>
                </template>
                <v-card class="application_card">
                  <div class="application_header">
                    <span class="header_title">Удаление услуги</span>
                    <v-icon large @click="showDeleteOneServiceModal = false">
                      mdi-close
                    </v-icon>
                  </div>
                  <span>Вы действительно хотите удалить услугу "{{ getValueField(item.name) }}" у пользователя
                    {{ getValueField(userObject.middle_name) + ' ' + getValueField(userObject.first_name) }}?
                  </span>
                  <div class="services_buttons">
                    <div @click="localDeleteOneServiceUserByObject(item.id)">
                      <ButtonStyled
                        :local-text="'Подтвердить'"
                        :local-class="'invite_button style_button'"
                        :is-loading="$store.state.CollaborationModule.isLoading"
                      />
                    </div>
                    <div
                      @click="toggleDeleteService(false)"
                    >
                      <ButtonStyled
                        :local-text="'Отмена'"
                        :local-class="'style_close'"
                      />
                    </div>
                  </div>
                </v-card>
              </v-dialog>
            </div>
          </div>
        </div>
        <div
          class="add_services"
        >
          <TooltipStyled
            :is-top="true"
            :title="'Добавить услугу'"
          >
            <v-icon
              size="20"
              @click="sendApplication"
            >
              mdi-plus-circle-outline
            </v-icon>
          </TooltipStyled>
          <v-combobox
            :items="userObject.services"
            :item-text="'name'"
            :item-value="'id'"
            clearable
            label="Выберите услуги"
            outlined
            placeholder="Выберите услуги"
            return-object
            solo
            @change="setSelectedServicesIdsLocal"
          />
        </div>
      </div>


      <!-- Блок с примечанием. -->
      <div class="info_wrapper">
        <span class="info_title">Примечание: </span>
        <div class="textarea_style">
          <v-textarea
            outlined
            label="Введите примечание"
            color="#000000"
            clearable
          />
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import ButtonStyled from '../Common/ButtonStyled.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import SelectStyled from '../Common/SelectStyled.vue';
export default {
  name: 'InviteUserModal',
  components: {
    TooltipStyled,
    ButtonStyled,
    SelectStyled,
  },
  props: {
    getStateTetheredUserInObject: {
      type: Boolean,
      default: false
    },
    userObject:{
      type: Object,
      required: true,
      default: () => ({})
    },
    getServicesTetheredByUserObject: {
      type: Array,
      required: true,
      default: () => ([])
    },
    currentTask: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showModal: false,
      showDeleteOneServiceModal: false,

      taskData: {
      'id': '', // tolko esli ezhe sozdannaya
      'ids_users': [], // cherez selector userov
      'id_object': '', // currentObject
      'services': [], // structura iz helpService
      'notes': '', // textarea
      'status': 'request',
      },
      helpService: [
        {
          'id_service': 136, // berem iz selectora
          'id_nomenclature': 55, // Yznat otkyda mi eto berem
          'price': '300', // iz selectora
          'quantity': 4 // nakidyvat 4erez interface
        },
        {
          'id_service': 2,
          'id_nomenclature': 77,
          'price': '600',
          'quantity': 5
        }
      ]
    }
  },
  mounted() {
    if (this.currentTask) {
      this.taskData = this.currentTask
    }
  },
  methods: {
    getValueField(str) {
      return (str) || ''
    },

    toggleDeleteService(value){
      // TODO: Ybrat vse showDeleteOneServiceModal iz template i podstaviit nash method
      this.showDeleteOneServiceModal = value
    },
    closeModal() {
      this.showModal = false
    },
    openModal() {
      this.showModal = true
    },

    setSelectedServicesIdsLocal() {

    },
    sendApplication() {},

    async localDeleteOneServiceUserByObject(idService) {
      let response = null;

      response = await this.$store.dispatch(
        'CollaborationModule/deleteServiceUserByObject',
        {
          id_user: this.userObject.id,
          id_object: this.$store.getters['Objects/getIdCurrentObject'],
          id_services: idService,
        })

      if (! response) return false;

      if (response.codeResponse >= 400) return false;

      this.showDeleteOneServiceModal = false
      this.$toast.success('Услуга удалена',{ duration: 5000 })
    },
  },
}
</script>

<style lang="scss" scoped>
.application_card {
  width: 600px;
  display: grid;
  grid-row-gap: 20px;
  padding: 20px;
  .application_header {
    display: flex;
    justify-content: space-between;
    .header_title {
      font-size: 1.3em;
      font-weight: 600;
    }
  }
  .info_wrapper {
    display: grid;
    grid-row-gap: 10px;
    .info_title{
      font-weight: 600;
    }
  }
  .services_table{
    display: grid;
    grid-row-gap: 1em;
    .services_table_elem{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .services_table_buttons{
        display: flex;
        align-items: center;
        grid-column-gap: 1em;
      }
    }
    .add_services{
      display: flex;
    }
  }
  .services_select {
    padding: 20px 0;
  }
  .services_buttons {
    display: flex;
    justify-content: space-between;
  }
}
</style>
