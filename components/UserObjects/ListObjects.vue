<template>
  <div class='modal_wrapper'>
    <template v-if='isLoadingObjects'>
      <v-progress-circular
        :size='50'
        color='primary'
        indeterminate
        style='margin: 20px auto 40px auto'
      ></v-progress-circular>
    </template>

    <template v-else>
      <div v-if='listObjects.length' class='card_object flex-grow-1 flex-shrink-1 pa-5'>
        <div v-if='listObjects.length' class='card_object_container'>
          <ObjectCard
            v-for='(object, index) in listObjects'
            :key='index'
            :object_data='object'
            @openDetail='openDetail'
          />
        </div>

        <!-- TODO: Что показывать когда объектов еще нет??? -->
        <div v-else>
          Создайте объект!
        </div>
      </div>
      <LoginAuth v-else />

      <div class='modal_footer pa-5'>
        <div v-if='listObjects.length' class='modal_footer__new'>
          <v-divider />
          <div class='card_object_new'>
            <div class='card_object_new__card'>
              <div class='card_object_new__card__plus'>
                <v-icon :size="!isMobile ? '88' : '36'"> mdi-plus-circle-outline</v-icon>
              </div>
              <div class='card_object_new__card__inputs'>
                <v-text-field
                  v-model='newObjAddress'
                  auto-grow
                  class='card_object_new__card__inputs__input'
                  dense
                  hide-details
                  label='Введите адрес объекта'
                  no-resize
                  row-height='1'
                  solo
                >
                </v-text-field>
                <v-btn
                  :disabled='!newObjAddress'
                  :loading='loadingObjects'
                  class='card_object_new__card__inputs__btn'
                  color='green lighten-1'
                  @click='createNewObject'
                >
                  Добавить
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>

      <v-dialog
        v-if='showDetail'
        v-model='showDetail'
        content-class='dialogStyled'
        scrollable
        width='1080'
      >
        <ObjectGlobal
          :object-data='detailData'
          @close-modal='closeDetailObj'
        />
      </v-dialog>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import ObjectCard from './ObjectCard'
import LoginAuth from '../frontLayouts/LoginAuth'

import Request from '../../services/request'
import ObjectDetail from './ObjectDetail'
import ObjectGlobal from './ObjectGlobal'

export default {
  name: 'ListObjects',
  components: { ObjectGlobal, ObjectDetail, LoginAuth, ObjectCard },
  data: () => ({
    newObjAddress: '',
    showDetail: false,
    detailData: {}
  }),
  mounted() {
    this.getListObjects()
  },
  watch: {
    'getUserId': {
      handler(oldV, newV) {
        if (oldV !== newV) {
          this.getListObjects()
        }
      }
    }
  },
  computed: {
    ...mapState({
      loadingObjects: state => state.loading_objects
    }),
    ...mapState('Objects', ['listObjects', 'isLoadingObjects']),
    ...mapGetters(['getUserId']),

    isMobile() {
      return this.$device.isMobile
    },
    // showObjects() {
    //   return this.$store.state.AuthModule.userData && Object.keys(this.$store.state.AuthModule.userData).length
    // }
  },
  methods: {
    ...mapActions('Objects', ['getUserObjects']),

    getListObjects() {
      this.getUserObjects(this.getUserId)
    },

    async createNewObject() {
      this.$store.commit('change_loaderObjects', true)

      let { data } = await Request.post(this.$store.state.BASE_URL + '/entity/objects', {
        address: this.newObjAddress
      })

      await this.getUserObjects(this.getUserId)

      if (this.$store.state.AuthModule.userData.objects.length < 1) {
        this.$store.commit('set_currentObject', data)
      }

      this.$store.commit('change_listObjects', [data])

      this.newObjAddress = ''

      this.$store.commit('change_loaderObjects', false)
    },
    closeDetailObj() {
      this.showDetail = false
    },
    closeDetail() {
      this.$emit('closeDetail')
    },
    openDetail(data) {
      this.detailData = data
      this.showDetail = true
    }
  }
}
</script>

<style lang='scss'>
@import 'assets/styles/userObjects';

@media only screen and (max-width: 600px) {
  .card_object_new {
    &__card {
      align-items: start !important;
      font-size: 0.9rem !important;

      &__plus {
        padding-top: 4px;
      }
    }
  }
  .modal_wrapper {
    //padding: 10px !important;
  }
}

//::v-deep .v-dialog {
//  max-height: 80%;
//}

.modal_wrapper {
  padding-bottom: 0;
}

.card_title {
  word-break: normal;
  background: white;
  position: sticky;
  top: 0;
  padding: 20px;
  z-index: 404;
}

.card_object {
  display: flex;
  flex-direction: column;
  row-gap: 25px;
}

.card_object_new {
  &__card {
    display: grid;
    grid-template-columns: auto 80%;
    padding: 10px 15px;
    border: 1px solid darkgrey;
    border-radius: 10px;
    box-shadow: 0px 3px 8px 2px rgba(34, 60, 80, 0.2);
    font-size: 1.25rem;
    color: black;
    transition: all 0.4s ease-in-out;
    align-items: center;

    &:hover {
      box-shadow: 0px 3px 10px 4px rgba(34, 60, 80, 0.2);
      transform: scale(1.02);
    }

    &__plus {
    }

    &__inputs {
      display: flex;
      flex-direction: column;
      row-gap: 15px;

      &__input {
      }

      &__btn {
      }
    }
  }
}

.modal_footer {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: sticky;
  bottom: 0;
  background: #ffffff;
  z-index: 6;

  &__new {
    width: 100%;
    display: flex;
    flex-direction: column;
    row-gap: 20px;
  }
}

.dialogStyled {
  max-height: 92% !important;
  margin: 60px 0 0 0;
}
</style>
