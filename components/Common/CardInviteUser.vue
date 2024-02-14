<template>
  <v-container class="card_invite_user">
    <!-- Карточка пользователя по клику на Аватар. -->

    <DropDownMenuStyled
      :is-left="true"
      :is-offset-y="true"
    >
      <template #icon>
        <v-avatar size="70">
            <v-img
                src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"
            />
        </v-avatar>
      </template>
      <template #content>
        <MiniUserCard :user-object="userObject"/>
      </template>
    </DropDownMenuStyled>

    <!-- Invite USER CARD -->
    <div class="user_info">
      <section class="main_info">
        <section style="display: flex;">
          <span class="user_name">{{ getValueField(userObject.middle_name) + " " + getValueField(userObject.first_name)
          }}</span>
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
                    color="#5D80B5"
                    small
                    v-bind="attrs"
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
                    color="#5D80B5"
                    small
                    v-bind="attrs"
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
        <!-- Функциональные иконки. -->

        <section>
          <div class="functional_icons">
            <template v-if="!getStateTetheredUserInObject">
              <ButtonStyled
                :local-class="'style_button'"
                :local-text="'Составить заявку'"
                @click-button="openModal"
              />
            </template>
            <!--              <template v-else> -->
            <!--                &lt;!&ndash; Разрешение на добавление других участников на объект. &ndash;&gt; -->
            <!--                <TooltipStyled -->
            <!--                  :title="'Предоставить права для приглашения других пользователей'" -->
            <!--                > -->
            <!--                  <v-icon size="44" disabled> -->
            <!--                    mdi-account-multiple-check -->
            <!--                  </v-icon> -->
            <!--                </TooltipStyled> -->

            <!--                &lt;!&ndash; Просмотр заявки. &ndash;&gt; -->
            <!--                &lt;!&ndash;              <TooltipStyled &ndash;&gt; -->
            <!--                &lt;!&ndash;                :title="'Просмотр заявки'" &ndash;&gt; -->
            <!--                &lt;!&ndash;              > &ndash;&gt; -->
            <!--                &lt;!&ndash;                <v-icon &ndash;&gt; -->
            <!--                &lt;!&ndash;                  size="44" &ndash;&gt; -->
            <!--                &lt;!&ndash;                  @click="openModal" &ndash;&gt; -->
            <!--                &lt;!&ndash;                > &ndash;&gt; -->
            <!--                &lt;!&ndash;                  mdi-list-status &ndash;&gt; -->
            <!--                &lt;!&ndash;                </v-icon> &ndash;&gt; -->
            <!--                &lt;!&ndash;              </TooltipStyled> &ndash;&gt; -->

            <!--                &lt;!&ndash; Отстранить пользователя (под капотом удалить все услуги). &ndash;&gt; -->
            <!--                <v-dialog -->
            <!--                  v-model="showDeleteUserModal" -->
            <!--                  width="600" -->
            <!--                > -->
            <!--                  <template #activator="{ on, attrs }"> -->
            <!--                    <TooltipStyled -->
            <!--                      :title="'Отстранить пользователя'" -->
            <!--                    > -->
            <!--                      <v-icon -->
            <!--                        size="44" -->
            <!--                        v-bind="attrs" -->
            <!--                        v-on="on" -->
            <!--                        @click="showDeleteUserModal = true" -->
            <!--                      > -->
            <!--                        mdi-account-remove -->
            <!--                      </v-icon> -->
            <!--                    </TooltipStyled> -->
            <!--                  </template> -->
            <!--                  <v-card class="application_card"> -->
            <!--                    <div class="application_header"> -->
            <!--                      <span class="header_title">Отстранить пользователя</span> -->
            <!--                      <v-icon large @click="showDeleteUserModal = false"> -->
            <!--                        mdi-close -->
            <!--                      </v-icon> -->
            <!--                    </div> -->
            <!--                    <span>Вы действительно хотите отстранить пользователя -->
            <!--                      {{ getValueField(userObject.middle_name) + ' ' + getValueField(userObject.first_name) }}? -->
            <!--                    </span> -->
            <!--                    <div class="services_buttons"> -->
            <!--                      <div @click="localDeleteServiceUserByObject"> -->
            <!--                        <ButtonStyled -->
            <!--                          :local-text="'Подтвердить'" -->
            <!--                          :local-class="'invite_button style_button'" -->
            <!--                          :is-loading="$store.state.CollaborationModule.isLoading" -->
            <!--                        /> -->
            <!--                      </div> -->
            <!--                      <div @click="showDeleteUserModal = false"> -->
            <!--                        <ButtonStyled -->
            <!--                          :local-text="'Отмена'" -->
            <!--                          :local-class="'style_close'" -->
            <!--                        /> -->
            <!--                      </div> -->
            <!--                    </div> -->
            <!--                  </v-card> -->
            <!--                </v-dialog> -->
            <!--              </template> -->
            <TaskModal
              ref="inviteUserModal"
              :get-services-tethered-by-user-object="getServicesTetheredByUserObject"
              :get-state-tethered-user-in-object="getStateTetheredUserInObject"
              :list-services-available-to-add="userObject.services"
            />
          </div>
        </section>
      </section>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import InviteUserModal from '../Collaboration/Task.vue';
import TaskModal from '../Collaboration/TaskModal.vue';
import MiniUserCard from '../User/MiniUserCard.vue';
import SelectStyled from './SelectStyled.vue';
import SearchStyled from './SearchStyled.vue';
import ButtonStyled from './ButtonStyled.vue';
import TooltipStyled from './TooltipStyled.vue';
import DropDownMenuStyled from './DropDownMenuStyled.vue';
import IconTooltip from './IconTooltip.vue';


export default {
  name: 'CardInviteUser',
  components: {
    TaskModal,
    InviteUserModal,
    TooltipStyled,
    ButtonStyled,
    SelectStyled,
    DropDownMenuStyled,
    IconTooltip,
    MiniUserCard
  },
  props: {
    userObject: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      showDeleteUserModal: false,
      selectedServicesIdsLocal: [],
      localSelectedServices: null

    };
  },
  computed: {
    ...mapState('CollaborationModule', ['listMembers']),
    ...mapState('Objects', ['currentObject']),

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
    this.$nextTick(() => {
      this.selectedServicesIdsLocal = this.getServicesTetheredByUserObject.map((obj) => obj.id)
    });
  },

  methods: {
    getValueField(str) {
      return (str) || ''
    },
    openModal() {
      this.$store.commit('UserSettings/setListServices', [])

      this.$refs.inviteUserModal.openModal()
    },
    closeModal() {
      this.$refs.inviteUserModal.closeModal()
    },

    async localDeleteServiceUserByObject() {
      let response = null;
      for (const idServices of this.selectedServicesIdsLocal) {
        response = await this.$store.dispatch(
          'CollaborationModule/deleteServiceUserByObject',
          {
            id_user: this.userObject.id,
            id_object: this.$store.getters['Objects/getIdCurrentObject'],
            id_services: idServices
          });
      }
      if (!response) return false;

      if (response.codeResponse >= 400) return false;

      this.$toast.success('Пользователь отстранён',{ duration: 5000 })
      this.closeModal()
    },
    setSelectedServicesIdsLocal(selectedServices) {
      if ( ! selectedServices ) return false

      this.selectedServicesIdsLocal = [];
      this.selectedServicesIdsLocal.push(selectedServices.id);


    }
  },
};
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

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

}
.functional_icons{
  display: flex;
  justify-content: flex-end;
  grid-column-gap: 1em;
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
  transition: $transition;
  cursor: default;
  &:hover {
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #FFF4CB;
  }

  .user_info{
    display: grid;
    grid-template-columns: 1.6fr 1.4fr 1fr;
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
