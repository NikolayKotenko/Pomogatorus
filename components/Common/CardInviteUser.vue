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
              </div>
            </section>
            <section>
              <span class="type">Оказываемые услуги: </span>
              <span/>
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
        <section>
          <span class="user_name">{{ getValueField(userObject.middle_name) + ' ' + getValueField(userObject.first_name) }}</span>
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
        <section>
          <span class="type">Рекомендуемые услуги: </span>
          <div v-for="(item, index) in getLimitedServices" :key="index" class="list_services">
            <span class="name">
              - {{ getValueField(item.name) }}
            </span>
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
                  <span>Услуга нужна чтобы ....</span>
                </div>
              </v-list>
            </v-menu>
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
                  mdi-swap-horizontal-circle-outline
                </v-icon>
              </template>
              <v-list>
                <div class="explain_info">
                  <h3>Услуга </h3>
                  <div>
                    <span>Рекомендуется на основании заполненных параметров в объектке: </span>
                    <li>Тип крепления - Настенный</li>
                    <li>Тип топлива - Газ</li>
                  </div>
                </div>
              </v-list>
            </v-menu>
          </div>
        </section>
      </section>
      <section
        v-if="SearchStyled"
        class="application"
      >
        <!-- Модальное окно "Составление заявки" по клику на кнопку "Отправить заявку". -->
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
                v-if="getStateTetheredUserInObject"
                :local-text="'Поcмотреть заявку'"
                :local-class="'invite_button style_button'"
                @click="openModal"
              />
              <ButtonStyled
                v-else
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
            />
            <div class="services_buttons">
              <div @click="sendApplication">
                <ButtonStyled
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
      </section>
    </div>
  </v-container>
</template>

<script>
import SelectStyled from './SelectStyled.vue';
import SearchStyled from './SearchStyled.vue';
import ButtonStyled from './ButtonStyled.vue';

export default {
  name: 'CardInviteUser',
  components: { ButtonStyled, SelectStyled },
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
      return this.userObject.objects.some((object) => {
        return object.id === this.$store.getters['Objects/getIdCurrentObject']
      })
    },
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
      await this.$store.dispatch('CollaborationModule/setUserByObject',
        {
          id_user: this.userObject.id,
          id_object: this.$store.getters['Objects/getIdCurrentObject']
        })
      this.$toast.success('Заявка отправлена',{ duration: 5000 })
      this.closeModal()
    }
  },
  getters: {

  }
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
  padding-top: 20px ;
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
  max-width: 1000px;
  border-radius: 5px;
  transition: all 0.4s ease-in-out;
  cursor: default;
  &:hover {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #FFF4CB;
  }

  .user_info{
    display: grid;
    grid-template-columns: 1.2fr 1fr 0.7fr;
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

.services{
  .list_services{

  }

}
.explain_info{
  padding: 20px;
  max-width: 350px;
}
</style>
