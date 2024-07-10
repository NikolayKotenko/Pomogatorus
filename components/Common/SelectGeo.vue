<template>
  <div class="geo-select-wrap">
    <InputStyled
      :data="data.address"
      :is-readonly="true"
      :placeholder="'Выберите адрес'"
      :is-solo="true"
      :is-flat="true"
      @on-click="openModal"
    />

    <v-dialog
      v-model="isOpenMap"
      :fullscreen="isSmallScreen"
      width="1080"
    >
      <v-card class="map-container">
        <v-card-text class="px-0">
          <template v-if="drawMap">
            <yandex-map
              :behaviors="behaviors"
              :controls="controls"
              :coords="coords"
              :detailed-controls="detailedControls"
              :zoom="zoom"
              @balloonopen="bindListener"
              @click="onClickMap"
              @touch="onClickMap"
              @map-was-initialized="onMapInit"
            >
              <ymap-marker
                :balloon-template="balloonTemplate"
                :coords="coords"
                hint-content="Выбранный адрес"
                marker-id="123"
                marker-type="placemark"
              />
            </yandex-map>
          </template>
        </v-card-text>
        <template v-if="isMobile">
          <div class="buttons">
            <ButtonStyled
              id="btn"
              :custom-slot="true"
              :is-mobile="true"
              local-class="style_button"
            >
              <v-icon>mdi-content-save-outline</v-icon>
            </ButtonStyled>
            <div @click="closeModal">
              <ButtonStyled
                :custom-slot="true"
                :is-mobile="true"
                local-class="style_close"
              >
                <v-icon>
                  mdi-window-close
                </v-icon>
              </ButtonStyled>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="buttons">
            <ButtonStyled
              id="btn"
              local-class="style_button"
              local-text="Сохранить изменения"
            />
            <div @click="closeModal">
              <ButtonStyled
                local-class="style_close"
                local-text="Отмена"
              />
            </div>
          </div>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import InputStyled from './InputStyled'
import ButtonStyled from './ButtonStyled.vue'

export default {
  name: 'SelectGeo',
  components: {
    ButtonStyled,
    InputStyled
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    outerCoords: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isOpenMap: false,
      drawMap: true,

      map: {},
      coords: [],
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
      suggestInstance: null,
      isSmallScreen: false,

      address: ''
    }
  },
  computed: {
    balloonTemplate() {
      return `
      <div class='balloon-wrapper'>
        <h2 class='title-address'>Выбран адрес:</h2>
        <h1 class='name-address'>${this.address}</h1>
      </div>
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
    },

    isMobile() {
      return this.$device.isMobile
    }
  },
  watch: {
    'outerCoords': {
      handler(v) {
        this.coords = v
      }
    }
  },
  mounted() {
    this.coords = this.outerCoords

    if (this.data?.address) {
      this.address = this.data.address
    }

    this.$nextTick(() => {
      window.addEventListener('resize', this.getWidth)
      this.getWidth()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getWidth)
  },
  methods: {
    onMapInit(map) {
      this.map = map
      this.searchControl()
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

        /* Если после клика менять значение в инпуте, то наш suggest-list не свернется */
        // const searchInput = document.querySelector('#map_search')
        // if (searchInput) {
        //   searchInput.value = query
        // }

        const suggestList = document.querySelector('#suggest-view')
        if (suggestList) {
          suggestList.classList.add('hide-suggest')
        }
      })
    },
    async getGeoCodeByCoords() {
      await this.$axios.get(`https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${this.$config.myPublicVariable}&geocode=${this.coords[1]},${this.coords[0]}&lang=ru_RU&results=1`).then(res => {
        this.address = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.text
        this.map.setCenter(this.coords)
        this.map.balloon.open(this.coords, this.balloonTemplate, {
          maxWidth: 200,
          minHeight: 70
        })
      })
    },
    onClickMap(e) {
      this.coords = e.get('coords')
      this.getGeoCodeByCoords()
    },
    searchControl() {
      const self = this

      /* CUSTOM SUGGEST LIST */
      const suggestTemplate = ymaps.templateLayoutFactory.createClass(this.suggestTemplate, {
        build: function() {
          suggestTemplate.superclass.build.call(this)

          this.searchCallback = ymaps.util.bind(this.searchCb, this)

          const items = document.getElementsByClassName('suggest-item')
          for (let i = 0; i < items.length; i++) {
            items[i].addEventListener('click', this.searchCallback)
            items[i].addEventListener('touchstart', this.searchCallback)
          }
        },
        searchCb: function(e) {
          self.getGeoCodeByName(e.target.innerHTML)
        }
      })

      /* CUSTOM SEARCH */
      const template = ymaps.templateLayoutFactory.createClass(this.searchTemplate, {
        build: function() {
          template.superclass.build.call(this)
          this.searchCallback = ymaps.util.bind(this.searchCb, this)

          const searchElem = document.querySelector('#form')
          searchElem.addEventListener('click', self.showSuggest)
          searchElem.addEventListener('touchstart', self.showSuggest)
          searchElem.addEventListener('submit', this.searchCallback)
          const input = document.getElementById('map_search')
          self.suggestInstance = new ymaps.SuggestView(input, {
            layout: suggestTemplate,
            results: self.isMobile ? 4 : 5
          })

          self.suggestInstance.events.add('select', this.searchCallback)

          /* Если при инициализации в объекте уже записан адрес, то отрисуем его в инпуте */
          if (self.address) {
            input.value = self.address
          }
        },
        clear: function() {
          const icon = document.querySelector('#map_icon')
          if (icon) {
            icon.removeEventListener('submit', () => {
            })
          }

          template.superclass.clear.call(this)
        },
        searchCb: function(e) {
          const map = this.getData().control.getMap()
          e.preventDefault()

          const ctrl = this.getData().control

          const input = document.getElementById('map_search')
          ctrl.search(input.value).then(function(value) {
            // For debug
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
        button.addEventListener('touch', this.setAddress)
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
      this.coords = this.outerCoords
      if (this.data?.address) {
        this.address = this.data.address
      }
      this.map.balloon.open(this.coords, this.balloonTemplate)
      this.isOpenMap = false
    },
    getWidth() {
      if (process.client) {
        this.isSmallScreen = window.innerWidth <= 375
      }
    }
  },
}
</script>
