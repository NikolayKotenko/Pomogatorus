<template>
  <v-app>
    <div v-if="error.statusCode === 404">
      <div class="error_container">
        <div class="error_title">
          <!--          <div class="error_number"> -->
          <!--            {{ pageNotFound }} -->
          <!--          </div> -->
          <div class="error_text">
            {{ pageNotFoundText }}
          </div>
          <ButtonStyled
            :is-nuxt-link="true"
            :href="'/'"
            :local-text="'На главную'"
            local-class="style_button"
          />
        </div>
        <div class="error_img">
          <v-img
            :src="require(`~/assets/svg/not_found_error.svg`)"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <span>
        {{ otherError }}
      </span>
    </div>
  </v-app>
</template>

<script>
import ButtonStyled from '../components/Common/ButtonStyled.vue';

export default {
  name: 'EmptyLayout',
  components: { ButtonStyled },
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404',
      pageNotFoundText: 'Ой, что-то пошло не так',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style lang="scss" scoped>
.error_container{
  display: flex;
  justify-content: space-between;
  .error_title{
    .error_number{
      font-size: 150px;
      font-weight: 500;
    }
    .error_text{
      font-size: 30px;
      font-weight: 500;
    }
  }
  .error_img{
    min-width: 600px;
  }
}

</style>
