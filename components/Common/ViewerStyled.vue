<template>
  <viewer
    ref="viewer"
    :class="customClass"
    :images="images"
    :options="computedOptions"
    @inited="inited"
  >
    <div @click="onClick">
      <slot/>
    </div>
  </viewer>
</template>

<script>
import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import Vue from 'vue'
import calculateAspectRatioFit from '../../utils/saveImageRatio'

Vue.use(VueViewer)

export default {
  name: 'ViewerStyled',
  props: {
    options: {
      type: Object,
      default: () => ({
        'movable': false,
        'zoomable': true,
        'rotatable': false,
        'scalable': false
      })
    },
    images: {
      type: Array,
      required: true,
      default: () => ([])
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    indexImage: 0,
    viewerId: 0
  }),
  computed: {
    computedOptions() {
      return Object.assign({}, this.options, { initialViewIndex: this.indexImage })
    }
  },
  methods: {
    inited(viewer) {
      this.$viewer = viewer
      this.viewerId = viewer.id
    },
    open(index) {
      this.indexImage = index
      setTimeout(() => {
        this.$viewer.show()
        this.onClick()
      }, 0)
    },
    onClick() {
      const self = this
      const height = 100

      setTimeout(() => {
        const viewerElement = document.querySelector(`#viewer${this.viewerId}`)

        if (viewerElement) {
          viewerElement.classList.add('blur-background')

          const footer = viewerElement.querySelector('.viewer-footer > .viewer-navbar')
          footer.style.height = `${height}px`

          const viewerList = footer.querySelector('.viewer-list')
          viewerList.style.height = `${height}px`
          viewerList.classList.add('fullWidth')

          setTimeout(() => {
            const children = viewerList.getElementsByTagName('li')

            for (const element of children) {
              const img = new Image()
              img.onload = function() {
                self.$nextTick(() => {
                  const sizes = calculateAspectRatioFit(this.width, this.height, 140, height)
                  const image = element.getElementsByTagName('img')[0]

                  element.style.height = `${sizes.height}px`
                  element.style.width = `${sizes.width}px`

                  image.style.height = `${sizes.height}px`
                  image.style.width = `${sizes.width}px`
                  image.style.transform = 'unset'
                })
              }

              img.src = element.getElementsByTagName('img')[0]?.src ?? ''
            }
          }, 400)
        }
      }, 0)
    }
  }
}
</script>
