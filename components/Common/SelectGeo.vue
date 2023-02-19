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
          <template v-if='drawMap'>
            <yandex-map
              :behaviors='behaviors'
              :controls='controls'
              :coords='coords'
              :detailed-controls='detailedControls'
              :zoom='zoom'
              @balloonopen='bindListener'
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
          </template>
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
  components: {
    InputStyled
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isOpenMap: false,

      map: {},
      coords: [55.753215, 37.622504],
      zoom: 10,
      controls: ['zoomControl', 'geolocationControl'],
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
        }
      },
      drawMap: true,
      field: null,
      MyGeoObjectCollection: [],
      suggestInstance: null,

      address: ''
    }
  },
  computed: {
    balloonTemplate() {
      return `
        <h2 class='title-address'>Выбран адрес:</h2>
        <h1 class='name-address'>${this.address}</h1>
        <button id='btn' class='button-address'>ОК</button>
      `
    },
    searchTemplate() {
      return `
         <form name='search-form' id='form'>
           <div class='map_wrapper'>
              <input type='text' placeholder='Введите адрес' id='map_search'>
              <img alt='search' id='map_icon' src='${require('@/assets/svg/search.svg')}'>
           </div>
         </form>
      `
    },
    suggestTemplate() {
      return [
        '<ul id="suggest-view" class="suggest-view">',
        '{% for item in state.items %}',
        '<li class="suggest-item" data-value="{{ item.value }}">{{ item.displayName }}</li>',
        '{% endfor %}',
        '</ul>'
      ].join('')
    }
  },
  methods: {
    onMapInit(map) {
      this.map = map
      this.searchControl()

      console.log('initiated')
    },

    setAddress() {
      this.$emit('set-new-address', {
        address: this.address,
        coords: this.coords
      })

      this.isOpenMap = false
    },
    async getGeoCodeByName(query) {
      await this.$axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${this.$config.myPublicVariable}&geocode=${query}&lang=ru_RU&results=1`).then(res => {
        this.address = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text
        const resCoords = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ')
        this.coords = []
        this.coords.push(resCoords[1])
        this.coords.push(resCoords[0])
        this.map.setCenter(this.coords, 18, { duration: 300 })

        const suggestList = document.querySelector('#suggest-view')
        suggestList.classList.add('hide-suggest')
      })
    },
    async getGeoCodeByCoords() {
      await this.$axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${this.$config.myPublicVariable}&geocode=${this.coords[1]},${this.coords[0]}&lang=ru_RU&results=1`).then(res => {
        this.address = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text
        this.map.setCenter(this.coords)
        this.map.balloon.open(this.coords, this.balloonTemplate)
      })
    },
    onClickMap(e) {
      this.coords = e.get('coords')
      this.getGeoCodeByCoords()
    },
    searchControl() {
      const self = this

      /* CUSTOM SUGGEST LIST */
      let suggestTemplate = ymaps.templateLayoutFactory.createClass(this.suggestTemplate, {
        build: function() {
          suggestTemplate.superclass.build.call(this)

          this.searchCallback = ymaps.util.bind(this.searchCb, this)

          const items = document.getElementsByClassName('suggest-item')
          for (let i = 0; i < items.length; i++) {
            items[i].addEventListener('click', this.searchCallback)
          }
        },
        searchCb: function(e) {
          self.getGeoCodeByName(e.target.innerHTML)
        }
      })

      /* CUSTOM SEARCH */
      let template = ymaps.templateLayoutFactory.createClass(this.searchTemplate, {
        build: function() {
          template.superclass.build.call(this)
          this.searchCallback = ymaps.util.bind(this.searchCb, this)

          const searchElem = document.querySelector('#form')
          searchElem.addEventListener('click', self.showSuggest)
          searchElem.addEventListener('submit', this.searchCallback)
          let input = document.getElementById('map_search')
          self.suggestInstance = new ymaps.SuggestView(input, {
            layout: suggestTemplate
          })

          self.suggestInstance.events.add('select', this.searchCallback)
        },
        clear: function() {
          const icon = document.querySelector('#map_icon')
          icon.removeEventListener('submit', () => {
          })

          template.superclass.clear.call(this)
        },
        searchCb: function(e) {
          var map = this.getData().control.getMap()
          e.preventDefault()

          var ctrl = this.getData().control

          let input = document.getElementById('map_search')
          ctrl.search(input.value).then(function(value) {
            // console.log(value.geoObjects.get(0).geometry.getCoordinates())

            self.coords = value.geoObjects.get(0).geometry.getCoordinates()
            self.address = value.metaData.geocoder.request
            self.map.setCenter(self.coords, 18, { duration: 300 })
          })
        }
      })

      const searchControl = new ymaps.control.SearchControl({
        options: {
          provider: 'yandex#map',
          formLayout: template, // default - 'islands#searchControlLayout'
          noPlacemark: true
        }
      })

      /* Если используем дефолтный поиск, то включаем этот код, чтобы по поиску выставлять координаты и балун */
      // searchControl.events.add('resultselect', function(event, data) {
      //   let index = event.get('index')
      //   const meta = searchControl.getResponseMetaData()
      //   searchControl.getResult(index).then(function(res) {
      //     self.coords = res.geometry.getCoordinates()
      //     self.address = meta.request
      //     self.map.setCenter(self.coords)
      //     self.map.balloon.open(self.coords, self.balloonTemplate)
      //   })
      // })

      this.map.controls.add(searchControl)
    },
    bindListener() {
      const button = document.getElementById('btn')
      if (button) {
        button.addEventListener('click', this.setAddress)
      }
    },
    showSuggest() {
      const suggestList = document.querySelector('#suggest-view')
      suggestList.classList.remove('hide-suggest')
    },

    openModal() {
      this.isOpenMap = true
    },
    closeModal() {
      this.isOpenMap = false
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
  margin-bottom: 10px;
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
  color: white;
}

#form {
  min-width: 325px;
  height: 25px;
  position: absolute;
  box-shadow: 0 4px 4px rgb(0 0 0 / 25%);
  border-radius: 5px;
  padding: 10px 15px;
  background: white;
  display: flex;
  align-items: center;

  .map_wrapper {
    display: flex;
    align-items: center;
    width: 100%;

    #map_search {
      width: 100%;
      flex: 1;

      &:focus {
        outline: none;
      }
    }

    #map_icon {
      width: 24px;
      height: 24px;
      margin-left: 10px;
    }
  }
}

.suggest-view {
  display: flex;
  flex-direction: column;
  background: #FFFFFF;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  margin-top: 20px;
  position: absolute;
  left: -15px;
  list-style-type: none;
  min-width: 355px;
  padding-left: unset !important;
}

.suggest-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 10px 15px;
  font-size: 16px;
  color: #37392E;
  cursor: pointer;
  word-break: normal;
  white-space: normal;
  line-height: 1.2rem;

  &:hover {
    background: darken(#FFFFFF, 10%);
  }
}

.hide-suggest {
  display: none;
}

// Если изменится версия yMap, то как тогда убирать дефолтную ширину?
.ymaps-2-1-79-searchbox__normal-layout {
  width: unset !important;
}

// Какая-то хрень сбоку мешается
.ymaps-2-1-79-islets_serp-popup {
  display: none !important;
}
</style>
