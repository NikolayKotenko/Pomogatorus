<template>
  <div class='object-wrapper'>
    <div class='object-wrapper-top'>
      <div class='object-wrapper-top__selector'>
        <div class='object-wrapper-top__selector__title'>
          <span>Объект:</span>
        </div>

        <div class='object-wrapper-top__selector__select'>
          <SelectObjectStyled
            :custom-style='true'
            :data='object'
            :is-solo='true'
            :item-text='computedText'
            :item-value="'id'"
            :items='$store.state.AuthModule.userData.objects'
            :placeholder="'Выберите объект'"
            title='Выберите объект'
            @update-input='callback'
          />
        </div>
      </div>

      <div class='object-wrapper-top__map'>
        <SelectGeo v-if='notEmptyObject' :data='object' @set-new-address='setAddressMap' />
      </div>
    </div>

    <div class='object-wrapper-documents'>
      <div class='object-wrapper-documents__img'>

      </div>

      <div class='object-wrapper-documents__docs'>

      </div>
    </div>

    <div class='object-wrapper-tabs'>
      <TabsCustom
        :data-object='object'
        :tab-content='[]'
        :tabs='[]'
      />
    </div>

    <div class='object-wrapper-footer'>
      <div class='object-wrapper-footer__left'>
        <v-btn>
          Сохранить изменения
        </v-btn>

        <v-btn>
           <span>
             Скачать PDF
           </span>
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </div>

      <v-btn>
        Отмена
      </v-btn>
    </div>
  </div>
</template>

<script>
import TabsCustom from '../Common/TabsCustom'
import SelectObjectStyled from '../Common/SelectObjectStyled'
import SelectGeo from '../Common/SelectGeo'

export default {
  name: 'ObjectGlobal',
  components: { SelectGeo, SelectObjectStyled, TabsCustom },
  props: {
    objectData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    object: {}
  }),
  mounted() {
    this.getObjectFromProp()
  },
  computed: {
    notEmptyObject() {
      return !!Object.keys(this.object).length
    },
    computedText() {
      return this.object?.name ? 'name' : 'address'
    }
  },
  methods: {
    getObjectFromProp() {
      this.object = this.objectData
    },
    callback(value) {
      console.log(value)
    },
    setAddressMap(data) {
      this.object.address = data.address
      this.object.lat = data.coords[0]
      this.object.long = data.coords[1]
    }
  }
}
</script>

<style lang='scss' scoped>
.object-wrapper {
  display: flex;
  flex-direction: column;
  padding: 40px;

  &-top {
    display: grid;
    grid-template-columns: 30% 1fr;
    column-gap: 10rem;

    &__selector {
      display: flex;
      column-gap: 1rem;
      align-items: center;
      position: relative;

      &__title {
      }

      &__select {
        max-width: 220px;
      }
    }

    &__map {
      width: 100%;
    }
  }

  &-documents {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__img {
      width: 400px;
      height: 300px;
    }

    &__docs {
      width: 400px;
      height: 300px;
    }
  }

  &-tabs {

  }

  &-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__left {
      display: flex;
      column-gap: 3rem;
      align-items: center;
    }
  }
}
</style>
