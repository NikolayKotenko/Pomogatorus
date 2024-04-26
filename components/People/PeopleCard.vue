<template>
  <div class="card_wrapper">
    <div class="info_wrapper">
      <DropDownMenuStyled :is-left="true" :is-offset-y="true">
        <template #icon>
          <v-avatar size="110">
            <v-img
              src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"
            />
          </v-avatar>
        </template>
        <template #content>
          <MiniUserCard :user-object="userObject"/>
        </template>
      </DropDownMenuStyled>
      <div class="human_info">
        <div class="human_fio">
          {{ userObject.user_fio }}
        </div>
        <div class="human_company">
          <span>Компания: </span>
          <span class="company_name">{{ getCompanyName }}</span>
        </div>
        <div class="additional_info_wrapper">
          <v-divider class="divider" vertical/>
          <div>
            <span>Объекты: </span>
            <span class="btn">{{ getCountObjects }}</span>
          </div>
          <div>
            <span>Услуги: </span>
            <span class="btn">{{ getCountServices }}</span>
          </div>
          <div>
            <span>Добавлен в избранные специалисты: </span>
            <span class="btn">{{ getCountServices }}</span>
          </div>
        </div>
      </div>
    </div>

    <DropDownMenuStyled
      :close-on-content-click="true"
      :is-top="true"
      :close-on-click-outside="true"
    >
      <template #icon>
        <IconTooltip
          :icon-text="'mdi-dots-horizontal-circle-outline'"
          :text-tooltip="'Действия с пользователем'"
          :size-icon="'32'"
          :color-icon="'#B3B3B3'"
        />
      </template>
      <template #content>
        <UserActionsButton
          :user-object="userObject"
        />
      </template>
    </DropDownMenuStyled>
  </div>
</template>

<script>
import MiniUserCard from '../User/MiniUserCard.vue'
import DropDownMenuStyled from '../Common/DropDownMenuStyled.vue'
import IconTooltip from '../Common/IconTooltip.vue'
import UserActionsButton from '../Common/UserActionsButton.vue'

export default {
  name: 'PeopleCard',
  components: { IconTooltip, DropDownMenuStyled, MiniUserCard, UserActionsButton },
  props: {
    userObject: {
      type: Object,
      default: () => {},
      required: true,
    }
  },
  computed: {
    getCompanyName() {
      if (this.userObject.company !== null) {
        return '"' + this.userObject.company.name + '"'
      } else {
        return 'Независимый специалист'
      }
    },
    getCountObjects() {
      return this.userObject.objects.length
    },
    getCountServices() {
      return this.userObject.services.length
    },
    stateCurrentUser() {
      return this.$store.state.CollaborationModule.listFavoriteUsers.some((elem) => {
        return elem.id_favorite_user === this.userObject.id
      })
    },

  },
  methods: {

  }

}
</script>

<style scoped lang="scss">
@import 'assets/styles/style';

.action_menu {
  padding: 10px;
  display: grid;
  grid-row-gap: 5px;
  border-radius: 5px;
  border: 1px solid #FFDB58;
  background-color: $background-element-color;
  .menu_elem {
    width: 100%;
    cursor: pointer;
    transition: $transition;
    &:hover {
      background-color: #dadada;
    }
  }
}


.card_wrapper {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  background-color: $background-element-color;
  border-radius: 10px;
  box-shadow: $shadowBox;
  transition: $transition;
  &:hover {
    background-color: $dull-yellow-color;
  }

  .info_wrapper {
    display: flex;
    grid-column-gap: 20px;
    .human_info {
      display: grid;
      grid-row-gap: 10px;
      .human_fio {
        font-size: 1.5em;
        font-weight: 600;
      }
      .human_company {
        .company_name {
          font-weight: 600;
        }
      }
      .additional_info_wrapper {
        display: flex;
        grid-column-gap: 20px;
        align-items: center;
        .divider {
          height: 30px;
          border-color: #000000 !important;
          border-width: 1px;
        }
        .btn {
          font-weight: 600;
          text-decoration: underline;
          color: $blue-icon-color;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
