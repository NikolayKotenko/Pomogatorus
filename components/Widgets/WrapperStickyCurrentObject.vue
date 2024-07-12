<template>
  <div class="wrapper_current_object">
    <!--    <v-expansion-panels> -->
    <!--      <v-expansion-panel> -->
    <!--        <v-expansion-panel-header> -->
    <!--          <span class="label">Ваш текущий объект</span> -->
    <!--        </v-expansion-panel-header> -->
    <!--        <v-expansion-panel-content> -->
    <CurrentObjects ref="object-widget" class="current_local_object"/>
    <!--        </v-expansion-panel-content> -->
    <!--      </v-expansion-panel> -->
    <!--      <v-expansion-panel> -->
    <!--        <v-expansion-panel-header> -->
    <!--          <span class="label">Рекомендуемое оборудование</span> -->
    <!--        </v-expansion-panel-header> -->
    <!--        <v-expansion-panel-content> -->
    <!--          <NomenclatureWidget -->
    <!--            ref="nomenclature-widget" -->
    <!--            :class="{'show-widget': isObjectLoaded}" -->
    <!--            class="nomenclature-widget" -->
    <!--            style="top: 430px;" -->
    <!--          /> -->
    <!--        </v-expansion-panel-content> -->
    <!--      </v-expansion-panel> -->
    <!--    </v-expansion-panels> -->
  </div>
</template>

<script>
import CurrentObjects from './CurrentObjects.vue'
import NomenclatureWidget from './NomenclatureWidget'

export default {
  name: 'WrapperStickyCurrentObject',
  components: { NomenclatureWidget, CurrentObjects },
  data: () => ({
    isObjectLoaded: false
  }),
  watch: {
    '$store.state.Objects.isLoadingObjects': {
      handler(v) {
        if (v) {
          this.getNomenclaturePosition()
        }
      }
    }
  },
  methods: {
    getNomenclaturePosition() {
      if (process.client) {
        this.$nextTick(() => {
          // Отложенная загрузка виджета через 5 сек
          setTimeout(() => {
            const object = this.$refs['object-widget'] ? this.$refs['object-widget'].$el : null

            if (!object) {
              return
            }

            const objectHeight = object.offsetHeight
            const gap = 40 // Отступ виджета от другого

            const nomenclature = this.$refs['nomenclature-widget'] ? this.$refs['nomenclature-widget'].$el : null

            if (!nomenclature) {
              return
            }

            nomenclature.style.top = `${objectHeight + gap}px`

            this.isObjectLoaded = true

            this.$refs['nomenclature-widget'].getNomenclature('start')
          }, 5000)
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@media (min-width: 1233px) {
  .wrapper_current_object {
    display: block;
  }
}

.wrapper_current_object {
  width: 290px;
  min-width: 290px;
  //position: sticky;
  //top: 15px;
  //height: 1px;


  .label {
    font-size: 1.2em;
  }
}

//.wrapper_current_object {
//  height: 1px;
//  //width: 1px;
//  top: 15px;
//  position: sticky;
//
//
//  .current_local_object {
//    top: 0;
//    //right: -320px;
//    position: absolute;
//  }
//}
//
//.nomenclature-widget {
//  position: absolute;
//  top: 0;
//  opacity: 0;
//  transform: translateY(40px);
//}
//
//.show-widget {
//  opacity: 1;
//  transform: translateY(0);
//}
</style>
