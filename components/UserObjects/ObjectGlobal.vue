<template>
  <div class='object-wrapper'>
    <div class='object-wrapper-top'>
      <div class='object-wrapper-top__selector'>
        <div class='object-wrapper-top__selector__title'>
          <span>Объект:</span>
        </div>

        <SelectStyled
          v-model='$store.state.currentObject'
          :item-text="'address'"
          :item-value="'id'"
          :items='$store.state.AuthModule.userData.objects'
          :placeholder="'Выберите объект'"
          title='Выберите объект'
          @update-input='callback'
        />
      </div>

      <div class='object-wrapper-top__map'>

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
        :data-object='objectData'
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
import SelectStyled from '../Common/SelectStyled'

export default {
  name: 'ObjectGlobal',
  components: { SelectStyled, TabsCustom },
  props: {
    objectData: {
      type: Object,
      required: true
    }
  },
  methods: {
    callback(value) {
      console.log(value)
    }
  }
}
</script>

<style lang='scss' scoped>
.object-wrapper {
  display: flex;
  flex-direction: column;
  padding: 15px;

  &-top {
    display: flex;
    justify-content: space-between;

    &__selector {
      display: flex;
      column-gap: 2rem;
      align-items: center;
      position: relative;

      &__title {
        //position: absolute;
        //left: 0;
      }
    }

    &__map {

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
