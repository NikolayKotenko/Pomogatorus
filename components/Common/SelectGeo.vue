<template>
  <div>
    <InputStyled
      :data='data.address'
      :placeholder='"Выберите адрес"'
    />

    <yandex-map
      :behaviors='behaviors'
      :controls='controls'
      :coords='coords'
      :detailed-controls='detailedControls'
      :zoom='zoom'
      @click='onClickMap'
      @map-was-initialized='onMapInit'
    >
      <ymap-marker
        :balloon-template='balloonTemplate'
        :coords='coords'
        hint-content='some hint'
        marker-id='123'
        marker-type='placemark'
      />
    </yandex-map>
  </div>
</template>

<script>
import InputStyled from './InputStyled'

export default {
  name: 'SelectGeo',
  components: { InputStyled },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    coords: [55.753215, 37.622504],
    zoom: 10,
    controls: ['zoomControl', 'geolocationControl', 'searchControl'],
    behaviors: ['drag'],
    detailedControls: {
      zoomControl: {
        position: {
          right: 10,
          top: 100
        }
      },
      geolocationControl: {
        float: 'right'
      },
      searchControl: {
        float: 'right'
      }
    },
    address: ''
  }),
  computed: {
    balloonTemplate() {
      return `
        <h1 class='red'>Hi, everyone!</h1>
        <p>I am here: ${this.activeCoords}</p>
        <img src='http://via.placeholder.com/350x150'>
      `
    }
  },
  methods: {
    onClickMap() {

    },
    onMapInit(map) {
      console.log(map)
    },
    getGeo() {
      // const cur_vm = this
      // // Получение местоположения и автоматическое отображение его на карте.
      // ymaps.geolocation.get({ mapStateAutoApply: true })
      //   .then(
      //     function(result) {
      //
      //       // Получение местоположения пользователя.
      //       var userAddress = result.geoObjects.get(0).properties.get('text')
      //       var userCoodinates = result.geoObjects.get(0).geometry.getCoordinates()
      //       // Пропишем полученный адрес в балуне.
      //       result.geoObjects.get(0).properties.set({
      //         balloonContentBody: 'Адрес: ' + userAddress +
      //           '<br/>Координаты:' + userCoodinates
      //       })
      //       /* Записали в коллекцию полученный результат после геолокации, масстив placemark которым можно управлять */
      //       cur_vm.MyGeoObjectCollection.add(result.geoObjects)
      //       cur_vm.form.manager_geotag = userAddress
      //
      //       // vue_map.geoObjects.add(result.geoObjects)
      //       console.log(userAddress)
      //       cur_vm.state_load_ymap = true
      //     },
      //     function(err) {
      //       console.log('Ошибка: ' + err)
      //     }
      //   )
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
