<template>
  <div class='custom-fields'>
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

    <template v-if='type === "stroka"'>
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

    <template v-if='type === "fail"'>
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
  </div>
</template>

<script>
import Dropzone from 'nuxt-dropzone'
import 'nuxt-dropzone/dropzone.css'
import { mapState } from 'vuex'

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
  data: () => ({
    internalData: '',
    isFocused: false,
    options: {
      url: 'http://httpbin.org/anything',
      // url: this.$store.state.BASE_URL + '/entity/files',
      destroyDropzone: false,
      duplicateCheck: true,
      headers: {
        // TODO: COOKIE
        Authorization: ''
      }
    },
    dzData: [],
    dropzone_uploaded: []
  }),
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

<style lang='scss'>
.custom-fields {
  .dropzone-files {
    display: flex;
    background: white;
    margin-top: 4px;
    border-radius: 5px;

    .dz-message {
      height: 100%;
      cursor: pointer;
    }

    .dz-preview {
      display: none;
    }

    .dropzone-custom-content {
      display: flex;
      height: 100%;
      column-gap: 0.5rem;
      align-items: center;

      span {
        font-size: 18px;
        color: #B3B3B3;
      }
    }

    .dropzone-label {
      margin-right: 2rem;
    }

    .v-select__slot {
      min-height: 56px;

      .v-label--active {
        transform: translateY(-35px) scale(1.2) !important;
        color: black !important;
      }

      label {
        top: 18px;
        background: white;
        padding: 0 10px;
        font-family: 'Roboto', sans-serif;
        font-style: normal;
        font-weight: 400;
      }

      input {
        min-height: 56px !important;
        padding-left: 1rem;
        cursor: pointer;
      }
    }

    .uploaded-image {
      min-width: 300px;
      max-height: 188px;

      img {
        width: 100%;
        max-height: 188px;
        object-fit: contain;
      }
    }
  }

  .dropzone-column {
    flex-direction: column;

    .dz-message {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    .dropzone-label {
      padding: 10px 0;
    }

    .dropzone-custom-content {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .separator {
      width: 100%;
      height: 1px;
      background-image: repeating-linear-gradient(20deg, #b3b3b3, #b3b3b3 7px, transparent 7px, transparent 19px, #b3b3b3 19px), repeating-linear-gradient(110deg, #b3b3b3, #b3b3b3 7px, transparent 7px, transparent 19px, #b3b3b3 19px), repeating-linear-gradient(200deg, #b3b3b3, #b3b3b3 7px, transparent 7px, transparent 19px, #b3b3b3 19px), repeating-linear-gradient(290deg, #b3b3b3, #b3b3b3 7px, transparent 7px, transparent 19px, #b3b3b3 19px);
      background-size: 2px 100%, 100% 2px, 2px 100%, 100% 2px;
      background-position: 0 0, 0 0, 100% 0, 0 100%;
      background-repeat: no-repeat;
    }

    .v-select__slot {
      input {
        display: none;
      }
    }

    .v-select__selections {
      padding: 26px 0 20px 0;
      column-gap: 1rem;
      overflow-X: auto;
      width: 100%;
      margin: 0 24px 10px 24px;
      flex-wrap: nowrap;
      cursor: auto;
      max-width: 850px;

      /* width */
      &::-webkit-scrollbar {
        width: 10px;
        height: 12px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        background: #FFFFFF;
        border: unset;
        box-shadow: unset;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
        background: #BABABA;
        border-radius: 2px;
        width: 100px;
      }

      /* Handle on hover */
      &::-webkit-scrollbar-thumb:hover {
        background: darken(#BABABA, 5%);
      }
    }
  }

  .v-input {
    background: white;
    border-radius: 5px;
  }

  .v-input__slot {
    &::before {
      display: none !important;
    }

    &::after {
      display: none !important;
    }
  }

  .v-textarea textarea {
    min-height: 56px;
    padding-top: 20px;
    padding-left: 10px;
  }

  .v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot {
    min-height: 56px;

    .v-label--active {
      transform: translateY(-35px) scale(1.2) !important;
      color: black !important;
    }

    label {
      top: 18px;
      background: white;
      padding: 4px 10px;
      font-family: 'Roboto', sans-serif;
      font-style: normal;
      font-weight: 400;
    }

    input {
      min-height: 56px !important;
      padding-left: 1rem;
    }
  }
}
</style>
