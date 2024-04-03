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
          :content="$store.getters['TaskModule/getCountServices']"
          :value="$store.getters['TaskModule/getCountServices']"
          color="#95D7AE"
        />
      </v-tab>
      <v-tab
        :key="1"
      >
        Рекомендованные специалисты
        <v-badge
          :content="$store.getters['TaskModule/getCountRatedUsers']"
          :value="$store.getters['TaskModule/getCountRatedUsers']"
          color="#95D7AE"
        />
      </v-tab>
      <v-tab
        :key="2"
      >
        Приглашенные специалисты
        <v-badge
          :content="$store.getters['TaskModule/getCountAddedUsers']"
          :value="$store.getters['TaskModule/getCountAddedUsers']"
          color="#95D7AE"
        />
      </v-tab>
      <v-tab
        :key="3"
      >
        Заявка
      </v-tab>

      <!-- Блок с услугами. -->
      <v-tab-item :key="0" class="tab_wrapper">
        <template v-if="! $store.getters['TaskModule/getCountServices']">
          <span class="empty_data_wrapper">Вы ещё не выбрали услугу</span>
        </template>
        <div class="services_table">
          <div class="info_wrapper">
            <div class="service_card_wrapper">
              <ServiceCard
                v-for="(item, index) in $store.state.TaskModule.taskData.services"
                :key="index"
                :iteration-key="index+1"
                :service-object="item"
                @delete-one-service="deleteService(index)"
                @update-price-field="setPrice(index, $event)"
                @update-quantity-input="setQuantity(index, $event)"
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
          <div style="display: flex; align-items: center">
            <span class="info_title">Примечание: </span>
            <IconTooltip
              :icon-text="'mdi-help-circle-outline'"
              :text-tooltip="'Допускается заполнение только этого поля'"
            />
          </div>
          <div class="textarea_style">
            <v-textarea
              v-model="$store.state.TaskModule.taskData.notes"
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
        <template v-if="! $store.getters['TaskModule/getCountServices']">
          <span class="empty_data_wrapper">Вначале выберите услугу</span>
        </template>
        <v-simple-table v-else>
          <template #default>
            <thead>
              <tr>
                <th class="text-left">
                  Специалисты
                </th>
                <th class="text-left">
                  <div style="display: flex; align-items: center">
                    Совпадение по услугам
                    <IconTooltip
                      :icon-text="'mdi-help-circle-outline'"
                      :size-icon="'16'"
                      :text-tooltip="'В большинстве случаев отсутствие услуги\n'+
                        'объясняется тем, что специалист пока \n'+
                        'не заполнил свой прайс'"
                    />
                  </div>
                </th>
                <th class="text-left">
                  <div style="display: flex; align-items: center">
                    Совпадение по брендам
                    <IconTooltip
                      :icon-text="'mdi-help-circle-outline'"
                      :size-icon="'16'"
                      :text-tooltip="'В этом столбце показано совпадение\n'
                        +'по вашему избранному оборудованию \n'
                        +'с опытом монтажа мастером этих брендов'"
                    />
                  </div>
                </th>
                <th class="text-left">
                  Действие
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in $store.state.TaskModule.listRatedUsers"
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
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <v-menu offset-overflow offset-y open-on-hover>
                    <template #activator="{ on, attrs }">
                      <span
                        style="font-weight: 700;"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ $store.getters['TaskModule/getMatchPercentage'](item.services) }} -
                      </span>
                      <span
                        style="font-weight: 400; color: #B3B3B3;"
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ $store.getters['TaskModule/getCountUserServicesToMatch'](item.services) }}
                      </span>
                    </template>
                    <v-list>
                      <div class="explain_info">
                        <h4>Пользователь может выполнить следующие услуги: </h4>
                        <li
                          v-for="(item, index) in $store.getters['TaskModule/getListServicesOfUserToExecute'](item.services)"
                          :key="index"
                        >
                          {{ item }}
                        </li>
                      </div>
                    </v-list>
                  </v-menu>
                </td>
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
        <template v-if="! $store.getters['TaskModule/getCountAddedUsers']">
          <span class="empty_data_wrapper">Вы ещё не выбрали специалистов</span>
        </template>
        <template v-else>
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">
                    Специалисты
                  </th>
                  <th class="text-left">
                    <div style="display: flex; align-items: center">
                      Совпадение по услугам
                      <IconTooltip
                        :icon-text="'mdi-help-circle-outline'"
                        :size-icon="'16'"
                        :text-tooltip="'В большинстве случаев отсутствие услуги\n'+
                          'объясняется тем, что специалист пока \n'+
                          'не заполнил свой прайс'"
                      />
                    </div>
                  </th>
                  <th class="text-left">
                    <div style="display: flex; align-items: center">
                      Совпадение по брендам
                      <IconTooltip
                        :icon-text="'mdi-help-circle-outline'"
                        :size-icon="'16'"
                        :text-tooltip="'В этом столбце показано совпадение\n'
                          +'по вашему избранному оборудованию \n'
                          +'с опытом монтажа мастером этих брендов'"
                      />
                    </div>
                  </th>
                  <th class="text-left">
                    Действие
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in $store.state.TaskModule.dataUsers"
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
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <v-menu offset-overflow offset-y open-on-hover>
                      <template #activator="{ on, attrs }">
                        <span
                          style="font-weight: 700;"
                          v-bind="attrs"
                          v-on="on"
                        >
                          {{ $store.getters['TaskModule/getMatchPercentage'](item.services) }} -
                        </span>
                        <span
                          style="font-weight: 400; color: #B3B3B3;"
                          v-bind="attrs"
                          v-on="on"
                        >
                          {{ $store.getters['TaskModule/getCountUserServicesToMatch'](item.services) }}
                        </span>
                      </template>
                      <v-list>
                        <div class="explain_info">
                          <h4>Пользователь может выполнить следующие услуги: </h4>
                          <li
                            v-for="(elem, key) in $store.getters['TaskModule/getListServicesOfUserToExecute'](item.services)"
                            :key="key"
                          >
                            {{ elem }}
                          </li>
                        </div>
                      </v-list>
                    </v-menu>
                  </td>
                  <td>66% - 2 из 3</td>
                  <td>
                    <IconTooltip
                      :color-icon="'#B3B3B3'"
                      :icon-text="'mdi-delete-outline'"
                      :size-icon="'32'"
                      :text-tooltip="'Убрать из заявки'"
                      @click-icon="deleteUser($store.state.TaskModule.taskData.ids_users.item, index)"
                    />
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </template>
      </v-tab-item>
      <v-tab-item :key="3" class="tab_wrapper">
        <div class="info_wrapper">
          <div v-if="$store.getters['TaskModule/getCountServices']" class="info_title">
            Услуги:
            <li
              v-for="(item, index) in $store.state.TaskModule.taskData.services"
              :key="index"
              class="text"
            >
              {{ item.service_data.name }}
            </li>
          </div>
          <div v-if="$store.getters['TaskModule/getCountAddedUsers']" class="info_title">
            Специалисты:
            <li
              v-for="(item, index) in $store.state.TaskModule.dataUsers"
              :key="index"
              class="text"
            >
              {{ item.user_fio }}
            </li>
          </div>
          <div
            v-if="$store.state.TaskModule.taskData.notes !== ''"
            style="display: grid; grid-row-gap: 10px;"
          >
            <div style="display: flex; align-items: center">
              <span class="info_title">Примечание: </span>
              <IconTooltip
                :icon-text="'mdi-help-circle-outline'"
                :text-tooltip="'Допускается заполнение только этого поля'"
              />
            </div>
            <v-textarea
              v-model="$store.state.TaskModule.taskData.notes"
              :hide-details="true"
              clearable
              color="#000000"
              label="Введите примечание"
              outlined
              disabled
              height="150"
            />
          </div>
        </div>
      </v-tab-item>
    </v-tabs>

    <!-- Блок с кнопками. -->
    <div v-if="tab === 0" class="footer_buttons">
      <ButtonStyled
        class="btn"
        :local-class="'invite_button style_button'"
        :local-text="'Выбрать специалистов'"
        :is-disabled="! $store.getters['TaskModule/getCountServices']"
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
        :is-disabled="! $store.getters['TaskModule/getCountAddedUsers'] || ! $store.getters['TaskModule/getCountServices']"
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
        :is-disabled="! $store.getters['TaskModule/getCountAddedUsers'] || ! $store.getters['TaskModule/getCountServices']"
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
    },
  },
  data() {
    return {
      showDeleteOneUserModal: false,
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
  },
  watch: {
    '$store.getters.TaskModule.getServiceCodes':{
      async handler(v) {
        await this.$store.dispatch('TaskModule/getListRatedUsers');
      }
    },
  },
  async mounted() {
    this.$store.state.TaskModule.taskData.id_object = this.$store.getters['Objects/getIdCurrentObject'];

    if (this.listServicesAvailableToAdd.length) return false;
    if (!this.$store.state.CollaborationModule.listServices.length) {
      await this.$store.dispatch('CollaborationModule/getListServices');
    }

  },
  methods: {
    addService(obj) {
        this.$store.dispatch('TaskModule/addService', obj)
    },
    addUser(userData) {
      this.$store.dispatch('TaskModule/addUser', userData)
    },
    setPrice(index, price) {
      this.$store.state.TaskModule.taskData.services[index].price = price;
    },
    setQuantity(index, quantity) {
      this.$store.state.TaskModule.taskData.services[index].quantity = quantity
    },
    async sendTask() {
      await this.$store.dispatch('TaskModule/sendTask')
    },
    deleteService(service) {
      this.$store.dispatch('TaskModule/deleteService', service)
    },
    deleteUser(id, data) {
      this.$store.dispatch('TaskModule/deleteUser', id, data)
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

.empty_data_wrapper {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  font-weight: 700;
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
      display: grid;
      .text {
        font-size: 1em !important;
        font-weight: 400;
      }
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

.explain_info {
  padding: 10px;
  max-width: 300px;
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
