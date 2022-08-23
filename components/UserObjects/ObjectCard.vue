<template>
  <div class="card_object_container__wrapper">
    <div class="card_object_container__wrapper__header" @click="openDetailCard">
      <span>Объект описан:</span>
      <span>22.06.2022</span>
    </div>
    <div class="card_object_container__wrapper__info">
      <div class="card_object_container__wrapper__info__block">
        <span class="card_object_container__wrapper__info__block__title">Площадь</span>
        <div class="card_object_container__wrapper__info__block__divider"></div>
        <span class="card_object_container__wrapper__info__block__value">172</span>
      </div>
      <div class="card_object_container__wrapper__info__block">
        <span class="card_object_container__wrapper__info__block__title">Готовность</span>
        <div class="card_object_container__wrapper__info__block__divider"></div>
        <span class="card_object_container__wrapper__info__block__value">Готов</span>
      </div>
    </div>
    <div class="card_object_container__wrapper__footer">
      <v-btn color="primary" small>
        Выбрать
      </v-btn>
    </div>

    <v-dialog
      max-width="600"
      v-model="showDetail"
    >
      <v-card>
        <v-card-title>

        </v-card-title>
        <v-card-text>

        </v-card-text>
        <v-card-actions>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ObjectCard",
  data: () => ({
    showDetail: false
  }),
  mounted() {
  },
  computed: {

  },
  methods: {
    openDetailCard() {
      this.showDetail = true
    },
  }
}
</script>

<style lang="scss" scoped>
@import "assets/styles/userObjects";

</style>
