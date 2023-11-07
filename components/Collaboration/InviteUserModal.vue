<template>
  <v-dialog
    v-model="showModal"
    width="760"
    persistent
  >
    <v-card class="application_card">
      <template v-if="!getStateTetheredUserInObject">
        <div class="application_header">
          <span class="header_title">Составление заявки</span>
          <v-icon large @click="closeModal">
            mdi-close
          </v-icon>
        </div>
      </template>

      <!-- Блок с услугами. -->
      <div class="services_table">
        <div class="info_wrapper">
          <span class="info_title">Услуги: </span>
          <div class="service_card_wrapper">
            <ServiceCard
              v-for="(item, index) in taskData.services"
              :key="index"
              :service-object="item"
              @delete-one-service="deleteOneService(index)"
              @update-price-field="setPrice(index, $event)"
            />
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
              color="#95D7AE"
              size="34"
              @click="addService"
            >
              mdi-plus-circle-outline
            </v-icon>
          </TooltipStyled>
          <v-combobox
            :items="userObject.services"
            :item-text="'name'"
            :item-value="'id'"
            :hide-details="true"
            hide-selected
            class="search_service"
            clearable
            label="Добавить услугу"
            outlined
            placeholder="Добавить услугу"
            return-object
            solo
            @change="setSelectedServicesIdsLocal"
          />
        </div>
      </div>

      <!-- Блок с пользователями. -->
      <div class="info_wrapper">
        <span class="info_title">Исполнители: </span>
        <div
          v-for="(item, index) in dataUsers"
          :key="index"
          class="user_info"
        >
          <li>{{ item.user_fio }}</li>
          <v-dialog
            v-model="showDeleteOneUserModal"
            width="600"
          >
            <template #activator="{ on, attrs }">
              <TooltipStyled :title="'Удалить исполнителя'">
                <v-icon
                  size="32"
                  color="#8A8784"
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-delete-outline
                </v-icon>
              </TooltipStyled>
            </template>
            <v-card class="delete_user_modal">
              <div class="delete_user_header">
                <span class="header_title">Удаление исполнителя</span>
                <v-icon large @click="closeDeleteOneUserModal">
                  mdi-close
                </v-icon>
              </div>
              <span>
                Вы действительно хотите удалить исполнителя "{{ item.user_fio }}"?
              </span>
              <div class="delete_user_buttons">
                <ButtonStyled
                  :local-text="'Подтвердить'"
                  :local-class="'invite_button style_button'"
                  @click-button="deleteOneUser(taskData.ids_users.item, index)"
                />
                <ButtonStyled
                  :local-text="'Отмена'"
                  :local-class="'style_close'"
                  @click-button="closeDeleteOneUserModal"
                />
              </div>
            </v-card>
          </v-dialog>
        </div>
        <div class="add_users_wrapper">
          <TooltipStyled
            :is-top="true"
            :title="'Добавить исполнителя'"
          >
            <v-icon
              color="#95D7AE"
              size="34"
              @click="addUser"
            >
              mdi-plus-circle-outline
            </v-icon>
          </TooltipStyled>
          <v-combobox
            :items="$store.state.CollaborationModule.listMembers"
            :item-text="'user_fio'"
            :item-value="'id'"
            :hide-details="true"
            hide-selected
            class="search_service"
            clearable
            label="Добавить исполнителя"
            outlined
            return-object
            solo
            @change="setSelectedUsersIdsLocal"
          />
        </div>
      </div>

      <!-- Блок с примечанием. -->
      <div class="info_wrapper">
        <span class="info_title">Примечание: </span>
        <div class="textarea_style">
          <v-textarea
            v-model="taskData.notes"
            :hide-details="true"
            outlined
            label="Введите примечание"
            color="#000000"
            clearable
          />
        </div>
      </div>

      <!-- Блок с кнопками. -->
      <div class="footer_buttons">
        <ButtonStyled
          :local-text="'Отправить заявку'"
          :local-class="'invite_button style_button'"
          @click-button="sendTask"
        />
        <ButtonStyled
          :local-text="'Отмена'"
          :local-class="'style_close'"
          @click-button="closeModal"
        />
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import ButtonStyled from '../Common/ButtonStyled.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import SelectStyled from '../Common/SelectStyled.vue';
import { Service, ServiceDataConstructor, TaskData } from '../../helpers/constructors';
import ServiceCard from './ServiceCard.vue';

export default {
  name: 'InviteUserModal',
  components: {
    ServiceCard,
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
      taskData: new TaskData(),
      dataUsers: [],
      showModal: false,
      showDeleteOneServiceModal: false,
      showDeleteOneUserModal: false,
      selectedService: {},
      selectedUser: {},
    }
  },
  mounted() {
    if (this.currentTask) {
      this.taskData = this.currentTask
    }
    this.taskData.id_object = this.$store.getters['Objects/getIdCurrentObject']
  },
  methods: {
    getValueField(str) {
      return (str) || ''
    },

    closeModal() {
      this.showModal = false
    },

    openModal() {
      this.showModal = true
    },

    closeDeleteOneServiceModal() {
      this.showDeleteOneServiceModal = false
    },

    openDeleteOneUserModal() {
      this.showDeleteOneUserModal = true
    },

    closeDeleteOneUserModal() {
      this.showDeleteOneUserModal = false
    },

    setSelectedServicesIdsLocal(obj) {
      this.selectedService = obj;
    },

    setSelectedUsersIdsLocal(obj) {
      this.selectedUser = obj;
    },

    addService(){
      if (this.taskData.services.find(item => item.id_services === this.selectedService.id)) {
        this.$toast.error('Услуга уже добавлена')
        return false
      }

      this.taskData.services.push( new Service(
        this.selectedService.id,
        [],
        '',
        '1',
        new ServiceDataConstructor(
          this.selectedService.code,
          this.selectedService.name,
          this.selectedService.description,
        )
      ) )

      this.$toast.success('Услуга добавлена')
    },

    setPrice(index, price) {
      this.taskData.services[index].price = price
    },

    addUser() {
      if (this.taskData.ids_users.includes(this.selectedUser.id)) {
        this.$toast.error('Исполнитель уже добавлен')
        return false
      }

      this.taskData.ids_users.push(this.selectedUser.id)
      this.dataUsers.push(this.selectedUser)

      this.$toast.success('Исполнитель добавлен')
    },

    async sendTask() {
      if (! this.taskData.services.length) {
        this.$toast.info('Выберите услугу')
        return false
      }

      if (! this.taskData.ids_users.length) {
        this.$toast.info('Добавьте исполнителя')
        return false
      }

      const response = await this.$store.dispatch(
        'CollaborationModule/setTaskByObject',
        this.taskData
      )

      this.$toast.success(response.message)
      this.closeModal()

      // TODO: Доделать дестрой
      // this.dataUsers = ''
      // this.taskData = new TaskData()
    },

    deleteOneService(serviceToRemove) {
      this.taskData.services.splice(serviceToRemove, 1)

      this.closeDeleteOneServiceModal()
      this.$toast.success('Услуга удалена')
    },

    deleteOneUser(idUserToRemove, dataUserToRemove) {
      this.taskData.ids_users.splice(idUserToRemove, 1)
      this.dataUsers.splice(dataUserToRemove, 1)

      this.closeDeleteOneUserModal()
      this.$toast.success('Исполнитель удален')
    },

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
$yellowBackground: rgb(255, 244, 203);
$shadowBox: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
$borderRadius: 5px;

.v-input__slot {
  max-height: 40px !important;
}

.application_card {
  display: grid;
  grid-row-gap: 15px;
  padding: 20px;
  background: #FFFFFF;
  .application_header {
    display: flex;
    justify-content: space-between;
    .header_title {
      font-size: 1.5em;
      font-weight: 600;
    }
  }
  .info_wrapper {
    display: grid;
    grid-row-gap: 10px;
    .info_title{
      font-weight: 600;
      font-size: 1.3em;
    }

    .user_info {
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
    }

    .info_text {
      font-size: 1.3em;
    }
    .add_users_wrapper {
      display: inline-flex;
      align-items: center;
      grid-column-gap: 10px;
      .search_service {
        max-width: 300px;
      }
    }

  }
  .services_table{
    display: grid;
    grid-row-gap: 1em;
    background: $yellowBackground;
    box-shadow: $shadowBox;
    border-radius: $borderRadius;
    padding: 10px;
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
      align-items: center;
      grid-column-gap: 10px;
      padding: 10px;
      background: #FFFFFF;
      border-radius: $borderRadius;
      box-shadow: $shadowBox;
      .search_service {
      }
    }
  }
  .services_select {
    padding: 20px 0;
  }
  .services_buttons {
    display: flex;
    justify-content: space-between;
  }
  .footer_buttons {
    display: flex;
    justify-content: space-between;
  }
}

.delete_user_modal {
  padding: 20px;
  display: grid;
  grid-row-gap: 20px;
  .delete_user_header {
    display: flex;
    justify-content: space-between;
    font-size: 1.3em;
    font-weight: 600;
  }
  .delete_user_buttons {
    display: flex;
    justify-content: space-between;
  }
}

</style>

<style lang="scss">
.search_service {
  .v-input__control {
    min-height: 40px !important;
    .v-input__slot {
      min-height: 40px !important;
    }
  }
}
</style>
