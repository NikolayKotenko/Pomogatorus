<template>
  <VTooltip :bottom="(! isTop)" :nudge-top="nudgeTop" :top="isTop">
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
    }
  }
}
</script>

