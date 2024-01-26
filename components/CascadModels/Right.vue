<template>
  <v-navigation-drawer
    v-model="data.isOpen"
    v-click-outside="hideDrawer"
    :permanent="data.isOpen"
    :style="computedLayout"
    :width="widthModal"
    class="sidebar-wrapper"
    right
    temporary
    @transitionend="setId"
  >
    <component
      :is="currentComponent"
      v-if="data.isOpen"
      :object_data="$store.state.Objects.modalCurrentObject"
      @close-detail="closeCurrent"
      @wheel.prevent
      @touchmove.prevent
      @scroll.prevent
    />
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import ListObjects from '../UserObjects/ListObjects'
import ObjectDetail from '../UserObjects/ObjectDetail'
import UserInfo from '../User/UserInfo'

export default {
  name: 'Right',
  props: {
    data: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    widthModal: 0,
    idOverlay: 0
  }),

  watch: {
    'isSomeOpen': {
      handler(v) {
        if (v) {
          document.documentElement.style.overflow = 'hidden'
        } else {
          document.documentElement.style.overflow = 'auto'
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.getWidth)
      this.getWidth()
    })
  },
  computed: {
    ...mapState({
      listModal: state => state.listModal
    }),
    ...mapGetters(['isSomeOpen']),

    currentComponent() {
      if (this.data.name === 'UserInfo') {
        return UserInfo
      }
      if (this.data.name === 'ObjectDetail') {
        return ObjectDetail
      }
      if (this.data.name === 'ListObjects') {
        return ListObjects
      }
      return {}
    },
    isMobile() {
      return this.$device.isMobile
    },
    computedLayout() {
      return `z-index: ${400 * (this.index + 1)}; padding-top: ${this.isMobile ? '56px' : '0'}`
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWidth)
  },
  methods: {
    closeCurrent() {
      this.listModal[this.index].isOpen = false
    },
    getWidth() {
      if (process.client) {
        if (this.isMobile) {
          this.widthModal = window.innerWidth
        } else {
          this.widthModal = window.innerWidth * (0.6 - ((this.index + 1) / 10))
        }
      }
    },
    hideDrawer(e) {
      if (e.target.id === this.idOverlay) {
        this.closeCurrent()
      }
    },
    setId() {
      if (!this.data.isOpen) {
        return
      }

      this.$nextTick(() => {
        const overlay = document.querySelector('.v-overlay__scrim')

        if (!overlay) {
          return
        }

        this.idOverlay = new Date().valueOf().toString()
        overlay.id = this.idOverlay
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.sidebar-wrapper {
  overflow: hidden;
  position: fixed;
}
</style>
