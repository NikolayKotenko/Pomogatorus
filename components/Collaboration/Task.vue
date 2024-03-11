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
      v-model="tab"
      color="black"
      grow
    >
      <v-tab :key="0">
        Услуги
        <v-badge
          :content="taskData.services.length"
          :value="taskData.services.length"
          color="#95D7AE"
        />
      </v-tab>
      <v-tab
        :key="1"
        :disabled="! taskData.services.length"
      >
        Рекомендованные специалисты
        <v-badge
          :content="$store.state.CollaborationModule.listRatedUsers.length"
          :value="$store.state.CollaborationModule.listRatedUsers.length"
          color="#95D7AE"
        />
      </v-tab>
      <v-tab
        :key="2"
        :disabled="! taskData.ids_users.length || ! taskData.services.length"
      >
        Приглашенные специалисты
        <v-badge
          :content="taskData.ids_users.length"
          :value="taskData.ids_users.length"
          color="#95D7AE"
        />
      </v-tab>
      <v-tab
        :key="3"
        :disabled="(taskData.notes === '') && (! taskData.ids_users.length) && (! taskData.services.length)"
      >
        Заявка
      </v-tab>

      <!-- Блок с услугами. -->
      <v-tab-item :key="0" class="tab_wrapper">
        <div class="services_table">
          <div class="info_wrapper">
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
            :list-items-available-to-add="currentListServicesAvailableToAdd"
            @add-service="addService"
          />
        </div>

        <!-- Блок с примечанием. -->
        <div class="info_wrapper">
          <div style="display: flex;">
            <span class="info_title">Примечание: </span>
            <IconTooltip
              :icon-text="'mdi-help-circle-outline'"
              :text-tooltip="'Допускается заполнение только этого поля'"
            />
          </div>
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
      <v-tab-item :key="1" class="tab_wrapper">
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
                v-for="(item, index) in $store.state.CollaborationModule.listRatedUsers"
                :key="index"
              >
                <td>
                  <div class="user_info">
                    <DropDownMenuStyled :is-left="true" :is-offset-y="true">
                      <template #icon>
                        <v-avatar size="50">
                          <v-img
                            src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"
                          />
                        </v-avatar>
                      </template>
                      <template #content>
                        <MiniUserCard :user-object="item"/>
                      </template>
                    </DropDownMenuStyled>
                    <div class="user_title">
                      <div class="name">
                        {{ item.user_fio }}
                      </div>
                      <v-rating
                        background-color="#B3B3B3"
                        color="#95D7AE"
                        readonly
                        value="4"
                      />
                    </div>
                  </div>
                </td>
                <td>66% - 2 из 3</td>
                <td>66% - 2 из 3</td>
                <td>
                  <IconTooltip
                    :color-icon="'#B3B3B3'"
                    :icon-text="'mdi-plus'"
                    :size-icon="'32'"
                    :text-tooltip="'Добавить в заявку'"
                    @click-icon="addUser(item)"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>

      <!-- Блок с приглашенными пользователями. -->
      <v-tab-item :key="2" class="tab_wrapper">
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
                <td>
                  <div class="user_info">
                    <DropDownMenuStyled :is-left="true" :is-offset-y="true">
                      <template #icon>
                        <v-avatar size="50">
                          <v-img
                            src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"
                          />
                        </v-avatar>
                      </template>
                      <template #content>
                        <MiniUserCard :user-object="item"/>
                      </template>
                    </DropDownMenuStyled>
                    <div class="user_title">
                      <div class="name">
                        {{ item.user_fio }}
                      </div>
                      <v-rating
                        background-color="#B3B3B3"
                        color="#95D7AE"
                        readonly
                        value="4"
                      />
                    </div>
                  </div>
                </td>
                <td>66% - 2 из 3</td>
                <td>66% - 2 из 3</td>
                <td>
                  <IconTooltip
                    :color-icon="'#B3B3B3'"
                    :icon-text="'mdi-delete-outline'"
                    :size-icon="'32'"
                    :text-tooltip="'Убрать из заявки'"
                    @click-icon="deleteOneUser(taskData.ids_users.item, index)"
                  />
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>
      <v-tab-item :key="3" class="tab_wrapper"/>
    </v-tabs>


    <!-- Блок с кнопками. -->
    <div v-if="tab === 0" class="footer_buttons">
      <ButtonStyled
        class="btn"
        :local-class="'invite_button style_button'"
        :local-text="'Выбрать специалистов'"
        :is-disabled="! taskData.services.length"
        @click-button="nextStep"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </ButtonStyled>
    </div>

    <div v-if="tab === 1" class="footer_buttons">
      <ButtonStyled
        :local-class="'style_close'"
        :local-text="'Вернуться к услугам'"
        @click-button="previousStep"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </ButtonStyled>
      <ButtonStyled
        :local-class="'invite_button style_button'"
        :local-text="'Просмотреть специалистов'"
        :is-disabled="! taskData.ids_users.length || ! taskData.services.length"
        @click-button="nextStep"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </ButtonStyled>
    </div>

    <div v-if="tab === 2" class="footer_buttons">
      <ButtonStyled
        :local-class="'style_close'"
        :local-text="'Вернуться к рекомендациям'"
        @click-button="previousStep"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </ButtonStyled>
      <ButtonStyled
        :local-class="'invite_button style_button'"
        :local-text="'Перейти к итогу'"
        :is-disabled="! taskData.ids_users.length || ! taskData.services.length"
        @click-button="nextStep"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </ButtonStyled>
    </div>

    <div v-if="tab === 3" class="footer_buttons">
      <ButtonStyled
        :local-class="'style_close'"
        :local-text="'Вернуться к приглашенным'"
        @click-button="previousStep"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </ButtonStyled>
      <ButtonStyled
        :local-class="'invite_button style_button'"
        :local-text="'Отправить заявку'"
        @click-button="sendTask"
      />
    </div>
  </v-card>
</template>

<script>
import ButtonStyled from '../Common/ButtonStyled.vue';
import TooltipStyled from '../Common/TooltipStyled.vue';
import IconTooltip from '../Common/IconTooltip.vue';
import DropDownMenuStyled from '../Common/DropDownMenuStyled.vue'
import MiniUserCard from '../User/MiniUserCard.vue'
import ServiceCard from './ServiceCard.vue';
import { Service, ServiceDataConstructor, TaskData } from '~/helpers/constructors';
import UniversalAddInput from '~/components/Common/UniversalAddInput';

export default {
  name: 'InviteUserModal',
  components: {
    MiniUserCard, DropDownMenuStyled,
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
      e1: 0,
      tab: null,
    };
  },
  computed: {
    currentListServicesAvailableToAdd: {
      get() {
        if (this.listServicesAvailableToAdd.length) {
          return this.listServicesAvailableToAdd;
        }
        return this.$store.state.CollaborationModule.listServices;
      }
    },
    getServicesCodes() {
      return this.taskData.services.map((item) => item.service_data.code);
    }
  },
  watch: {
    'getServicesCodes':{
      async handler(v) {
        await this.$store.dispatch('CollaborationModule/getListRatedUsers', this.getServicesCodes);
      }
    },
  },
  async mounted() {
    if (this.currentTask) {
      this.taskData = this.currentTask;
    }
    this.taskData.id_object = this.$store.getters['Objects/getIdCurrentObject'];

    if (this.listServicesAvailableToAdd.length) return false;
    if (!this.$store.state.CollaborationModule.listServices.length) {
      await this.$store.dispatch('CollaborationModule/getListServices');
    }

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
    // из массива всех специалистов показать только тех у кого есть совпадение по услугам


    addUser(userData) {
      if (this.taskData.ids_users.includes(userData.id)) {
        this.$toast.error('Исполнитель уже добавлен');
        return false;
      }

      this.taskData.ids_users.push(userData.id);
      this.dataUsers.push(userData);

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
    nextStep() {
      if (this.tab === 0) {
        this.tab = 1
        return false
      }
      if (this.tab === 1) {
        this.tab = 2
        return false
      }
      if (this.tab === 2) {
        this.tab = 3
        return false
      }
    },
    previousStep() {
      if (this.tab === 1) {
        this.tab = 0
        return false
      }
      if (this.tab === 2) {
        this.tab = 1
        return false
      }
      if (this.tab === 3) {
        this.tab = 2
        return false
      }
    },
    deleteOneService(serviceToRemove) {
      this.taskData.services.splice(serviceToRemove, 1);

      this.$toast.success('Услуга удалена');
    },

    deleteOneUser(idUserToRemove, dataUserToRemove) {
      this.taskData.ids_users.splice(idUserToRemove, 1);
      this.dataUsers.splice(dataUserToRemove, 1);

      this.$toast.success('Исполнитель удален');
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

.tab_wrapper {
  height: 600px;
  overflow: auto;
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
    .btn {
      margin-left: auto;
    }
  }
}

.user_info {
  display: flex;
  align-items: center;
  margin: 10px 0;
  .user_title {
    margin-left: 20px;
    .name {
      font-size: 1em !important;
    }
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
