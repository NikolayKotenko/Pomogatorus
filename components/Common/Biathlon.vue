<template>
  <div class="biathlon_wrapper">
    <v-container class="biathlon_container">
      <v-footer
        class="biathlon_footer"
        padless
      >
        <div class="social_buttons">
          <ViewsAndLikes/>
          <CopyLinkButton/>
          <SocialShare/>
        </div>
        <div class="biathlon">
          <v-sheet class="biathlon_sheet">
            <v-slide-group
              multiple
              show-arrows
            >
              <v-slide-item
                v-for="n in 25"
                :key="n"
              >
                <v-radio/>
              </v-slide-item>
            </v-slide-group>
          </v-sheet>
        </div>
      </v-footer>
    </v-container>
  </div>
</template>

<script>
import SocialShare from '../Article/SocialShare.vue';
import ViewsAndLikes from './ViewsAndLikes.vue';
import CopyLinkButton from './CopyLinkButton.vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Biathlon',
  components: { CopyLinkButton, SocialShare, ViewsAndLikes }
};
</script>

<style lang="scss" scoped>
.biathlon_wrapper{
  position: fixed;
  z-index: 9;
  width: 100vw;
  left: 0;
  bottom: 0;
  background-color: #FFFFFF;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -2px 4px rgba(0, 0, 0, 0.25);

  .biathlon_container{
    display: flex;
    justify-content: center;
  }
    .biathlon_footer {
      display: inline-flex;
      grid-column-gap: 50px;
    }
    .social_buttons {
      display: flex;
      width: 350px;

    }
    .biathlon {
      width: auto;

      .biathlon_sheet {
        max-width: 400px;
      }
    }

}

</style>
