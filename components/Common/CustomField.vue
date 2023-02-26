<template>
  <div
    :class='{"input-file-padding": (type === "fail" && dropzone_uploaded.length > 2)}'
    class='tab-content__input'>
    <div :class='{"custom-fields-padding": (type === "fail" && dropzone_uploaded.length > 2)}' class='custom-fields'>
      <template v-if='type === "cislo"'>
        <v-text-field
          v-model='currentData'
          :append-icon='appendIcon'
          :autofocus='isAutofocus'
          :disabled='isDisabled'
          :flat='isFlat'
          :label='label'
          :loading='isLoading'
          :placeholder='placeholder'
          :prepend-inner-icon='prependIconInner'
          :readonly='isReadonly'
          :solo='isSolo'
          dense
          hide-details
          type='number'
          @click='onClick'
          @focus='focusStart'
          @focusout='focusEnd'
        />
      </template>

      <template v-else-if='type === "stroka"'>
        <v-textarea
          v-model='currentData'
          :append-icon='appendIcon'
          :autofocus='isAutofocus'
          :clearable='isClearable'
          :disabled='isDisabled'
          :flat='isFlat'
          :hide-details='!currentRules.length'
          :label='label'
          :loading='isLoading'
          :multi-line='multiLine'
          :outlined='isOutlined'
          :placeholder='placeholder'
          :prepend-icon='prependIcon'
          :prepend-inner-icon='prependIconInner'
          :readonly='isReadonly'
          :required='isRequired'
          :rows='rowsCount'
          :rules='currentRules'
          :solo='isSolo'
          :type='typeData'
          auto-grow
          dense
          hide-details
          row-height='25'
          @click='onClick'
          @focus='focusStart'
          @focusout='focusEnd'
        />
      </template>

      <template v-else-if='type === "fail"'>
        <div :class='{"dropzone-column": isDropzoneNotEmpty}' class='dropzone-files'>
          <v-autocomplete
            v-model='dropzone_uploaded'
            :append-icon='appendIcon'
            :autofocus='isAutofocus'
            :disabled='isDropzoneNotEmpty'
            :flat='isFlat'
            :items='dzData'
            :label='label'
            :loading='isLoading'
            :placeholder='placeholder'
            :prepend-inner-icon='prependIconInner'
            :solo='isSolo'
            dense
            hide-details
            multiple
            readonly
            @click='forceDropzone'
            @focus='focusStart'
            @focusout='focusEnd'
          >
            <template v-slot:selection='data'>
              <div class='uploaded-image' v-bind='data.attrs'>
                <!-- data.item.src -->
                <img alt='' src='@/assets/images/typeobject.png'>
              </div>
            </template>
          </v-autocomplete>
          <dropzone
            id='dropzone'
            ref='dropzone'
            :destroyDropzone='true'
            :include-styling='false'
            :options='options'
            :useCustomSlot='true'
            @vdropzone-success='successData'
            @vdropzone-sending='sendingData'
          >
            <div ref='dropzoneTemplate' class='dropzone-custom-content'>
              <div v-if='isDropzoneNotEmpty' class='separator'></div>
              <div class='dropzone-label'>
                <v-icon color='#B3B3B3' large>mdi-cloud-upload</v-icon>
                <span>{{ computedLabel }}</span>
              </div>
            </div>
          </dropzone>
        </div>
      </template>

      <template v-else-if='type === "vybor-iz-spravocnika"'>
        <v-select
          v-model='currentData'
          :append-icon='appendIcon'
          :autofocus='isAutofocus'
          :clearable='isClearable'
          :disabled='isDisabled'
          :flat='isFlat'
          :hide-details='!currentRules.length'
          :items='items'
          :label='label'
          :loading='isLoading'
          :outlined='isOutlined'
          :placeholder='placeholder'
          :prepend-icon='prependIcon'
          :prepend-inner-icon='prependIconInner'
          :readonly='isReadonly'
          :rules='currentRules'
          :solo='isSolo'
          dense
          hide-details
          item-text='value'
          item-value='code'
          @click='onClick'
          @focus='focusStart'
          @focusout='focusEnd'
        >
          <template v-slot:append>
            <template v-if='!isFocused'>
              <v-icon>mdi-chevron-down</v-icon>
            </template>
            <template v-else>
              <v-icon>mdi-minus</v-icon>
            </template>
          </template>
        </v-select>
      </template>
    </div>
  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import { mapState } from 'vuex'

function getCookie(name) {
  if (document) {
    var nameEQ = name + '='
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) == ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) == 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length))
      }
    }
    return null
  }
}

export default {
  components: {
    Dropzone
  },
  name: 'CustomField',
  props: {
    type: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      default: () => ([])
    },
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    isSolo: {
      type: Boolean,
      default: false
    },
    data: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isAutofocus: {
      type: Boolean,
      default: false
    },
    isReadonly: {
      type: Boolean,
      default: false
    },
    appendIcon: {
      type: String,
      default: ''
    },
    prependIconInner: {
      type: String,
      default: ''
    },
    isFlat: {
      type: Boolean,
      default: false
    },
    rowsCount: {
      type: String,
      default: '1'
    },
    multiLine: {
      type: Boolean,
      default: false
    },
    prependIcon: {
      type: String,
      default: ''
    },
    typeData: {
      type: String,
      default: 'text'
    },
    isRequired: {
      type: Boolean,
      default: false
    },
    isClearable: {
      type: Boolean,
      default: false
    },
    itemText: {
      type: String,
      default: ''
    },
    itemValue: {
      type: String,
      default: ''
    },
    currentRules: {
      type: Array,
      default: () => ([])
    },
    isOutlined: {
      type: Boolean,
      default: false
    },
    indexArray: {
      type: Number
    }
  },
  data() {
    return {
      internalData: '',
      isFocused: false,
      options: {
        url: 'http://httpbin.org/anything',
        // url: this.$store.state.BASE_URL + '/entity/files',
        destroyDropzone: false,
        duplicateCheck: true,
        headers: {
          Authorization: getCookie('accessToken')
        }
      },
      dzData: [],
      dropzone_uploaded: []
    }
  },
  computed: {
    ...mapState('Tabs', ['inputTypes']),

    isDropzoneNotEmpty() {
      return !!this.dropzone_uploaded.length
    },
    computedLabel() {
      return this.isDropzoneNotEmpty ? 'Загрузить еще' : 'Загрузить файлы'
    },

    currentData: {
      get() {
        if (this.data) {
          return this.data
        }
        return this.internalData
      },
      set(value) {
        if (!this.data) {
          this.internalData = value
        }
        this.$emit('update-field', value)
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('on-click')
    },
    focusStart() {
      this.isFocused = true
      this.$emit('focus-in')
    },
    focusEnd() {
      this.isFocused = false
      this.$emit('focus-out')
    },

    /* DROPZONE */
    forceDropzone() {
      if (!this.isDropzoneNotEmpty) {
        this.$refs.dropzoneTemplate.click()
      }
    },
    sendingData(file, xhr, formData) {
      formData.append('uuid', file.upload.uuid)
    },
    successData(file, response) {
      // console.log(response)
      const formatObj = Object.assign({}, response)
      this.dzData.push(formatObj)
      this.dropzone_uploaded.push(formatObj)

      this.$emit('uploaded-file', formatObj)
    }
  }
}
</script>

