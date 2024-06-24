<template>
  <div v-if="! $store.getters.stateAuth" class="message_container">
    <div class="message_text">
      Чтобы увидеть ваши объекты, необходимо
    </div>
    <div
      class="btn"
      @click="$store.dispatch('openAuthModal')"
    >
      авторизоваться
    </div>
    <v-overlay :value="loadingPage" opacity="1">
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </div>
  <ListObjects v-else/>
</template>

<script>
import ListObjects from '../../components/UserObjects/ListObjects'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Index',
  components: { ListObjects },
  data() {
    return {
     loadingPage: false
    }
  },
  created() {
    this.loadingPage = true;
    setTimeout(() => {
      this.loadingPage = false;
    }, 2000);
  },
  mounted() {
    if (!this.$store.getters.stateAuth) {
      this.$store.state.stateAuthModal = true
    }
  }
}
</script>

<style lang="scss" scoped>
.message_container {
  display: flex;
  justify-content: center;
  margin-top: 100px;
  font-family: 'Inter', sans-serif;
  font-size: 2em;
  .btn {
    margin-left: 5px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
  }

}
</style>
