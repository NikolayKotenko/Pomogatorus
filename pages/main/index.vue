<template>
  <v-container class="main_page_wrapper">
    <div class="main_img">
      <div class="img_title">
        Ваш дом - наша забота: надежное отопление от профессионалов
      </div>
      <div class="sub_title">
        <v-divider vertical style="border-color: #F79256; height: 120px; border-width: 2px;"/>
        Мы поможем вам найти мастера по монтажу котельного оборудования быстро, легко и выгодно
      </div>
      <v-img
        :src="require(`~/assets/images/main_page_img.png`)"
        alt=""
        class="img"
        cover
      />
      <div class="btn" @click="openModal">
        Найти мастера
      </div>
    </div>
    <div class="merits_grid">
      <div class="orange_elem grid-area1">
        300+
        <div class="merits_elem_text">
          населённых пунктов имеют поддержку помогаторус
        </div>
      </div>
      <div class="grid_elem grid-area2">
        600
        <div class="merits_elem_text">
          объектов было обслуженно с помощью помогаторус
        </div>
      </div>
      <div class="grid_elem grid-area3">
        {{ $store.getters['CollaborationModule/getCountAllUsers'] }}
        <div class="merits_elem_text">
          специалистов на сайте готовых помочь с вашим объектом недвижимости
        </div>
      </div>
      <div class="grid_elem grid-area4">
        10лет
        <div class="merits_elem_text">
          поставляем отопительное оборудование для наших клиентов
        </div>
      </div>
      <div class="brands_grid_elem grid-area5">
        <div
          v-for="(brand, index) in $store.state.BrandsModule.listBrands"
          :key="index"
          class="brand_card"
        >
          <DropDownMenuStyled
            :is-left="true"
            :is-offset-y="true"
            :open-on-hover="true"
          >
            <template #icon>
              <v-img :src="getBrandPhoto(brand)" width="120"/>
            </template>
            <template #content>
              <BrandCard
                :brand-object="brand"
                :is-user-account="false"
              />
            </template>
          </DropDownMenuStyled>
        </div>
      </div>
    </div>
    <div class="steppers_wrapper">
      <div class="steppers_header">
        <v-divider vertical style="border-width: 2px; border-color: #F79256;"/>
        <div class="header_container">
          <div class="header_text">
            Как работает помогаторус?
          </div>
          <div class="header_sub_text">
            Мы предаставляем базу мастеров по монтажу сантехнического оборудования,
            базу клиентов нуждающихся в услугах мастреа по монтажу,
            полезные статьи в сфере сантехнического оборудования и тематические подборки
          </div>
        </div>
      </div>
      <div class="steppers_cards">
        <div class="step_card">
          1.
          <div class="step_text">
            Вы  регистрируетесь на портале и заполняете личную информацию
          </div>
          <img
            :src="require(`~/assets/svg/icons/check_circle_box.svg`)"
            style="position: absolute;
                   right: 20px;
                   top: 20px;"
          >
        </div>
        <div class="step_card">
          2.
          <div class="step_text">
            Вносите актуальную информацию о своём объекте недвижимости/доме
          </div>
          <img
            :src="require(`~/assets/svg/icons/check_circle_box.svg`)"
            style="position: absolute;
                   right: 20px;
                   top: 20px;"
          >
        </div>
        <div class="step_card">
          3.
          <div class="step_text">
            Находите нужного специалиста и получаете помощь по своему объекту
          </div>
          <img
            :src="require(`~/assets/svg/icons/check_circle_box.svg`)"
            style="position: absolute;
                   right: 20px;
                   top: 20px;"
          >
        </div>
      </div>
      <!--      <div class="changing_block_wrapper"> -->
      <!--        <div class="changing_header"> -->
      <!--          <div class="header_container_text"> -->
      <!--            Мастера поблизости -->
      <!--          </div> -->
      <!--          <v-btn -->
      <!--            class="link_more_btn" -->
      <!--            :href="'/people/'" -->
      <!--          > -->
      <!--            Больше мастеров -->
      <!--          </v-btn> -->
      <!--        </div> -->
      <!--        <v-slide-group -->
      <!--          show-arrows -->
      <!--          class="masters_cards_slider" -->
      <!--        > -->
      <!--          <v-slide-item> -->
      <!--            <div class="recommended_master_card"> -->
      <!--              <div class="master_info"> -->
      <!--                <v-avatar size="80"> -->
      <!--                  <v-img src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"/> -->
      <!--                </v-avatar> -->
      <!--                <div class="master_name_rating"> -->
      <!--                  <div class="name"> -->
      <!--                    Иван Иванов -->
      <!--                  </div> -->
      <!--                  <div class="rating"> -->
      <!--                    12 отзывов -->
      <!--                  </div> -->
      <!--                </div> -->
      <!--              </div> -->
      <!--              <v-divider style="margin: 14px 0;"/> -->
      <!--              <div class="master_characteristics"> -->
      <!--                Челябинск • Более 10 лет опыта • Мастер по монтажу -->
      <!--              </div> -->
      <!--              <div class="master_btns"> -->
      <!--                <div class="middle_price"> -->
      <!--                  от 2000 за услугу -->
      <!--                </div> -->
      <!--                <v-btn class="add_on_object_btn"> -->
      <!--                  пригласить на объект -->
      <!--                </v-btn> -->
      <!--              </div> -->
      <!--            </div> -->
      <!--          </v-slide-item> -->
      <!--          <v-slide-item> -->
      <!--            <div class="recommended_master_card"> -->
      <!--              <div class="master_info"> -->
      <!--                <v-avatar size="80"> -->
      <!--                  <v-img src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"/> -->
      <!--                </v-avatar> -->
      <!--                <div class="master_name_rating"> -->
      <!--                  <div class="name"> -->
      <!--                    Иван Иванов -->
      <!--                  </div> -->
      <!--                  <div class="rating"> -->
      <!--                    12 отзывов -->
      <!--                  </div> -->
      <!--                </div> -->
      <!--              </div> -->
      <!--              <v-divider style="margin: 14px 0;"/> -->
      <!--              <div class="master_characteristics"> -->
      <!--                Челябинск • Более 10 лет опыта • Мастер по монтажу -->
      <!--              </div> -->
      <!--              <div class="master_btns"> -->
      <!--                <div class="middle_price"> -->
      <!--                  от 2000 за услугу -->
      <!--                </div> -->
      <!--                <v-btn class="add_on_object_btn"> -->
      <!--                  пригласить на объект -->
      <!--                </v-btn> -->
      <!--              </div> -->
      <!--            </div> -->
      <!--          </v-slide-item> -->
      <!--          <v-slide-item> -->
      <!--            <div class="recommended_master_card"> -->
      <!--              <div class="master_info"> -->
      <!--                <v-avatar size="80"> -->
      <!--                  <v-img src="https://www.wrestlezone.com/wp-content/uploads/sites/8/2023/12/kurt-angle-meme-machine.jpg?resize=1024,576"/> -->
      <!--                </v-avatar> -->
      <!--                <div class="master_name_rating"> -->
      <!--                  <div class="name"> -->
      <!--                    Иван Иванов -->
      <!--                  </div> -->
      <!--                  <div class="rating"> -->
      <!--                    12 отзывов -->
      <!--                  </div> -->
      <!--                </div> -->
      <!--              </div> -->
      <!--              <v-divider style="margin: 14px 0;"/> -->
      <!--              <div class="master_characteristics"> -->
      <!--                Челябинск • Более 10 лет опыта • Мастер по монтажу -->
      <!--              </div> -->
      <!--              <div class="master_btns"> -->
      <!--                <div class="middle_price"> -->
      <!--                  от 2000 за услугу -->
      <!--                </div> -->
      <!--                <v-btn class="add_on_object_btn"> -->
      <!--                  пригласить на объект -->
      <!--                </v-btn> -->
      <!--              </div> -->
      <!--            </div> -->
      <!--          </v-slide-item> -->
      <!--        </v-slide-group> -->
      <!--      </div> -->
    </div>
    <div class="recommended_articles_and_tags_wrapper">
      <div class="recommended_articles_header">
        <div class="header_container_text">
          Интересные статьи
        </div>
        <v-btn class="link_more_btn" :href="'/articles/'">
          Посмотреть всё
        </v-btn>
      </div>
      <v-slide-group
        show-arrows
        class="recommended_article_slider"
      >
        <v-slide-item>
          <div class="article_card">
            <v-img
              src="https://storage.yandexcloud.net/sdvor-production-wiki-goods/media/633965da-6b1d-4ef1-965a-751daf3765b0.jpeg"
              class="article_img"
              cover
            />
            <div class="article_name">
              Как избежать поломки отопительного оборудования
            </div>
          </div>
        </v-slide-item>
        <v-slide-item>
          <div class="article_card">
            <v-img
              src="https://storage.yandexcloud.net/sdvor-production-wiki-goods/media/633965da-6b1d-4ef1-965a-751daf3765b0.jpeg"
              class="article_img"
              cover
            />
            <div class="article_name">
              Как избежать поломки отопительного оборудования
            </div>
          </div>
        </v-slide-item>
        <v-slide-item>
          <div class="article_card">
            <v-img
              src="https://storage.yandexcloud.net/sdvor-production-wiki-goods/media/633965da-6b1d-4ef1-965a-751daf3765b0.jpeg"
              class="article_img"
              cover
            />
            <div class="article_name">
              Как избежать поломки отопительного оборудования
            </div>
          </div>
        </v-slide-item>
        <v-slide-item>
          <div class="article_card">
            <v-img
              src="https://storage.yandexcloud.net/sdvor-production-wiki-goods/media/633965da-6b1d-4ef1-965a-751daf3765b0.jpeg"
              class="article_img"
              cover
            />
            <div class="article_name">
              Как избежать поломки отопительного оборудования
            </div>
          </div>
        </v-slide-item>
        <v-slide-item>
          <div class="article_card">
            <v-img
              src="https://storage.yandexcloud.net/sdvor-production-wiki-goods/media/633965da-6b1d-4ef1-965a-751daf3765b0.jpeg"
              class="article_img"
              cover
            />
            <div class="article_name">
              Как избежать поломки отопительного оборудования
            </div>
          </div>
        </v-slide-item>
      </v-slide-group>

      <div class="recommended_articles_header">
        <div class="header_container_text">
          Популярные тэги
        </div>
        <v-btn class="link_more_btn" :href="'/podborki/'">
          Посмотреть всё
        </v-btn>
      </div>
      <v-chip-group>
        <v-chip
          v-for="(tag, index) in $store.state.PopularSelectionsModule.list_selections"
          :key="index"
          color="black"
          text-color="white"
          class="chip_style"
          :href="'/podborki/' + tag.code"
        >
          {{ tag.name }}
        </v-chip>
      </v-chip-group>
    </div>
    <div
      v-if="!$store.getters.stateAuth"
      class="registration_wrapper"
    >
      <div class="registration_header">
        Стать клиентом “Помогаторус” очень просто! Пройдите быструю регистрацию и пользуйтесь преимуществоми сайта прямо сейчас!
      </div>
      <v-btn
        class="registration_btn"
        @click="openAuthModal"
      >
        Зарегистрироваться
      </v-btn>
    </div>
    <TaskModal/>
    <v-overlay :value="! $store.getters.getUserId" opacity="1">
      <v-progress-circular :size="50" color="#FFFFFF" indeterminate/>
    </v-overlay>
  </v-container>
</template>

<script>

import TaskModal from '../../components/Collaboration/TaskModal.vue'
import BrandCard from '../../components/Common/BrandCard.vue';
import DropDownMenuStyled from '../../components/Common/DropDownMenuStyled.vue';

export default {
  components: {
    DropDownMenuStyled, BrandCard, TaskModal
  },
  data() {

  },
  mounted() {
    this.$store.dispatch('CollaborationModule/getListAllUsers')
    this.$store.dispatch('getListArticles')
    this.$store.dispatch('PopularSelectionsModule/getListSelections')
    this.$store.dispatch('BrandsModule/getListBrands')
  },
  methods: {
    openModal() {
      this.$store.dispatch('TaskModule/openModal')
    },
    getBrandPhoto(elem) {
      if (elem.e_client_files.length) {
        return elem.e_client_files[0].url
      }
    },
    openAuthModal() {
      if (!this.$store.getters.stateAuth) {
        this.$store.state.listModal[0].isOpen = true;
      }
    }
  }
}

</script>


<style scoped lang="scss">
@import 'assets/styles/style';


.main_page_wrapper {
  font-family: 'Inter', sans-serif;
  width: 100%;
  min-width: 1720px;
  justify-content: center;
  .main_img{
    width: 100%;
    height: 750px;
    background-color: #111111;
    position: relative;
    border-radius: 30px;
    z-index: 1;
    .img_title {
      position: absolute;
      font-size: 6em;
      color: #FFFFFF;
      width: 1000px;
      font-weight: 700;
      line-height: 100%;
      left: 40px;
      top: 100px;
    }
    .sub_title {
      position: absolute;
      color: #FFFFFF;
      left: 40px;
      bottom: 40px;
      display: flex;
      align-items: center;
      font-size: 1.2em;
      font-weight: 300;
      grid-column-gap: 20px;
      max-width: 600px;
    }
    .img {
      position: absolute;
      height: 710px;
      width: 570px;
      border-radius: 0 0 350px 350px;
      right: 150px;
    }
    .btn {
      position: absolute;
      cursor: pointer;
      color: #FFFFFF;
      font-size: 1.2em;
      text-transform: uppercase;
      font-weight: 300;
      width: 324px;
      height: 80px;
      right: 40px;
      bottom: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      grid-column-gap: 1em;
      background: rgba(119, 119, 119, .3);
      -webkit-backdrop-filter: blur(10px);
      backdrop-filter: blur(10px);
      padding: 30px 80px;
      border-radius: 30px;
      transition: $transition;
      &:hover {
        background: rgba(221, 221, 221, .3);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        box-shadow: 0 0 30px 15px rgba(255,255,255, .1);
      }
    }
  }
  .merits_grid {
    display: grid;
    justify-content: center;
    max-width: 1288px;
    margin: 150px auto;
    left: auto;
    right: auto;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 20px 20px;
    grid-template-areas:
      "grid-area1 grid-area2 grid-area3"
      "grid-area4 grid-area5 grid-area5";
    .grid-area1 { grid-area: grid-area1; }
    .grid-area2 { grid-area: grid-area2 ; }
    .grid-area3 { grid-area: grid-area3 ; }
    .grid-area4 { grid-area: grid-area4 ; }
    .grid-area5 { grid-area: grid-area5 ; }
    .grid_elem {
      height: 300px;
      background-color: #DDDDDD;
      border-radius: 30px;
      font-size: 6em;
      line-height: 1;
      color: #000000;
      font-weight: 700;
      padding: 40px;
      display: grid;
      justify-content: center;
      .merits_elem_text {
        font-size: 24px;
        line-height: 1;
        font-weight: 300;
      }
    }
    .orange_elem {
      height: 300px;
      background-color: #ED7100;
      border-radius: 30px;
      font-size: 6em;
      line-height: 1;
      color: #FFFFFF;
      font-weight: 700;
      padding: 40px;
      display: grid;
      justify-content: center;
      .merits_elem_text {
        font-size: 24px;
        line-height: 1;
        font-weight: 300;
      }
    }
    .brands_grid_elem {
      height: 300px;
      background-color: #111111;
      border-radius: 30px;
      padding: 40px;
      display: flex;
      grid-column-gap: 20px;
      .brand_card {
      }
    }
  }
  .steppers_wrapper {
    padding: 40px 0;
    background-color: #DDDDDD;
    width: 100vw; /* 100% ширины экрана */
    position: relative;
    left: 50%; /* Центрируем блок */
    right: 50%;
    margin-left: -50vw; /* Корректируем положение на половину ширины экрана */
    margin-right: -50vw;
    justify-content: center;
    .steppers_header {
      max-width: 1288px;
      margin: 40px auto;
      left: auto;
      right: auto;
      display: flex;
      grid-column-gap: 20px;
      .header_container {
        max-width: 700px;
        .header_text {
          font-size: 2.5em;
        }
        .header_sub_text {

        }
      }
    }
    .steppers_cards {
      max-width: 1288px;
      margin: 40px auto;
      left: auto;
      right: auto;
      display: flex;
      grid-column-gap: 20px;
      .step_card {
        width: 100%;
        background-color: #F2F2F2;
        height: 214px;
        border-radius: 30px;
        position: relative;
        font-size: 4.4em;
        font-weight: 700;
        padding: 40px 0 0 40px;
        .step_text {
          font-size: 20px;
          font-weight: 400;
          line-height: 1;
        .check_icon {
          position: absolute;
          right: 20px;
          top: 20px;
        }
        }
      }
    }
    .changing_block_wrapper {
      max-width: 1430px;
      margin: 40px auto;
      left: auto;
      right: auto;
      .changing_header {
        display: flex;
        justify-content: space-between;
        align-content: center;
        margin: 0 88px 20px 88px;
      }
      .masters_cards_slider {
        width: 100%;
        display: flex;
        margin-bottom: 150px;
        .v-icon {
          font-size: 40px;
        }
        .recommended_master_card {
          width: 430px;
          border-radius: 30px;
          background-color: #F2F2F2;
          padding: 40px;
          .master_info {
            display: flex;
            grid-column-gap: 20px;
            .master_name_rating {
              display: grid;
              .name {
                font-size: 1.5em;
                line-height: 1;
              }
              .rating {
                font-size: 1.25em;
                line-height: 1;
                color: #8A8784;
              }
            }
          }
          .master_characteristics {
            font-size: 1.25em;
            text-wrap: wrap;
            letter-spacing: normal;
          }
          .master_btns {
            display: grid;
            justify-content: center;
            grid-row-gap: 20px;
            margin-top: 40px;
            .middle_price {
              width: 230px;
              height: 40px;
              border-radius: 30px;
              background-color: #DDDDDD;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 1.25em;
              font-weight: 700;
            }
            .add_on_object_btn {
              width: 230px;
              height: 40px;
              border-radius: 30px;
              border: 1px solid #ED7100;
              text-transform: lowercase;
              letter-spacing: normal;
            }
          }
        }
      }
    }

  }
  .recommended_articles_and_tags_wrapper {
    max-width: 1430px;
    margin: 150px auto;
    left: auto;
    right: auto;
    .recommended_articles_header {
      display: flex;
      justify-content: space-between;
      align-content: center;
      margin: 0 88px 20px 88px;

    }
    .recommended_article_slider {
      width: 100%;
      display: flex;
      margin-bottom: 150px;
      .v-icon {
        font-size: 40px;
      }
      .article_card {
        background-color: #7D7D7D;
        height: 250px;
        width: 430px;
        margin: 0 8px;
        border-radius: 30px !important;
        position: relative;
        .article_img {
          position: absolute;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.9);
          border-radius: 30px;
          height: 250px;
        }
        .article_img:after {
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background: transparent;
          background-image: linear-gradient(to bottom, #ffffff, #000000);
          opacity: 0.5;

        }
        .article_name {
          position: absolute;
          color: #FFFFFF;
          font-size: 1.5em;
          font-weight: 700;
          bottom: 20px;
          left: 20px;
          max-width: 370px;
          text-wrap: wrap;
          line-height: 1;
        }
      }
    }
    .chip_style {
      height: 80px;
      font-size: 1.5em;
      padding: 0 50px;
      border-radius: 30px;
    }
  }
  .registration_wrapper {
    height: 200px;
    background-color: #111111;
    display: grid;
    align-content: center;
    width: 100vw; /* 100% ширины экрана */
    position: relative;
    left: 50%; /* Центрируем блок */
    right: 50%;
    margin-left: -50vw; /* Корректируем положение на половину ширины экрана */
    margin-right: -50vw;
    justify-content: center;
    .registration_header {
      color: #FFFFFF;
      font-size: 1.5em;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .registration_btn {
      text-transform: none;
      padding: 0 34px;
      border: 1px solid #FFFFFF;
      background-color: #111111;
      color: #FFFFFF;
      border-radius: 30px;
      display: flex;
      align-items: center;
      height: 40px;
      cursor: pointer;
      letter-spacing: normal;
      margin: auto;
    }
  }
}


.header_container_text {
  font-size: 2.5em;
}
.link_more_btn {
  text-transform: uppercase;
  padding: 0 34px;
  border: 1px solid #111111;
  border-radius: 30px;
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;
  letter-spacing: normal;
}
</style>
