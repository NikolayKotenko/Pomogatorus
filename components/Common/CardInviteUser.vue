<template>
  <v-container class="card_invite_user">
    <!-- Карточка пользователя по клику на Аватар. -->
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <v-avatar
          color="#5D80B5"
          size="80"
          v-bind="attrs"
          v-on="on"
        >
          <span class="avatar_fio">И</span>
        </v-avatar>
      </template>
      <v-list>
        <div class="user_card">
          <div class="main_info">
            <div class="avatar">
              <v-avatar
                color="#5D80B5"
                size="80"
              >
                <span class="avatar_fio">И</span>
              </v-avatar>
            </div>
            <div class="user_info">
              <span class="user_name">{{ getValueField(userObject.middle_name) + ' ' + getValueField(userObject.first_name) }}</span>
              <section class="user_company">
                <v-icon>mdi-home-account</v-icon>
                <span class="type">Компания: </span>
                <span class="name">{{ getCompanyName }}</span>
              </section>
              <section class="mail">
                {{ getValueField(userObject.email) }}
              </section>
            </div>
          </div>
          <v-divider style="margin: 20px 0"/>
          <div class="user_services">
            <section>
              <span class="type">Услуги: </span>
              <div v-for="(item, index) in userObject.services" :key="index" class="list_services">
                <span class="name">
                  - {{ getValueField(item.name) }}
                </span>
                <TooltipStyled
                  :title="'Описание услуги'"
                >
                  <v-menu
                    offset-overflow
                    offset-y
                  >
                    <template #activator="{ on, attrs }">
                      <v-icon
                        small
                        v-bind="attrs"
                        color="#5D80B5"
                        v-on="on"
                      >
                        mdi-help-circle-outline
                      </v-icon>
                    </template>
                    <v-list>
                      <div class="explain_info">
                        <span>{{ getValueField(item.description) }}</span>
                      </div>
                    </v-list>
                  </v-menu>
                </TooltipStyled>
              </div>
            </section>
            <section>
              <span class="type">Оказываемые услуги на объекте: </span>
              <div v-for="(item, index) in getServicesTetheredByUserObject.slice(0, 3)" :key="index" class="list_services">
                <span class="name">- {{ item.name }}</span>
                <TooltipStyled
                  :title="'Описание услуги'"
                >
                  <v-menu
                    offset-overflow
                    offset-y
                  >
                    <template #activator="{ on, attrs }">
                      <v-icon
                        small
                        v-bind="attrs"
                        color="#5D80B5"
                        v-on="on"
                      >
                        mdi-help-circle-outline
                      </v-icon>
                    </template>
                    <v-list>
                      <div class="explain_info">
                        <span>{{ getValueField(item.description) }}</span>
                      </div>
                    </v-list>
                  </v-menu>
                </TooltipStyled>
              </div>
            </section>
            <section class="brands">
              <span class="type">Используемые бренды: </span>
              <span class="name">Baxi, Navien, Bosch</span>
            </section>
          </div>
        </div>
      </v-list>
    </v-menu>

    <!-- Invite USER CARD -->
    <div class="user_info">
      <section class="main_info">
        <section style="display: flex;">
          <span class="user_name">{{ getValueField(userObject.middle_name) + ' ' + getValueField(userObject.first_name) }}</span>
          <!--          <TooltipStyled :title="'Основания для рекомендации'"> -->
          <!--            <v-menu -->
          <!--              offset-overflow -->
          <!--              offset-y -->
          <!--            > -->
          <!--              <template #activator="{ on, attrs }"> -->
          <!--                <v-icon -->
          <!--                  v-bind="attrs" -->
          <!--                  color="#5D80B5" -->
          <!--                  v-on="on" -->
          <!--                > -->
          <!--                  mdi-swap-horizontal-circle-outline -->
          <!--                </v-icon> -->
          <!--              </template> -->
          <!--              <v-list> -->
          <!--                <div class="explain_info"> -->
          <!--                  <div> -->
          <!--                    <span style="font-weight: 500">Пользователь рекомендуется на основании выполненных услуг на других объектах: </span> -->
          <!--                    <li>БАНЯ Куса, Красные орлы 7 - Монтаж унитаза</li> -->
          <!--                    <li>БАНЯ Куса, Красные орлы 7 - Монтаж водонагревателя</li> -->
          <!--                  </div> -->
          <!--                </div> -->
          <!--              </v-list> -->
          <!--            </v-menu> -->
          <!--          </TooltipStyled> -->
        </section>
        <section class="brands">
          <span class="type">Используемые бренды: </span>
          <span class="name">Baxi, Navien, Bosch</span>
        </section>
        <section class="user_company">
          <v-icon>mdi-home-account</v-icon>
          <span class="type">Компания: </span>
          <span class="name">{{ getCompanyName }}</span>
        </section>
      </section>
      <section class="services">
        <section v-if="!getStateTetheredUserInObject">
          <span class="type">Рекомендуемые услуги: </span>
          <div v-for="(item, index) in getLimitedServices" :key="index" class="list_services">
            <span class="name">
              - {{ getValueField(item.name) }}
            </span>
            <TooltipStyled
              :title="'Описание услуги'"
            >
              <v-menu
                offset-overflow
                offset-y
              >
                <template #activator="{ on, attrs }">
                  <v-icon
                    small
                    v-bind="attrs"
                    color="#5D80B5"
                    v-on="on"
                  >
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                <v-list>
                  <div class="explain_info">
                    <span>{{ getValueField(item.description) }}</span>
                  </div>
                </v-list>
              </v-menu>
            </TooltipStyled>
          </div>
        </section>
        <section v-else>
          <span class="type">Оказываемые услуги: </span>
          <div v-for="(item, index) in getServicesTetheredByUserObject.slice(0, 3)" :key="index" class="list_services">
            <span class="name">
              - {{ getValueField(item.name) }}
            </span>
            <TooltipStyled
              :title="'Описание услуги'"
            >
              <v-menu
                offset-overflow
                offset-y
              >
                <template #activator="{ on, attrs }">
                  <v-icon
                    small
                    v-bind="attrs"
                    color="#5D80B5"
                    v-on="on"
                  >
                    mdi-help-circle-outline
                  </v-icon>
                </template>
                <v-list>
                  <div class="explain_info">
                    <span>{{ getValueField(item.description) }}</span>
                  </div>
                </v-list>
              </v-menu>
            </TooltipStyled>
          </div>
        </section>
      </section>
      <section
        v-if="SearchStyled"
        class="application"
      >
        <!-- Модальное окно "Составление заявки" по клику на кнопку "Отправить заявку". -->
        <template v-if="!getStateTetheredUserInObject">
          <v-dialog
            v-model="showModal"
            width="600"
          >
            <template #activator="{ on, attrs }">
              <div
                v-bind="attrs"
                v-on="on"
              >
                <ButtonStyled
                  :local-text="'Отправить заявку'"
                  :local-class="'invite_button style_button'"
                  @click="openModal"
                />
              </div>
            </template>
            <v-card class="application_card">
              <div class="application_title">
                <h3>Составление заявки</h3>
                <v-icon @click="closeModal">
                  mdi-close
                </v-icon>
              </div>
              <div>
                <span>Пригласить {{ getValueField(userObject.middle_name) + ' ' + getValueField(userObject.first_name) }} в качестве: </span>
              </div>
              <SelectStyled
                class="services_select"
                :items="userObject.services"
                :item-text="'name'"
                :item-value="'id'"
                :is-solo="true"
                :is-multiple="true"
                :is-chips="true"
                @update-input="setSelectedServicesIdsLocal"
              />
              <div class="services_buttons">
                <div @click="sendApplication">
                  <ButtonStyled
                    :is-disabled="!selectedServicesIdsLocal.length"
                    :local-text="'Отправить заявку'"
                    :local-class="'invite_button style_button'"
                  />
                </div>
                <div @click="closeModal">
                  <ButtonStyled
                    :local-text="'Отмена'"
                    :local-class="'style_close'"
                  />
                </div>
              </div>
            </v-card>
          </v-dialog>
        </template>

        <!-- Модальное окно "Просмотр заявки" по клику на кнопку "Посмотреть заявку". -->
        <template v-else>
          <v-dialog
            v-model="showModal"
            width="600"
          >
            <template #activator="{ on, attrs }">
              <div
                v-bind="attrs"
                v-on="on"
              >
                <ButtonStyled
                  :local-text="'Поcмотреть заявку'"
                  :local-class="'invite_button style_button'"
                  @click="openModal"
                />
              </div>
            </template>
            <v-card class="application_card">
              <div class="application_title">
                <h3>Просмотр заявки</h3>
                <v-icon @click="closeModal">
                  mdi-close
                </v-icon>
              </div>
              <div>
                <span>Пользователь
                  {{ getValueField(userObject.middle_name) + ' ' + getValueField(userObject.first_name) }}
                  приглашен в качестве исполнителя услуг: </span>
              </div>
              <SelectStyled
                class="services_select"
                :data="getServicesTetheredByUserObject"
                :items="userObject.services"
                :item-text="'name'"
                :item-value="'id'"
                :is-solo="true"
                :is-multiple="true"
                :is-chips="true"
                @update-input="setSelectedServicesIdsLocal"
              />
              <div class="services_buttons">
                <div @click="sendApplication">
                  <ButtonStyled
                    :is-disabled="!selectedServicesIdsLocal.length"
                    :local-text="'Добавить услугу'"
                    :local-class="'invite_button style_button'"
                  />
                </div>
                <div @click="localDeleteServiceUserByObject">
                  <ButtonStyled
                    :is-disabled="!selectedServicesIdsLocal.length"
                    :local-text="'Удалить услугу'"
                    :local-class="'style_close'"
                  />
                </div>
              </div>
            </v-card>
          </v-dialog>
        </template>
      </section>
    </div>
  </v-container>
</template>

<script>
import SelectStyled from './SelectStyled.vue';
import SearchStyled from './SearchStyled.vue';
import ButtonStyled from './ButtonStyled.vue';
import TooltipStyled from './TooltipStyled.vue';

export default {
  name: 'CardInviteUser',
  components: { TooltipStyled, ButtonStyled, SelectStyled },
  props: {
    userObject: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      showModal: false,
      userAccess: [
        { access: 'Полный доступ',value: 1 },
        { access: 'Может редактировать',value: 2 },
        { access: 'Может комментировать',value: 3 },
        { access: 'Может смотреть',value: 4 },
      ],
      selectedServicesIdsLocal: [],
    }
  },
  computed: {
    SearchStyled() {
      return SearchStyled
    },
    getCompanyName(){
      return this.userObject.company?.name ?? ''
    },
    getLimitedServices(){
      return this.userObject.services.slice(0, 2)
    },
    getStateTetheredUserInObject() {
      return this.userObject.services_objects.some((object) => {
        return object.id === this.$store.getters['Objects/getIdCurrentObject']
      })
    },
    getServicesTetheredByUserObject() {
      const currentObject = this.userObject.services_objects
        .filter((obj) => obj.id === this.$store.getters['Objects/getIdCurrentObject'])[0];

      if (!currentObject) return []

      if (!currentObject.m_to_m_users_services_objects) return []

      const idsServices = currentObject.m_to_m_users_services_objects
        .filter((obj) => obj.id_user === this.userObject.id)
        .map((obj) => obj.id_services)

      return this.userObject.services.filter((obj) => {
        return idsServices.includes(obj.id)
      })
    },
  },
  mounted() {
    this.selectedServicesIdsLocal = this.getServicesTetheredByUserObject.map((obj) => obj.id)
  },

  methods: {
    getValueField(str) {
      return (str) || ''
    },
    openModal() {
      this.$store.commit('UserSettings/setListServices', [])
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    async sendApplication() {
      let response = null;
      for (const idServices of this.selectedServicesIdsLocal) {
        response = await this.$store.dispatch(
          'CollaborationModule/setUserByObject',
          {
            id_user: this.userObject.id,
            id_object: this.$store.getters['Objects/getIdCurrentObject'],
            id_services: idServices,
          })
      }
      if (! response) return false;

      if (response.codeResponse >= 400) return false;

      this.$toast.success('Заявка на услугу отправлена',{ duration: 5000 })
      this.closeModal()
    },
    async localDeleteServiceUserByObject() {
      let response = null;
      for (const idServices of this.selectedServicesIdsLocal) {
        response = await this.$store.dispatch(
          'CollaborationModule/deleteServiceUserByObject',
          {
            id_user: this.userObject.id,
            id_object: this.$store.getters['Objects/getIdCurrentObject'],
            id_services: idServices,
          })
      }
      if (! response) return false;

      if (response.codeResponse >= 400) return false;

      this.$toast.success('Услуга удалена',{ duration: 5000 })
      this.closeModal()
    },
    setSelectedServicesIdsLocal(selectedServices) {
      this.selectedServicesIdsLocal = [];
      this.selectedServicesIdsLocal = selectedServices.map(elem => elem.id)

    }
  },
};
</script>

<style lang="scss" scoped>
$grey-color: #857885;
$orange-color: #F79256;
.user_card {
  min-width: 400px;
  height: auto;
  padding: 20px;

  .main_info{
    display: flex;
    align-content: center;
    .user_info{
      .mail {
        color: $grey-color;
        font-size: 0.88em;
      }
    }
    .avatar{
      margin-right: 20px;
    }

  }
}
.application {
  padding-top: 20px;

}
.application_card {
  padding: 20px;
  .application_title {
    display: flex;
    justify-content: space-between;
  }
  .services_select {
    padding: 20px 0;
  }
  .services_buttons {
    display: flex;
    justify-content: space-between;
  }
}
.avatar_fio{
  font-size: 2em;
  color: #FFFFFF;
}
.card_invite_user {
  display: inline-flex;
  grid-column-gap: 1em;
  align-items: center;
  width: 100%;
  max-width: 1080px;
  border-radius: 5px;
  transition: all 0.4s ease-in-out;
  cursor: default;
  &:hover {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #FFF4CB;
  }

  .user_info{
    display: grid;
    grid-template-columns: 1fr 1fr 0.7fr;
    width: 100%;
    align-items: center;
    .access_rights{
      margin-left: auto;
      .access_style{
        color: $grey-color !important;
        font-size: 0.88em;
        width: 100% ;
      }
    }
    .invite_right{
      margin-left: auto;
    }
  }
}
.type {
  color: $orange-color;
  font-weight: bold;
  font-size: 0.88em;
}

.name {
  font-size: 0.88em;
}

.list_services{
  display: flex;
  align-items: center;


}

.services{}
.explain_info{
  padding: 20px;
  max-width: 500px;
}
</style>
