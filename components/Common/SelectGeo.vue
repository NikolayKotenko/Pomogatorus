<template>
  <div class='geo-select-wrap'>
    <InputStyled
      :data='data.address'
      :is-readonly='true'
      :placeholder='"Выберите адрес"'
      :prepend-icon-inner='"mdi-map-marker-outline"'
      @on-click='openModal'
    />

    <v-dialog
      v-model='isOpenMap'
      width='1080'
    >
      <v-card class='map-container'>
        <v-card-title class='d-flex justify-end'>
          <v-icon @click='closeModal'>mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
          <yandex-map
            ref='ymap'
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
              @balloonopen='bindListener'
            />
          </yandex-map>
        </v-card-text>
        <v-card-actions class='d-flex justify-center'>
          <v-btn
            color='primary'
            text
            @click='closeModal'
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    isOpenMap: false,

    map: {},
    coords: [55.753215, 37.622504],
    zoom: 10,
    controls: ['zoomControl', 'geolocationControl', 'searchControl'],
    behaviors: ['drag', 'scrollZoom'],
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
        fitMaxWidth: 'true',
        maxWidth: [200, 400, 600],
        position: {
          right: '22%',
          left: '22%',
          top: 10
        }
      }
    },
    address: ''
  }),
  computed: {
    balloonTemplate() {
      return `
        <h2 class='title-address'>Выбран адрес:</h2>
        <h1 class='name-address'>${this.address}</h1>
        <button id='btn' class='button-address'>ОК</button>
      `
    }
  },
  methods: {
    setAddress() {
      console.log('fire event')
      // this.$emit('set-new-address', {
      //   address: this.address,
      //   coords: this.coords
      // })
      //
      // this.isOpenMap = false
    },
    async onClickMap(e) {
      this.coords = e.get('coords')
      await this.$axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${this.$config.myPublicVariable}&geocode=${this.coords[1]},${this.coords[0]}&lang=ru_RU&results=1`).then(res => {
        // console.log(res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text)
        this.address = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text
      })


      this.map.setCenter(this.coords)
      this.map.balloon.open(this.coords, this.balloonTemplate)
    },
    onMapInit(map) {
      this.map = map
    },
    openModal() {
      this.isOpenMap = true
    },
    closeModal() {
      this.isOpenMap = false
    },
    bindListener() {
      console.log('add event')
      document.getElementById('btn').addEventListener('click', this.setAddress)
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

<style lang='scss'>
.geo-select-wrap {
  max-width: 300px;
}

.map-container {
  width: 100%;
  height: 100%;

  .ymap-container {
    width: 100%;
    height: 600px;
  }
}

.title-address {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: #37392E;
}

.name-address {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  color: #37392E;
}

.button-address {
  background: #F79256;
  border: 1px solid #F79256;
  border-radius: 5px;
  padding: 6px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 130px;
}
</style>
