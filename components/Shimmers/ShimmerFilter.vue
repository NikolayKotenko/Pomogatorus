<template>
  <div class="shimmer-filter">
    <div v-for="line in size" :key="'shimmer-filter' + line" class="shimmer-filter__elem">
      <div class="shimmer-filter__elem__block animate"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShimmerFilter',
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
