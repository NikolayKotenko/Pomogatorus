<template>
  <v-card class="application_card">
    <template v-if="!getStateTetheredUserInObject">
      <div class="application_header">
        <span class="header_title">Составление заявки</span>
        <v-icon large @click="$emit('close-modal')">
          mdi-close
        </v-icon>
      </div>
    </template>

    <v-tabs
      color="black"
      grow
    >
      <v-tab :key="0">
        Услуги
      </v-tab>
      <v-tab :key="1">
        Рекомендованные специалисты
      </v-tab>
      <v-tab :key="2">
        Приглашенные специалисты
      </v-tab>
      <v-tab :key="3">
        Заявка
      </v-tab>

      <!-- Блок с услугами. -->
      <v-tab-item :key="0">
        <div class="services_table">
          <div class="info_wrapper">
            <span class="info_title">Услуги: </span>
            <div class="service_card_wrapper">
              <ServiceCard
                v-for="(item, index) in taskData.services"
                :key="index"
                :iteration-key="index+1"
                :service-object="item"
                @delete-one-service="deleteOneService(index)"
                @update-price-field="setPrice(index, $event)"
              />
            </div>
          </div>
          <UniversalAddInput
            :list-services-available-to-add="listServicesAvailableToAdd"
            @add-service="addService"
          />
        </div>

        <!-- Блок с примечанием. -->
        <div class="info_wrapper">
          <span class="info_title">Примечание: </span>
          <div class="textarea_style">
            <v-textarea
              v-model="taskData.notes"
              :hide-details="true"
              clearable
              color="#000000"
              label="Введите примечание"
              outlined
            />
          </div>
        </div>
      </v-tab-item>

      <!-- Блок с рекомендованными пользователями. -->
      <v-tab-item :key="1">
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-left">
                  Специалисты
                </th>
                <th class="text-left">
                  Совпадение по услугам
                </th>
                <th class="text-left">
                  Совпадение по брендам
                </th>
                <th class="text-left">
                  Действие
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in getReccomendedUsers"
                :key="index"
              >
                <td>{{ item.user_fio }}</td>
                <td>66% - 2 из 3</td>
                <td>66% - 2 из 3</td>
                <td>
                  <IconTooltip
                    :color-icon="'#B3B3B3'"
                    :icon-text="'mdi-plus-circle-outline'"
                    :size-icon="'32'"
                    :text-tooltip="'Добавить в заявку'"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

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
                    color="#8A8784"
                    size="32"
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
                    :local-class="'invite_button style_button'"
                    :local-text="'Подтвердить'"
                    @click-button="deleteOneUser(taskData.ids_users.item, index)"
                  />
                  <ButtonStyled
                    :local-class="'style_close'"
                    :local-text="'Отмена'"
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
              :hide-details="true"
              :item-text="'user_fio'"
              :item-value="'id'"
              :items="$store.state.CollaborationModule.listSearchedMembers"
              class="search_service"
              clearable
              hide-selected
              label="Добавить исполнителя"
              outlined
              return-object
              solo
              @change="setSelectedUsersIdsLocal"
            />
          </div>
        </div>
      </v-tab-item>

      <!-- Блок с приглашенными пользователями. -->
      <v-tab-item :key="2">
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th class="text-left">
                  Специалисты
                </th>
                <th class="text-left">
                  Совпадение по услугам
                </th>
                <th class="text-left">
                  Совпадение по брендам
                </th>
                <th class="text-left">
                  Действие
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in dataUsers"
                :key="index"
              >
                <td>Иванов иван</td>
                <td>66% - 2 из 3</td>
                <td>66% - 2 из 3</td>
                <td>
                  <IconTooltip
                    :color-icon="'#B3B3B3'"
                    :icon-text="'mdi-minus-circle-outline'"
                    :size-icon="'32'"
                    :text-tooltip="'Убрать из заявки'"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>
    </v-tabs>


    <!-- Блок с кнопками. -->
    <div class="footer_buttons">
      <ButtonStyled
        :local-class="'invite_button style_button'"
        :local-text="'Отправить заявку'"
        @click-button="sendTask"
      />
      <ButtonStyled
        :local-class="'style_close'"
        :local-text="'Отмена'"
        @click-button="$emit('close-modal')"
      />
    </div>
  </v-card>
</template>

<script>
import ButtonStyled from '../Common/ButtonStyled.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import IconTooltip from '../Common/IconTooltip.vue';
import ServiceCard from './ServiceCard.vue';
import { Service, ServiceDataConstructor, TaskData } from '~/helpers/constructors';
import UniversalAddInput from '~/components/Common/UniversalAddInput';

export default {
  name: 'InviteUserModal',
  components: {
    UniversalAddInput,
    ServiceCard,
    TooltipStyled,
    ButtonStyled,
    IconTooltip
  },
  props: {
    getStateTetheredUserInObject: {
      type: Boolean,
      default: false
    },
    listServicesAvailableToAdd: {
      type: Array,
      default: () => ([])
    },
    getServicesTetheredByUserObject: {
      type: Array,
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
      showDeleteOneUserModal: false,
      selectedUser: {},
      e1: 0
    };
  },
  mounted() {
    if (this.currentTask) {
      this.taskData = this.currentTask;
    }
    this.taskData.id_object = this.$store.getters['Objects/getIdCurrentObject'];
  },
  methods: {
    getValueField(str) {
      return (str) || '';
    },

    closeDeleteOneUserModal() {
      this.showDeleteOneUserModal = false;
    },

    setSelectedUsersIdsLocal(obj) {
      this.selectedUser = obj;
    },

    addService(obj) {
      if (!obj) return false;

      if (this.taskData.services.find(item => item.id_services === obj.id)) {
        this.$toast.error('Такая услуга уже добавлена');
        return false;
      }

      this.taskData.services.push(new Service(
        obj.id,
        [],
        '',
        '1',
        new ServiceDataConstructor(
          obj.code,
          obj.name,
          obj.description
        )
      ));

      this.$toast.success('Услуга добавлена');
    },

    setPrice(index, price) {
      this.taskData.services[index].price = price;
    },
    //из массива всех специалистов показать только тех у кого есть совпадение по услугам


    addUser() {
      if (this.taskData.ids_users.includes(this.selectedUser.id)) {
        this.$toast.error('Исполнитель уже добавлен');
        return false;
      }

      this.taskData.ids_users.push(this.selectedUser.id);
      this.dataUsers.push(this.selectedUser);

      this.$toast.success('Исполнитель добавлен');
    },

    async sendTask() {
      if (!this.taskData.services.length) {
        this.$toast.info('Выберите услугу');
        return false;
      }

      if (!this.taskData.ids_users.length) {
        this.$toast.info('Добавьте исполнителя');
        return false;
      }

      const response = await this.$store.dispatch(
        'CollaborationModule/setTaskByObject',
        this.taskData
      );

      this.$toast.success(response.message);
      this.$emit('close-modal');

      // TODO: Доделать дестрой
      // this.dataUsers = ''
      // this.taskData = new TaskData()
    },

    deleteOneService(serviceToRemove) {
      this.taskData.services.splice(serviceToRemove, 1);

      this.$toast.success('Услуга удалена');
    },

    deleteOneUser(idUserToRemove, dataUserToRemove) {
      this.taskData.ids_users.splice(idUserToRemove, 1);
      this.dataUsers.splice(dataUserToRemove, 1);

      this.closeDeleteOneUserModal();
      this.$toast.success('Исполнитель удален');
    }
  },
  getters: {
    getReccomendedUsers() {
      return this.$store.state.CollaborationModule.listSearchedMembers
        .map((user) => { user.services.map((service) => { service.id }) })
    },
  }
};
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

    .info_title {
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

    .service_card_wrapper {
      display: grid;
      grid-row-gap: 1em;
    }

  }

  .services_table {
    display: grid;
    grid-row-gap: 1em;
    background: $yellowBackground;
    box-shadow: $shadowBox;
    border-radius: $borderRadius;
    padding: 10px;
    margin-bottom: 20px;

    .services_table_elem {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .services_table_buttons {
        display: flex;
        align-items: center;
        grid-column-gap: 1em;
      }
    }

    .add_services {
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
