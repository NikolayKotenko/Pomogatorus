<template>
  <VTooltip v-model="show" :bottom="(! isTop)" :nudge-top="nudgeTop" :top="isTop" retain-focus-on-click>
    <template #activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <slot/>
      </div>
    </template>
    <template v-if="isAnswer">
      <span class="tooltip-styled d-flex flex-column">
        <span>Вопрос:</span>
        <span class="font-weight-bold">{{ title }}</span>
        <span>Ответ:</span>
        <span v-if="!answer" class="red-color font-weight-bold">Не заполнен</span>
        <span v-else class="font-weight-bold green-color" v-html="answer"/>
      </span>
    </template>
    <template v-else>
      <span class="tooltip-styled">{{ title }}</span>
    </template>
  </VTooltip>
</template>

<script>
export default {
  name: 'TooltipStyled',
  props: {
    title: {
      type: String,
      default: ''
    },
    isTop: {
      type: Boolean,
      default: false
    },
    nudgeTop: {
      type: Number,
      default: 0
    },
    isAnswer: {
      type: Boolean,
      default: false
    },
    answer: {
      type: String,
      default: ''
    },
    offHiding: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    show: false
  }),
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isMobile) {
        window.addEventListener('scroll', this.checkScroll)
      }
    })
  },
  beforeDestroy() {
    this.$nextTick(() => {
      if (this.isMobile) {
        window.removeEventListener('scroll', this.checkScroll)
      }
    })
  },
  methods: {
    checkScroll() {
      if (process.client) {
        this.$nextTick(() => {
          if (!this.offHiding) {
            this.show = false
          }
        })
      }
    }
  }
}
</script>

