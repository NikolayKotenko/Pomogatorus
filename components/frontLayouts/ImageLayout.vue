<template>
  <div :id="`component_wrapper-${index_component}`" class="image_wrapper" contenteditable="false">
    <img :alt="altName" :src="srcPath" :title="titleName" class="main_img inserted_image" @click="onClick">
  </div>
</template>

<script>
export default {
  name: 'ImageLayout',
  data: () => ({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    index_component: null,
    data_image: null
  }),
  computed: {
    srcPath() {
      return this.$store.state.BASE_URL + this.data_image?.full_path
    },
    altName() {
      return this.data_image?.name
    },
    titleName() {
      return this.data_image?.title
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.data_image = this.$store.state.ArticleModule.selectedComponent
      this.index_component = this.$store.state.ArticleModule.countLayout
      this.getHeightOfControls()
      this.getWidthOfControls()
    },
    deleteQuestion() {
      const elem = document.getElementById(`component_wrapper-${this.index_component}`)
      elem.remove()
      this.$store.dispatch('deleteComponent', this.index_component)
    },
    onResize: function(x, y, width, height) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
    },
    getWidthOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(`component_wrapper-${this.index_component}`)
        if (elem) {
          this.controls_width = elem.getBoundingClientRect().width + 6
        } else {
          this.controls_width = 0
        }
      })
    },
    getHeightOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(`component_wrapper-${this.index_component}`)
        if (elem) {
          this.controls_height = elem.getBoundingClientRect().height + 22
        } else {
          this.controls_height = 0
        }
      })
    },
    onClick() {
      this.$store.commit('set_index_image', this.data_image.index_image - 1)
    }
  }
}
</script>

<style lang='scss' scoped>
.image_wrapper {
  //min-height: 150px;
  //min-width: 50px;
  //max-width: 600px;
  //max-height: 600px;
  position: relative;
  padding: 16px 10px 8px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.inserted_image {
  width: 100%;
  height: 100%;
}

::v-deep .vdr {
  position: relative !important;
  border: 1px dashed rgba(0, 0, 0, 0);
  transition: border 0.5s ease-in-out;
}

::v-deep .handle {
  position: absolute !important;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
</style>
