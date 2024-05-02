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
        rty
      </div>
    </div>
    <TaskModal/>
  </v-container>
</template>

<script>

import TaskModal from '../../components/Collaboration/TaskModal.vue'

export default {
  components: {
    TaskModal

  },
  data() {

  },
  mounted() {
    this.$store.dispatch('CollaborationModule/getListAllUsers')
  },
  methods: {
    openModal() {
      this.$store.dispatch('TaskModule/openModal')
    },
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
        box-shadow: 0px 0px 30px 15px rgba(255,255,255, .1);
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
      }
    }
    .brands_grid_elem {
      height: 300px;
      background-color: #111111;
      border-radius: 30px;
      padding: 40px;
    }
  }
}

</style>
