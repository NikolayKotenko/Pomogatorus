<template>
  <div class="card_wrapper">
    <div class="info_wrapper">
      <DropDownMenuStyled :is-left="true" :is-offset-y="true">
        <template #icon>
          <v-avatar size="100">
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
          {{ getCompanyName }}
        </div>
        <div class="icon_wrapper">
          <IconTooltip
            :icon-text="'mdi-home-city'"
            :text-tooltip="'Объекты'"
            :color-icon="'#000000'"
          />
          <v-badge
            :content="getCountObjects"
            :value="getCountObjects"
            color="#95D7AE"
          />
          <IconTooltip
            :icon-text="'mdi-format-list-bulleted-type'"
            :text-tooltip="'Услуги'"
            :color-icon="'#000000'"
          />
          <v-badge
            :content="getCountServices"
            :value="getCountServices"
            color="#95D7AE"
          />
          <IconTooltip
            :icon-text="'mdi-heart-outline'"
            :text-tooltip="'В избранном у пользователей'"
            :color-icon="'#000000'"
          />
        </div>
      </div>
    </div>

    <DropDownMenuStyled>
      <template #icon>
        <IconTooltip
          :icon-text="'mdi-dots-horizontal-circle-outline'"
          :text-tooltip="'Другие действия'"
        />
      </template>
      <template #content>
        <v-card class="pa-2">
          <div>Не рекомедовать этого пользователя</div>
        </v-card>
      </template>
    </DropDownMenuStyled>
  </div>
</template>

<script>
import MiniUserCard from '../User/MiniUserCard.vue'
import DropDownMenuStyled from '../Common/DropDownMenuStyled.vue'
import IconTooltip from '../Common/IconTooltip.vue'

export default {
  name: 'PeopleCard',
  components: { IconTooltip, DropDownMenuStyled, MiniUserCard },
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
        return 'Компания: ' + this.userObject.company.name
      } else {
        return ''
      }
    },
    getCountObjects() {
      return this.userObject.objects.length
    },
    getCountServices() {
      return this.userObject.services.length
    }
  },

}
</script>

<style scoped lang="scss">
@import 'assets/styles/style';
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
      .human_fio {
        font-size: 1.5em;
        font-weight: 600;
      }
      .human_company {

      }
      .icon_wrapper {
        display: flex;
        grid-column-gap: 20px;
      }
    }
  }
}
</style>
