<template>
  <div class="biathlon_wrapper">
    <v-footer
      style="
      display: flex;
      justify-content: space-between"
      fixed
      padless
    >
      <div class="social_buttons">
        <ViewsAndLikes/>
        <SocialShare/>
      </div>
      <div class="biathlon">
        <v-sheet
          class="mx-auto"
          max-width="400"
        >
          <v-slide-group
            multiple
            show-arrows
          >
            <v-slide-item
              v-for="n in 25"
              :key="n"
              v-slot="{ active, toggle }"
            >
              <v-radio/>
            </v-slide-item>
          </v-slide-group>
        </v-sheet>
      </div>
    </v-footer>
  </div>
</template>

<script>
import SocialShare from '../Article/SocialShare.vue';
import ViewsAndLikes from './ViewsAndLikes.vue';

export default {
  name: 'Biathlon',
  components: { SocialShare, ViewsAndLikes }
};
</script>

<style lang="scss" scoped>
.biathlon_wrapper{
  position: sticky;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  bottom: 0;
  background-color: #FFFFFF;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.25);
  .social_buttons {
    display: flex;

  }
  .biathlon {
    width: auto;
  }
}

</style>
