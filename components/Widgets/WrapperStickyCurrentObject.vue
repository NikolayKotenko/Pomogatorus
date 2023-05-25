<template>
  <div class="wrapper_current_object">
    <CurrentObjects class="current_local_object"></CurrentObjects>
  </div>
</template>

<script>
import CurrentObjects from "./CurrentObjects.vue";

export default {
  name: "WrapperStickyCurrentObject",
  components: {CurrentObjects}
}
</script>

<style scoped lang="scss">
.wrapper_current_object {
  height: 1px;
  //width: 1px;
  top: 15px;
  position: sticky;
  .current_local_object{
    top: 0;
    //right: -320px;
    position: absolute;
  }
}
</style>
