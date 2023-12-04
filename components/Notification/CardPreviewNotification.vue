<template>
  <v-card>
    <div class="card_wrapper" @click="$emit('click-card')">
      <div class="header">
        <div class="title">
          Отправлена заявка №{{ taskObject.id }}
        </div>
        <div v-if="dateState" class="time">
          {{ taskObject.created_at_minutes }}
        </div>
        <div
          v-else
          class="time"
        >
          {{ taskObject.created_at_date }}
        </div>
      </div>
      <div class="main_info">
        <div class="text">
          Услуг: {{ taskObject.services.length }}
        </div>
        <div class="text">
          Исполнителей: {{ taskObject.ids_users.length }}
        </div>
        <div
          v-if="taskObject.notes"
          class="notes"
        >
          <div class="text">
            Примечание:
          </div>
          <v-textarea
            v-model="taskObject.notes"
            :hide-details="true"
            height="30"
            outlined
            color="#000000"
            disabled
          />
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>

import TaskWatchArea from './TaskWatchArea.vue';

export default {
  name: 'CardPreviewNotification',
  components: { TaskWatchArea },
  props: {
    taskObject: {
      type: Object,
      default: () => {},
    },
    dateState: {
      type: Boolean,
      default: false,
    }
  },

  methods: {

  },

}
</script>

<style lang="scss" scoped>
.card_wrapper {
  padding: 15px;
  border-radius: 10px !important;
  display: grid;
  grid-row-gap: 15px;
  background-color: #FFFFFF;
  transition: all 0.4s ease-in-out;
  &:hover {
    background-color: #FFF4CB;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 1.3em;
      font-weight: 700;
    }
    .time {
      color: #8A8784;
    }
  }
  .main_info {
    display: grid;
    grid-row-gap: 10px;
    .text {
      font-weight: 700;
    }
    .notes {
    }
  }
}
</style>
