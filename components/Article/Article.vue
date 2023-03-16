<template>
  <v-card class='article_card' :href="'/articles/' + article.id">
    <div class='list_elem_wrapper'>
      <div class="list_elem_wrapper__preview_content__short_info__title_info">
        <h2 class='list_elem_wrapper__preview_content__short_info__title_info__title'>
          {{ article.name }}
        </h2>
        <h4 class="list_elem_wrapper__preview_content__short_info__title_info__time">
          {{article.updated_at}}
        </h4>
      </div>
      <div class="list_elem_wrapper__tag_container">
        <a v-for="(tag, key) in article._all_tags" :href="'/podborki/'+tag.code">#{{tag.name}}</a>
      </div>
      <div class='list_elem_wrapper__img_container'>
        <v-img
          alt=''
          class='list_elem_wrapper__img_container__img'
          height="100%"
          max-width="300"
          cover
          :src="$store.getters.getImageByEClientFilesObj(article.e_client_files)"
        />
      </div>
      <div class='list_elem_wrapper__preview_content'>
        <div class='list_elem_wrapper__preview_content__short_info'>
          <h4
            v-if='article.short_header'
            class='list_elem_wrapper__preview_content__short_info__short'
          >
            {{ preview }}
          </h4>
        </div>
        <div class="list_elem_wrapper__preview_content__buttons">
          <ButtonStyled
            local-text="Читать полностью"
            local-class="style_button"
          >
          </ButtonStyled>
          <div class="list_elem_wrapper__preview_content__buttons__social_btns">
            <div class="list_elem_wrapper__preview_content__buttons__social_btns__wrapper">
              <v-tooltip top>
                <template v-slot:activator='{ on, attrs }'>
                  <div v-bind='attrs' v-on='on'>
                    <v-icon class="list_elem_wrapper__preview_content__buttons__social_btns__wrapper__btn">
                      mdi-eye
                    </v-icon>
                    <span>212</span>
                  </div>
                </template>
                <span>Кол-во просмотров</span>
              </v-tooltip>
            </div>
            <div class="list_elem_wrapper__preview_content__buttons__social_btns__wrapper">
              <v-tooltip top>
                <template v-slot:activator='{ on, attrs }'>
                  <div v-bind='attrs' v-on='on'>
                    <v-icon class="list_elem_wrapper__preview_content__buttons__social_btns__wrapper__btn">mdi-cards-heart</v-icon>
                    <span>94</span>
                  </div>
                </template>
                <span>Понравилось людям</span>
              </v-tooltip>
            </div>
          </div>
        </div>


      </div>
    </div>
  </v-card>
</template>

<script>
import Author from './Author'
import ButtonStyled from "../Common/ButtonStyled.vue";

export default {
  name: 'Article',
  components: {ButtonStyled, Author },
  props: ['article'],
  data: () => ({
    previewAuthor: true
  }),
  computed: {
    preview() {
      if (this.article.short_header) {
        if (this.article.short_header.length > 50) {
          return this.article.short_header.substring(0, 50) + '...'
        } else {
          return this.article.short_header
        }
      } else {
        return ''
      }
    }
  },
  methods: {}
}
</script>

<style lang='scss'></style>
