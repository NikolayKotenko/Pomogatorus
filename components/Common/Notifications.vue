<template>
  <v-container class="notification_container">
    <span class="header">Уведомления</span>
    <section class="notification_wrapper">
      <v-tabs color="#000000">
        <v-tab :key="0">
          Входящие заявки
          <v-badge
            content="2"
            value="2"
            color="#95D7AE"
          />
        </v-tab>
        <v-tab :key="1">
          Отправленные заявки
          <v-badge
            content="2"
            value="2"
            color="#95D7AE"
          />
        </v-tab>
        <v-tab-item :key="0">
          <div class="message_wrapper">
            <span class="message_time">Сегодня</span>
            <v-menu
              :close-on-content-click="false"
              left
              offset-x
            >
              <template #activator="{ on, attrs }">
                <div
                  class="message_card"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-avatar
                    color="primary"
                    size="70"
                  />
                  <div class="message_info">
                    <div class="message_header">
                      <span class="message_user">Иванов Иван</span>
                      <span class="message_date">14:20</span>
                    </div>
                    <div class="message_text">
                      Приглашает на объект “Куса Баня, Красные орлы 7”
                    </div>
                    <div class="message_bottom_info">
                      <span class="accept_btn">Принять</span>
                      <span class="reject_btn">Отклонить</span>
                    </div>
                  </div>
                </div>
              </template>
              <div class="more_info_container">
                <span class="more_info_title">Заявка на выполнение услуг</span>
                <div class="object_info">
                  <div class="object_img">
                    <v-img
                      src="https://s0.rbk.ru/v6_top_pics/media/img/0/67/756480231662670.jpg"
                    />
                  </div>
                  <div class="object_options">
                    <li class="options_text">
                      Общая площадь: 20 кв.м.
                    </li>
                    <li class="options_text">
                      Общая площадь: 20 кв.м.
                    </li>
                    <li class="options_text">
                      Общая площадь: 20 кв.м.
                    </li>
                    <li class="options_text">
                      Общая площадь: 20 кв.м.
                    </li>
                    <li class="options_text">
                      Общая площадь: 20 кв.м.
                    </li>
                  </div>
                </div>
                <div class="services_info">
                  <div class="info_title">
                    Иванов Иван приглашает Вас на объект "Куса Баня, Красные орлы 7" в качестве исполнителя услуг:
                  </div>
                  <div class="info_list_services">
                    <li class="info_list_text">
                      Монтаж котлов
                    </li>
                    <li class="info_list_text">
                      Монтаж котлов
                    </li>
                    <li class="info_list_text">
                      Монтаж котлов
                    </li>
                  </div>
                </div>
                <div class="buttons_info">
                  <ButtonStyled
                    :local-text="'Принять заявку'"
                    :local-class="'style_button'"
                  />
                  <ButtonStyled
                    :local-text="'Отклонить заявку'"
                    :local-class="'style_close'"
                  />
                </div>
              </div>
            </v-menu>
            <div class="message_card">
              <v-avatar
                color="primary"
                size="70"
              />
              <div class="message_info">
                <div class="message_header">
                  <span class="message_user">Иванов Иван</span>
                  <span class="message_date">14:20</span>
                </div>
                <div class="message_text">
                  Приглашает на объект “Куса Баня, Красные орлы 7”
                </div>
                <div class="message_bottom_info">
                  <span class="accept_btn">Принять</span>
                  <span class="reject_btn">Отклонить</span>
                </div>
              </div>
            </div>
          </div>
        </v-tab-item>
        <v-tab-item :key="1">
          <div class="message_wrapper">
            <span class="message_time">Сегодня</span>
            <div class="message_card">
              <v-avatar
                color="primary"
                size="70"
              />
              <div class="message_info">
                <div class="message_header">
                  <span class="message_user">Иванов Иван</span>
                  <span class="message_date">14:20</span>
                </div>
                <div class="message_text">
                  Приглашает на объект “Куса Баня, Красные орлы 7”
                </div>
                <div class="message_bottom_info">
                  <span class="state_application">Состояние заявки: </span>
                </div>
              </div>
            </div>
            <div class="message_card">
              <v-avatar
                color="primary"
                size="70"
              />
              <div class="message_info">
                <div class="message_header">
                  <span class="message_user">Иванов Иван</span>
                  <span class="message_date">14:20</span>
                </div>
                <div class="message_text">
                  Приглашает на объект “Куса Баня, Красные орлы 7”
                </div>
                <div class="message_bottom_info">
                  <span class="state_application">Состояние заявки: </span>
                </div>
              </div>
            </div>
          </div>
        </v-tab-item>
      </v-tabs>
    </section>
  </v-container>
</template>

<script>
import ButtonStyled from './ButtonStyled.vue';

export default {
  name: 'Notifications',
  components: { ButtonStyled }
}
</script>

<style lang="scss" scoped>

$grey-color: #8A8784;


.notification_container {
  width: 550px;
  max-height: 850px;
  padding: 20px;
  display: grid;
  grid-row-gap: 20px;
  background-color: #FFFFFF;
  box-shadow: -2px 2px 4px 0px rgba(0, 0, 0, 0.25), 2px 2px 4px 0px rgba(0, 0, 0, 0.25);
  .header {
    font-size: 1.2em;
    font-weight: 700;
  }
  .notification_wrapper {
    .message_wrapper {
      display: grid;
      grid-row-gap: 20px;
      .message_time {
        font-size: 0.9em;
        font-weight: 400;
        color: $grey-color;
      }

      .message_card {
        width: 100%;
        max-height: 100px;
        padding: 15px;
        border-radius: 5px;
        display: flex;
        grid-column-gap: 15px;
        transition: all 0.4s ease-in-out;
        cursor: pointer;
        &:hover {
          background-color: #FFF4CB;
        }

        .message_info {
          width: 100%;
          .message_header {
            display: flex;
            justify-content: space-between;
            .message_user{
              font-weight: 700;
            }
            .message_date{
              font-size: 0.9em;
              color: $grey-color;
            }
          }
          .message_text {
            font-size: 0.9em;
          }
          .message_bottom_info {
            display: flex;
            grid-column-gap: 30px;
            .accept_btn {
              transition: all 0.4s ease-in-out;
              &:hover {
                scale: 1.1;
              }
            }
            .reject_btn {
              color: $grey-color;
              transition: all 0.4s ease-in-out;
              &:hover {
                scale: 1.1;
              }
            }
            .state_application {
              font-size: 0.9em;
            }
          }
        }
      }
    }

  }
}

.more_info_container {
  padding: 20px;
  background-color: #FFFFFF;
  width: 580px;
  display: grid;
  grid-row-gap: 20px;
  .more_info_title{
    font-size: 1.2em;
    font-weight: 700;

  }
  .object_info {
    display: flex;
    grid-column-gap: 20px;
    .object_img {
      max-width: 300px;
      max-height: 190px;
    }
    .object_options {
      .options_text {
        font-size: 0.9em;
        color: $grey-color;
      }
    }

  }
  .buttons_info {
    display: flex;
  }

}
</style>
