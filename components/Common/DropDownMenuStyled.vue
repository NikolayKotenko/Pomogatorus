<template>
  <v-menu :close-on-content-click="false" left offset-y>
    <template #activator="{ on, attrs }">
      <div
        v-bind="attrs"
        v-on="on"
      >
        <slot name="icon"></slot>
      </div>
    </template>
    <v-card class="pa-4">
      <slot name="content"></slot>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: "DropDownMenuStyled",
  props: {
    slotIcon: {
      type: Boolean,
      default: false
    },
    slotContent: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>

</style>
