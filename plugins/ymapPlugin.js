import Vue from 'vue'
import YmapPlugin from 'vue-yandex-maps'

const settings = {
  apiKey: 'f059d7be-8717-4ccf-9a7d-368d96dad9a6',
  lang: 'ru_RU',
} // настройки плагина

Vue.use(YmapPlugin, settings)
