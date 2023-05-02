<template>
  <div class="card_object_container__wrapper">
    <div class="card_object_container__wrapper__img" />
    <div class="card_object_container__wrapper__header" @click="openDetailCard">
      <span>{{ object_data.address }}</span>
      <span>{{ object_data.created_at }}</span>
    </div>
    <div class="card_object_container__wrapper__info" @click="openDetailCard">
      <div class="card_object_container__wrapper__info__block">
        <span class="card_object_container__wrapper__info__block__title">Площадь</span>
        <div class="card_object_container__wrapper__info__block__divider" />
        <span class="card_object_container__wrapper__info__block__value">
          {{ object_data.total_area ? object_data.total_area : "0" }}
        </span>
      </div>
      <div class="card_object_container__wrapper__info__block">
        <span class="card_object_container__wrapper__info__block__title">Готовность</span>
        <div class="card_object_container__wrapper__info__block__divider" />
        <span class="card_object_container__wrapper__info__block__value">Готов</span>
      </div>
    </div>
    <div class="card_object_container__wrapper__footer">
      <VBtn v-if="selectedObj" color="green lighten-1" min-width="150" outlined small>
        Выбран
      </VBtn>
      <VBtn v-else color="primary" min-width="150" small @click="setObject">
        Выбрать
      </VBtn>
    </div>
  </div>
</template>

<script>
import ObjectDetail from "./ObjectDetail";

export default {
  name: "ObjectCard",
  components: { ObjectDetail },
  props: ["object_data"],
  data: () => ({
    showDetailObj: false
  }),
  computed: {
    selectedObj() {
      if (!this.$store.state.Objects.currentObject) return false;
      if (!Object.keys(this.$store.state.Objects.currentObject).length) return false;
      return this.object_data.id === this.$store.state.Objects.currentObject?.id;
    },
    modalWidth() {
      if (process.client) {
        return window.innerWidth * 0.5;
      } else {
        return 0;
      }
    }
  },
  watch: {},
  mounted() {
  },
  methods: {
    async setObject() {
      await this.$store.dispatch("Objects/setCurrentObject", this.object_data);
    },
    openDetailCard() {
      this.$emit("open-detail", this.object_data);
      // this.$store.state.Objects.modalCurrentObject = this.object_data
      // this.$store.state.listModal[1].isOpen = true
    },
    async closeDetail() {
      this.showDetailObj = false;
      await this.$store.dispatch("loginByToken");
    }
  }
};
</script>

<style lang="scss" scoped>
.v-navigation-drawer {
  z-index: 410 !important;
}

@import 'assets/styles/userObjects';
</style>
