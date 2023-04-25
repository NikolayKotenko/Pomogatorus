<template>
  <div class="biathlon_wrapper">
    <div class="social_buttons">
      <ViewsAndLikes></ViewsAndLikes>
      <SocialShare></SocialShare>
    </div>
    <div class="biathlon">

    </div>
  </div>
</template>

<script>
import ViewsAndLikes from "./ViewsAndLikes.vue";
import SocialShare from "../Article/SocialShare.vue";

export default {
  name: "Biathlon",
  components: {SocialShare, ViewsAndLikes}
}
</script>

<style lang="scss" scoped>
.biathlon_wrapper{
  position: sticky;
  bottom: 0;
  background-color: #FFFFFF;
  width: 100% !important;
  .social-buttons {

  }
  .biathlon {

  }
}

</style>
