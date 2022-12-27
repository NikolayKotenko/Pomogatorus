<template>
  <section class="pdf">

    <section class="pdf__main-header">Техническое задание по инженерным системам</section>
    <section class="pdf__date-document">
<!--      <section class="pdf__date-document__name">Дата создания документа: </section>-->
      <section class="pdf__date-document__value">{{ new Date().toLocaleDateString() }}</section>
    </section>

    <section class="pdf__header-section">Объект</section>
    <hr>
    <div class="pdf__object">
      <img
        class="pdf__object__image"
        :src='require(`~/assets/images/typeobject.png`)'
        alt="User Image"
        ref="userImage"
      />
      <section class="pdf__object__user-details">
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">
            Объект:
          </span>
          <span class="pdf__object__user-details__detail-container__detail-value name">
            kekw{{ $store.state.currentObject.name }}
          </span>
        </span>

        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">
            ФИО:
          </span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.AuthModule.userData.user_fio }}
          </span>
        </span>

        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">
            Email:
          </span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.AuthModule.userData.email }}
          </span>
        </span>

        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">
            Телефон:
          </span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.AuthModule.userData.telephone }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">
            Адресс объекта:
          </span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.address }}
          </span>
        </span>
      </section>
    </div>

    <section class="pdf__header-section">Параметры объекта</section>
    <hr>
    <div class="pdf__object">
      <div class="pdf__object__user-details">
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Общая площадь:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.total_area }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Отапливаемая площадь:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.heating_area }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Наличие подвала:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.basement_area }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Выделенная электрическая мощность:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.dedicated_electrical_power }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Общие теплопотери:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.heat_loss_total }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Количество унитазов:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.number_of_toilets }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Количество раковин:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.number_of_sinks }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Количество душей:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.number_of_showers }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Количество ванн:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.number_of_baths }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Количество биде:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.number_of_bidets }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Тип объекта:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.id_type_object }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Тип стен:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.id_wall }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Источник холодной воды:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.id_cold_water_source }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Тип основного топлива:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.id_fuel_current }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Резервный тип топлива:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.id_fuel_reserve }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Перспективный тип топлива:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.id_fuel_future }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Расположение котельной:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.id_boiler_room }}
          </span>
        </span>
        <span class="pdf__object__user-details__detail-container">
          <span class="pdf__object__user-details__detail-container__detail-label">Кол-во этажей, площадь:</span>
          <span class="pdf__object__user-details__detail-container__detail-value">
            {{ $store.state.currentObject.id_floor }}
          </span>
        </span>
      </div>
    </div>

    <!-- Перенос на след страницу   -->
    <div class="html2pdf__page-break"/>

    <section class="pdf__header-section">Требования</section>
    <hr>
    <div class="pdf__requirements" v-for="(objTag, nameTag) in $store.state.PdfDataModule.report_data">
      <section class="pdf__requirements__name">{{ nameTag }}</section>
      <TableByTag :obj_by_tag="objTag" class="pdf__requirements__table"></TableByTag>
    </div>
  </section>
</template>

<script>
import TableByTag from './TableByTag'

export default {
  name: 'PdfContent',
  props: {
  },
  components: {
    TableByTag,
  },
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$emit("domRendered");
      }, 1000);
    });
  },
};
</script>

<style lang="scss" scoped>
.pdf {
  width: 100%;
  background: #fff;
  font-size: 12px;
  position: relative;
  &__main-header {
    padding-top: 20px;
    font-weight: bold;
    font-size: 16px;
    flex-shrink: 0;
    text-align: center;
    margin-bottom: 38px;
  }
  &__header-section{
    font-weight: bold;
    margin-bottom: 5px;
  }
  &__object {
    display: flex;
    padding: 16px 0 28px 0;
    grid-column-gap: 20px;
    &__image {
      width: 238px;
      height: 149px;
      border-radius: 5px;
      //width: 75px;
      //height: 75px;
      //border-radius: 50%;
      //overflow: hidden;
      //position: relative;
      //margin-right: 25px;
      //border: 1px solid #dadada;
    }
    &__user-details {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      grid-row-gap: 17px;
      &__detail-container {
        flex-shrink: 0;
        &__detail-label {
          margin-right: 5px;
        }
        &__detail-value{
          &.name{
            font-weight: bold;
          }
        }
      }
    }
  }
  &__requirements{
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    grid-row-gap: 10px;
    &__name{
      font-weight: bold;
    }
  }
  &__date-document{
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    //grid-column-gap: 19px;
    &__name{
      font-weight: bold;
    }
    &__value{}
  }
  //.chart-container {
  //  width: 100%;
  //  height: 320px;
  //  padding: 20px;
  //  pointer-events: none;
  //  &:not(:last-child) {
  //    margin-bottom: 15px;
  //  }
  //}
}
</style>
