<template>
    <v-combobox
      class="styleSearch"
      :class="isClass"
      :outlined="isOutlined"
      :dense="isDense"
      :hide-details="isHideDetails"
      :hide-selected="isHideSelected"
      :placeholder="isPlaceholder"
      :loading="false"
      :disabled="false"
      :hide-no-data="isHideNoData"
      :items="isItems"
      :chips="isChips"
      :item-text="isItemText"
      :item-value="isItemValue"
      :return-object="isReturnObject"
      :clearable="(localSearchInputSync || localSelected) ? isClearable : false"
      @click:clear="$emit('click-clear')"
      :search-input.sync="localSearchInputSync"
      v-model="currentData"
      @update:search-input="$emit('update-search-input', localSearchInputSync)"
      @change="$emit('change-search', localSelected)"
      :menu-props="(computedSearchInputState && compareSearchStringAndExistEntry) ? {} : {value: false}"
      >
<!--      <template v-slot:append>-->
<!--        <v-icon class="selectIcon">mdi-select</v-icon>-->
<!--      </template>-->
      <template v-slot:item="data" v-if="isCustomTemplateSelections">
        <v-list-item-content @click="watchDataRedirect(data.item)">

          <v-list-item-title v-if="data.item.category === 'Тэги'">
            <hash-tag-styled :text="getTitleString(data.item.text)"></hash-tag-styled>
          </v-list-item-title>
          <v-list-item-title v-else>
            <span v-html="getTitleString(data.item.text)"></span>
          </v-list-item-title>

        </v-list-item-content>
      </template>
    </v-combobox>
</template>

<script>
import HashTagStyled from "~/components/Common/HashTagStyled";
export default {
  name: 'SearchStyled',
  components: { HashTagStyled },
  data: () => ({
    localSearchInputSync: '',
    localSelected: null
  }),
  props: {
    isClass: {
      type: String,
      default: ''
    },
    isOutlined: {
      type: Boolean,
      default: true
    },
    isDense: {
      type: Boolean,
      default: true
    },
    isHideDetails: {
      type: Boolean,
      default: true
    },
    isPlaceholder: {
      type: String,
      default: ''
    },
    isHideNoData: {
      type: Boolean,
      default: false
    },
    isHideSelected: {
      type: Boolean,
      default: false
    },
    isItems: {
      type: Array,
      default: () => []
    },
    isItemText: {
      type: String,
      default: ''
    },
    isItemValue: {
      type: String,
      default: ''
    },
    isReturnObject: {
      type: Boolean,
      default: true
    },
    isClearable: {
      type: Boolean,
      default: false
    },
    isChips: {
      type: Boolean,
      default: false
    },
    internalData: {
      type: [String, Number],
      default: null
    },
    isCustomTemplateSelections:{
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentData: {
      get() {
        if (this.internalData) {
          return this.internalData
        }
        return this.localSelected
      },
      set(value) {
        this.localSelected = value
      }
    },
    computedSearchInputState(){
      if (! this.localSearchInputSync) return false;

      return (this.localSearchInputSync.length > 2);
    },
    compareSearchStringAndExistEntry(){
      if (! this.localSelected) return true;

      return this.localSelected[this.isItemText] !== this.localSearchInputSync
    },
  },
  watch: {
    internalData: function(newVal, oldVal) {
      if (!newVal) return false

      this.$emit('update-search-input', newVal)
    }
  },
  methods:{
    watchDataRedirect(data){
      this.$emit('redirect', data)
    },
    getTitleString(text){
      const { start, middle, end } = this.getMaskedCharacters(text)
      return `${start}${this.genHighlight(middle)}${end}`
    },

    //Вспомогательные функции
    getMaskedCharacters(text){
      const searchInput = (this.localSearchInputSync || '').toString().toLocaleLowerCase()
      const index = text.toLocaleLowerCase().indexOf(searchInput)

      if (index < 0) return { start: text, middle: '', end: '' }

      const start = text.slice(0, index)
      const middle = text.slice(index, index + searchInput.length)
      const end = text.slice(index + searchInput.length)
      return { start, middle, end }
    },
    genHighlight (text) {
      return `<span class="v-list-item__mask">${text}</span>`
    },
  }
}
</script>

<style lang='scss' scoped>
</style>

<style lang='scss'>

// TODO: Эти стили изменяют вообще все инпуты в приложении, надо выносить под какой-то класс
//.v-menu__content { display:none !important; }

//.v-input__slot {
//  min-height: 60px !important;
//}

.styleSearch {
  &.primary--text {
    color: #95D7AE !important;
  }

  font-size: 1.8em !important;
  border-radius: 5px;
  //min-width: 1144px;

  .v-input__slot{
    height: 60px;
  }
  .v-select__selections{
    height: 60px;
  }
  .v-input__append-inner{
    .v-input__icon--append{
      margin-top: 8px;
    }
    //height: 60px;
    //display: flex;
    //align-items: center;
    //padding: 0;
    //margin: 0;
  }
  .v-select__slot {
    color: #37392E !important;

    input {
      margin: 10px 0 !important;
      padding: 15px 0;


    }
  }

  .selectIcon {
    color: #857885 !important;
    font-size: 1.2em !important;
    cursor: pointer;
    margin-top: 5px;

  }

  .mdi-close {
    font-size: 1em;
    margin-top: 20px;
    align-content: center;
    color: #F79256 !important;
  }
}
</style>
