export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  publicRuntimeConfig: {
    myPublicVariable: process.env.VUE_APP_YA_KEY,
  },
  env: {
    apiEndpoint: process.env.VUE_APP_API_ENDPOINT,
  },
  head: {
    // titleTemplate: '%s - pomogatorus-service',
    title: 'Помогаторус',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1',
      },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/pomogachkin_icon.svg' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/jsonld',
    '~/plugins/v-mask.js',
    '~/plugins/vuelidate.js',
    { src: '~/plugins/ymapPlugin.js', mode: 'client' },
    { src: '@/plugins/vue-html2pdf', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/device',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
    'vue-social-sharing/nuxt',
    //
    '@nuxtjs/toast',
    '@nuxtus/nuxt-localtunnel',
    'nuxt-socket-io',
  ],
  serverMiddleware: ['~/api/index.js'],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
    withCredentials: true,
  },
  toast: {
    position: 'bottom-right',
    register: [
      // Register custom toasts
      {
        name: 'my-error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error',
        },
      },
    ],
    duration: 5000,
  },
  localtunnel: {},
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  io: {
    sockets: [
      {
        name: 'home',
        url: 'http://100.126.181.178:5000/',
        vuex: {},
        namespaces: {},
      },
    ],
    // Options
  },
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
  loading: {
    color: 'blue',
  },
}
