<template>
  <v-container class="filter_container">
    <section class="filter_header">
      <h3>Фильтр оборудования</h3>
      <div class="characteristics_display">
        <span>Выводить в списочный результат</span>
        <span>Выводить в персональное отображение</span>
      </div>
    </section>
    <section class="filter_list">
      <div class="filter_wrapper">
        <div class="characteristic_content">
          <div class="characteristic_title">
            Мощность:
          </div>
          <div class="characteristic_setting">
            <v-range-slider
              max="50"
              min="-50"
              color="#95D7AE"
            />
          </div>
        </div>
        <div class="characteristic_switch_buttons">
          <v-switch color="#95D7AE"/>
          <v-switch color="#95D7AE"/>
        </div>
      </div>
      <div class="filter_wrapper"/>
    </section>
  </v-container>
</template>
<script>
export default {
  name: 'UniversalFilter'
}
</script>

<style lang="scss" scoped>
.filter_container{
  background-color: #FFFFFF;
  padding: 20px;
  width: 750px;
  display: grid;
  grid-row-gap: 20px;
  .filter_header{
    display: flex;
    justify-content: space-between;
    .characteristics_display{
      max-width: 220px;
      display: flex;
      grid-column-gap: 20px;
    }
  }
  .filter_list{
    display: grid;
    grid-row-gap: 20px;
    .filter_wrapper{
      display: flex;
      padding: 20px;
      border-radius: 5px;
      border: 0.5px solid #8A8784;
      grid-column-gap: 50px;
      .characteristic_content{
        .characteristic_title{

        }
        .characteristic_setting{
          width: 450px;
        }
      }
      .characteristic_switch_buttons{
        display: flex;
        justify-content: space-between;
        width: 150px;
      }
    }
  }
}
</style>
