<template>
  <div class="task_wrapper">
    <div class="container_title">
      Заявки на выполнение услгу №{{ taskDataForView.id }}
    </div>
    <div class="main_content">
      <div class="services">
        <div class="section_title">
          Услуги:
        </div>
        <div
          v-for="(item, index) in taskDataForView.services"
          :key="index"
          class="service_card"
        >
          <div class="service_header">
            <li class="service_title">
              {{ item.ServiceData.name }}
            </li>
            <div class="service_info">
              <v-text-field
                v-model="item.quantity"
                class="price_field"
                disabled
                dense
                height="40"
                hide-details
                outlined
                label="Кол-во"
                placeholder="Цена услуги"
              />
              <v-text-field
                v-model="item.price"
                class="price_field"
                disabled
                dense
                height="40"
                hide-details
                outlined
                label="Цена услуги"
                placeholder="Цена услуги"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="users">
        <div class="section_title">
          Исполнители:
        </div>
        <li
          v-for="(item, index) in $store.state.NotificationModule.listUsers"
          :key="index"
          class="user_fio"
        >
          {{ item.user_fio }}
        </li>
      </div>
      <div class="notes">
        <div class="section_title">
          Примечание:
        </div>
        <div class="text_area_style">
          <v-textarea
            v-model="taskDataForView.notes"
            :hide-details="true"
            outlined
            color="#000000"
            disabled
            placeholder="Примечание отсутствует"
          />
        </div>
      </div>
    </div>
    <v-overlay
      class="overlay_style"
      color="#F2F2F2"
      opacity="100"
      absolute
      :value="$store.state.NotificationModule.loading"
    >
      <v-progress-circular
        indeterminate
        color="#95D7AE"
        size="64"
      />
    </v-overlay>
  </div>
</template>

<script>
import Task from '../Collaboration/Task.vue';

export default {
  name: 'TaskWatchArea',
  components: Task,
  props: {
    taskDataForView: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      localUsersData: [],

    }
  },
  watch: {
    'taskDataForView.id': {
      handler(v) {
        this.$store.dispatch('NotificationModule/getListUsers', this.taskDataForView.ids_users)
      },
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.task_wrapper{
  //position: fixed;
  max-width: 700px;
  width: 100%;
  display: grid;
  grid-row-gap: 20px;
  position: relative;
  .container_title {
    font-size: 1.5em;
    font-weight: 700;
  }
  .main_content{
    display: grid;
    grid-row-gap: 20px;
    .services {
      display: grid;
      grid-row-gap: 1em;
      .service_card {
        display: grid;
        .service_header {
          display: inline-flex;
          justify-content: space-between;
          align-items: center;
          .service_title {
            font-size: 1.2em;
          }
          .service_info {
            display: flex;
            grid-column-gap: 1em;
            .price_field {
              max-width: 100px;
            }
          }
        }
      }
    }
    .users {
      display: grid;
      grid-row-gap: 1em;
      .user_fio {
        font-size: 1.2em;
      }
    }
    .notes {
      display: grid;
      grid-row-gap: 1em;
      .text_area_style {

      }
    }
  }
  .overlay_style {
    transition: 0s !important;
  }
}

.section_title {
  font-size: 1.2em;
  font-weight: 500;
}
</style>
