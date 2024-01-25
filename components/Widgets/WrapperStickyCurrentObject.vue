<template>
  <div class="wrapper_current_object">
    <CurrentObjects ref="object-widget" class="current_local_object"/>

    <transition name="slide-fade">
      <NomenclatureWidget v-show="isObjectLoaded" ref="nomenclature-widget" class="nomenclature-widget"/>
    </transition>
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

            console.log(object)
            if (!object) {
              return
            }

            const objectHeight = object.offsetHeight
            const gap = 40

            const nomenclature = this.$refs['nomenclature-widget'] ? this.$refs['nomenclature-widget'].$el : null

            if (!nomenclature) {
              return
            }

            nomenclature.style.top = `${objectHeight + gap}px`

            this.isObjectLoaded = true
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
  height: 1px;
  //width: 1px;
  top: 15px;
  position: sticky;


  .current_local_object {
    top: 0;
    //right: -320px;
    position: absolute;
  }
}

.slide-fade-enter-active {
  transition: all .8s ease;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

.nomenclature-widget {
  position: absolute;
  top: 0;
}
</style>
