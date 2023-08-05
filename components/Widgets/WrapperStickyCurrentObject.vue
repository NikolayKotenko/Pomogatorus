<template>
  <div class="wrapper_current_object">
    <CurrentObjects class="current_local_object"/>
  </div>
</template>

<script>
import CurrentObjects from './CurrentObjects.vue';

export default {
  name: 'WrapperStickyCurrentObject',
  components: { CurrentObjects }
};
</script>

<style lang="scss" scoped>
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
</style>
