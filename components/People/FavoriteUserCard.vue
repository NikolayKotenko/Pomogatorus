<template>
  <div class="card_wrapper">
    <div class="user_wrapper">
      <DropDownMenuStyled :is-left="true" :is-offset-y="true">
        <template #icon>
          <v-avatar size="110">
            <v-img
              src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"
            />
          </v-avatar>
        </template>
        <template #content>
          <MiniUserCard :user-object="userObject._users"/>
        </template>
      </DropDownMenuStyled>
      <div class="user_info">
        <div class="user_fio">
          {{ userObject._users.user_fio }}
        </div>
        <v-rating
          :value="4"
          background-color="#B3B3B3"
          color="#95D7AE"
          empty-icon="mdi-star-outline"
          full-icon="mdi-star"
          half-icon="mdi-star-half-full"
          hover
          length="5"
          readonly
          size="20"
        />
      </div>
    </div>

    <DropDownMenuStyled>
      <template #icon>
        <IconTooltip
          :icon-text="'mdi-dots-horizontal-circle-outline'"
          :text-tooltip="'Другие действия'"
          :size-icon="'32'"
          :color-icon="'#B3B3B3'"
        />
      </template>
      <template #content>
        <v-card class="pa-2">
          <div>Не рекомедовать этого пользователя</div>
          <v-btn
            @click="$store.dispatch('CollaborationModule/deleteFavoriteUser', userObject._users.id)"
          >
            Убрать из избранных специалистов
          </v-btn>
        </v-card>
      </template>
    </DropDownMenuStyled>
  </div>
</template>

<script>

import DropDownMenuStyled from '../Common/DropDownMenuStyled.vue'
import MiniUserCard from '../User/MiniUserCard.vue'
import IconTooltip from '../Common/IconTooltip.vue'

export default {
  components: { IconTooltip, MiniUserCard, DropDownMenuStyled },
  props: {
    userObject: {
      type: Object,
      default: () => {},
      required: true,
    }
  }
}
</script>


<style scoped lang="scss">
@import 'assets/styles/style';

.card_wrapper{
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
  .user_wrapper {
    display: flex;
    grid-column-gap: 20px;
    .user_info {
      display: grid;
      grid-row-gap: 10px;
      .user_fio {
        font-size: 1.5em;
        font-weight: 400;
      }
    }
  }
}
</style>
