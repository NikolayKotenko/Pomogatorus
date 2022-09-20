<template>
  <div>
    <div class="author_wrapper" v-if="preview">
      <img
        class="author_wrapper__img"
        alt=""
        src="https://png.pngtree.com/png-vector/20200614/ourlarge/pngtree-businessman-user-avatar-character-vector-illustration-png-image_2242909.jpg"
      />
      <span class="author_wrapper__name">Копыткин Владислав</span>
      <span class="author_wrapper__date">26/05/2022</span>
    </div>
    <div class="author_wrapper preview-block" v-else>
      <img
        class="author_wrapper__img"
        alt=""
        src="https://png.pngtree.com/png-vector/20200614/ourlarge/pngtree-businessman-user-avatar-character-vector-illustration-png-image_2242909.jpg"
      />
      <span class="author_wrapper__name preview">Копыткин Владислав</span>
      <div class="author_wrapper__views">
        <v-icon> mdi-eye </v-icon>
        <span class="author_wrapper__views__count"> 3111 </span>
      </div>
      <div class="author_wrapper__date">
        <v-icon> mdi-clock-time-four-outline </v-icon>
        <span class="author_wrapper__date__value">26/05/2022</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Author',
  props: ['preview'],
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/lists';
</style>
