<template>
  <div class="card_object_container__wrapper">
    <div class="card_object_container__wrapper__header" @click="openDetailCard">
      <span>Объект описан:</span>
        <span>{{ object_data.created_at }}</span>
    </div>
    <div class="card_object_container__wrapper__info" @click="openDetailCard">
      <div class="card_object_container__wrapper__info__block">
        <span class="card_object_container__wrapper__info__block__title">Площадь</span>
        <div class="card_object_container__wrapper__info__block__divider"></div>
        <span class="card_object_container__wrapper__info__block__value"> {{ object_data.total_area ? object_data.total_area : '0' }} </span>
      </div>
      <div class="card_object_container__wrapper__info__block">
        <span class="card_object_container__wrapper__info__block__title">Готовность</span>
        <div class="card_object_container__wrapper__info__block__divider"></div>
        <span class="card_object_container__wrapper__info__block__value">Готов</span>
      </div>
    </div>
    <div class="card_object_container__wrapper__footer">
      <v-btn outlined color="green lighten-1" small v-if="selectedObj" min-width="150">
        Выбран
      </v-btn>
      <v-btn color="primary" small v-else @click="setObject" min-width="150">
        Выбрать
      </v-btn>
    </div>

    <v-dialog
      max-width="800"
      v-model="showDetailObj"
    >
      <ObjectDetail
        v-if="showDetailObj"
        :object_data="object_data"
        @closeDetail="closeDetail"
      />
    </v-dialog>
  </div>
</template>

<script>
import ObjectDetail from "./ObjectDetail";
export default {
  name: "ObjectCard",
  props: ['object_data'],
  components: {ObjectDetail},
  data: () => ({
    showDetailObj: false,
  }),
  mounted() {
  },
  computed: {
    selectedObj() {
      if (!this.$store.state.currentObject) return false
      if (!Object.keys(this.$store.state.currentObject).length) return false
      return this.object_data.id === this.$store.state.currentObject?.id
    }
  },
  methods: {
    setObject() {
      this.$store.commit('set_currentObject', this.object_data)
    },
    openDetailCard() {
      this.showDetailObj = true
    },
    async closeDetail() {
      this.showDetailObj = false
      await this.$store.dispatch('loginByToken')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "assets/styles/userObjects";

</style>
