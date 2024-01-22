<template>
  <v-container
    class="notification_wrapper"
  >
    <div class="notification_container">
      <v-tabs
        fixed-tabs
        background-color="#F2F2F2"
        class="cards_wrapper"
        color="#00000"
      >
        <v-tab
          :key="0"
          @click="objTask = {}"
        >
          Входящие
          <!--          <v-badge -->
          <!--            content="2" -->
          <!--            value="2" -->
          <!--            color="#95D7AE" -->
          <!--          /> -->
        </v-tab>
        <v-tab
          :key="1"
          @click="objTask = {}"
        >
          Исходящие
          <v-badge
            :content="$store.getters['NotificationModule/getCountTasks']"
            :value="$store.getters['NotificationModule/getCountTasks']"
            color="#95D7AE"
          />
        </v-tab>
        <v-tab-item :key="0">
          <div
            class="empty_messages"
          >
            У вас нет входящих уведомлений
          </div>
        </v-tab-item>
        <v-tab-item :key="1">
          <div class="preview_card_wrapper">
            <div
              v-if="$store.getters['NotificationModule/getListTasksByToday'].length"
              class="preview_card"
            >
              <div class="date_text">
                Сегодня
              </div>
              <CardPreviewNotification
                v-for="(item, index) in $store.getters['NotificationModule/getListTasksByToday']"
                :key="index"
                :task-object="item"
                :date-state="true"
                @click-card="setObjTask(item)"
              />
            </div>
            <div
              v-if="$store.getters['NotificationModule/getListTasksByYesterday'].length"
              class="preview_card"
            >
              <div class="date_text">
                Вчера
              </div>
              <CardPreviewNotification
                v-for="(item, index) in $store.getters['NotificationModule/getListTasksByYesterday']"
                :key="index"
                :task-object="item"
                @click-card="setObjTask(item)"
              />
            </div>
            <div
              v-if="$store.getters['NotificationModule/getListTasksByWeek'].length"
              class="preview_card"
            >
              <div class="date_text">
                Неделя
              </div>
              <CardPreviewNotification
                v-for="(item, index) in $store.getters['NotificationModule/getListTasksByWeek']"
                :key="index"
                :task-object="item"
                @click-card="setObjTask(item)"
              />
            </div>
            <div
              v-if="$store.getters['NotificationModule/getListTasksByMonth'].length"
              class="preview_card"
            >
              <div class="date_text">
                Месяц
              </div>
              <!-- <v-btn @click="getMessage">asfaf</v-btn> -->
              <CardPreviewNotification
                v-for="(item, index) in $store.getters['NotificationModule/getListTasksByMonth']"
                :key="index"
                :task-object="item"
                @click-card="setObjTask(item)"
              />
            </div>
          </div>
        </v-tab-item>
      </v-tabs>
    </div>
    <v-divider vertical/>
    <div class="card_task">
      <TaskWatchArea
        v-if="Object.keys(objTask).length"
        :task-data-for-view="objTask"
      />
    </div>
  </v-container>
</template>

<script>
import CardPreviewNotification from '../../components/Notification/CardPreviewNotification.vue';
import TaskWatchArea from '../../components/Notification/TaskWatchArea.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Index',
  components: { TaskWatchArea, CardPreviewNotification },
  data() {
    return {
      objTask: {},
    }
  },
  computed:{
    isMobile() {
      return this.$device.isMobile;
    }
  },
  async mounted() {
    await this.$store.dispatch('NotificationModule/getListTasks')

    this.socket = this.$nuxtSocket({
      name: 'home',
      channel: '/index',

      reconnection: false
    })
    this.socket.on('someEvent', (msg, cb) => {
      console.log('its working');
    })
  },

  methods: {
    setObjTask(obj) {
      this.objTask = obj
    },
    method1() {
      this.socket.emit('method1', {
        hello: 'world'
      }, (resp) => {
        
      })
    },
    async getMessage() {
      console.log('1234', this.messageRxd);
      this.messageRxd = await this.socket.emitP('getMessage' , {
        id: 'abc123'
      })
    }
  },

}
</script>

<style lang="scss" scoped>
.notification_wrapper {
  display: flex;
  grid-column-gap: 20px;
}

.notification_container {
  display: flex;
  min-width: 415px;
  padding: 1em;
  max-height: 100vh;
  overflow: scroll;
  .cards_wrapper {
    .empty_messages {
      height: 100%;
      min-height: 100px;
      width: 100%;
      background-color: #FFFFFF;
      border-radius: 10px;
      color: #000000;
      font-size: 1.3em;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .preview_card_wrapper {
      background-color: #F2F2F2;
      display: grid;
      grid-row-gap: 20px;
      .date_text {
        color: #8A8784;
      }
      .preview_card{
        display: grid;
        grid-row-gap: 20px;
      }
    }
  }
}
.card_task {
  padding: 1em;
  max-height: 100vh;
  overflow: scroll;
  width: 100%;
}
</style>
