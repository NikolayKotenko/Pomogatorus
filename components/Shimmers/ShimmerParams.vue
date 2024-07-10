<template>
  <div class="shimmer-params">
    <div v-for="line in size" :key="'shimmer-param' + line" class="shimmer-params__elem">
      <div class="shimmer-params__elem__block animate"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShimmerParams',
  props: {
    size: {
      type: Number,
      default: 8
    }
  }
}
</script>

<style scoped>

</style>
