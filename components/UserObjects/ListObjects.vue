<template>
  <div class="modal_wrapper">
    <template v-if="isLoadingObjects">
      <VProgressCircular
        :size="50"
        color="primary"
        indeterminate
        style="margin: 20px auto 40px auto"
      />
    </template>

    <template v-else>
      <div v-if="listObjects.length" class="card_object flex-grow-1 flex-shrink-1">
        <div v-if="listObjects.length" class="card_object_container">
          <CardObject
            v-for="(object, index) in listObjects"
            :key="index"
            :object_data="object"
            @open-detail="openDetail"
          />
        </div>

        <!-- TODO: Что показывать когда объектов еще нет??? -->
        <div v-else>
          Создайте объект!
        </div>
      </div>
      <LoginAuth v-else/>
      <div v-if="listObjects.length" class="new_object_wrapper">
        <!--        <v-divider class="new_obj_divider"></v-divider> -->
        <div class="new_object">
          <div class="details_new_object">
            <div class="object_name">
              <div class="object_name_title">
                <VIcon color="#000000" style="margin-right: 10px">
                  mdi-plus-circle-outline
                </VIcon>
                <span>Cоздайте новый объект</span>
              </div>
              <VTextField
                v-model="newObjName"
                auto-grow
                class="text_field"
                dense
                hide-details
                label="Введите название объекта"
                no-resize
                row-height="1"
                solo
              />
            </div>
          </div>
          <div class="new_object_button">
            <ButtonStyled
              :disabled="!newObjName"
              :loading="loadingObjects"
              :local-text="'Создать объект'"
              local-class="style_button"
              @click-button="createNewObject"
            />
          </div>
        </div>
      </div>

      <VDialog
        v-if="showDetail"
        v-model="showDetail"
        :fullscreen="isMobile"
        :hide-overlay="isMobile"
        :width="isMobile ? 1080 : null"
        content-class="dialogStyled"
        scrollable
      >
        <ObjectGlobal
          :object-data="detailData"
          @close-modal="closeDetailObj"
        />
      </VDialog>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

import LoginAuth from '../frontLayouts/LoginAuth'

import Request from '../../services/request'
import ButtonStyled from '../Common/ButtonStyled.vue'
import ObjectGlobal from './ObjectGlobal'
import CardObject from './CardObject.vue'

export default {
  name: 'ListObjects',
  components: { ButtonStyled, CardObject, ObjectGlobal, LoginAuth },
  data: () => ({
    object: {},
    newObjAddress: '',
    newObjName: '',
    showDetail: false,
    detailData: {}
  }),
  watch: {
    'getUserId': {
      handler(oldV, newV) {
        if (oldV !== newV) {
          this.getListObjects()
        }
      }
    }
  },
  mounted() {
    this.getListObjects()
  },
  computed: {
    ...mapState({
      loadingObjects: state => state.loading_objects
    }),
    ...mapState('Objects', ['listObjects', 'isLoadingObjects']),
    ...mapGetters(['getUserId']),

    notEmptyObject() {
      return !!Object.keys(this.object).length
    },

    getCoords() {
      return this.object?.long && this.object?.lat ? [this.object.lat, this.object.long] : [55.753215, 37.622504]
    },

    isMobile() {
      return this.$device.isMobile
    }
  },
  methods: {
    ...mapActions('Objects', ['getUserObjects']),

    getListObjects() {
      this.getUserObjects(this.getUserId)
    },

    async createNewObject() {
      this.$store.commit('change_loaderObjects', true)

      const { data } = await Request.post(this.$store.state.BASE_URL + '/entity/objects', {
        address: this.newObjAddress,
        name: this.newObjName
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
      this.$emit('close-detail')
    },
    openDetail(data) {
      this.detailData = data
      this.showDetail = true
    },
    setAddressMap(data) {
      this.object.address = data.address
      this.object.lat = data.coords[0]
      this.object.long = data.coords[1]

      this.updateProperties.address = data.address
      this.updateProperties.lat = data.coords[0]
      this.updateProperties.long = data.coords[1]
    }
  }
}
</script>

<style lang='scss'>
@import 'assets/styles/userObjects';

.modal_wrapper {
  padding: 0 !important;
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
    position: sticky;
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

.new_object_wrapper {
  position: sticky;
  bottom: 0;
  padding-bottom: 20px;
  margin-top: 10px;
  background: white;
  box-shadow: none;
}

.new_obj_divider {
  background-color: #353e47;
  margin: 50px 0 50px 0;
}

.new_object {
  display: flex;
  padding: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  box-shadow: 0px 10px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.4s ease-in-out !important;

  &:hover {
    box-shadow: 0px 5px 20px 7px rgba(34, 60, 80, 0.2) !important;
    background-color: #FFF4CB;
  }

  .img {

    .empty_placeholder {
      background-color: #D9D9D9;
      min-width: 250px;
      min-height: 160px;
      margin-right: 20px;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #FFFFFF;
      font-size: 1.3em;
    }
  }

  .details_new_object {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .object_name {
      width: 100%;
      font-size: 1.5em;
      font-weight: 400;

      .object_name_title {
        display: flex;
        align-items: center;
      }

      .text_field {
        margin-top: 1em;
      }
    }

    .object_address {
      display: flex;
      align-items: flex-end;
      width: 100%;
    }

  }

  .new_object_button {
    display: flex;
    align-items: flex-end;
    margin-left: 20px;
  }
}

@media (max-width: 768px) {
  .dialogStyled {
    max-height: unset !important;
    margin: 56px 0 0 0;
  }

  .modal_wrapper {
    justify-self: center;
  }

  .new_object {
    flex-direction: column;
    row-gap: 1rem;

    .new_object_button {
      margin-left: 0;
      justify-content: center;
    }
  }
}

@media only screen and (max-width: 600px) {
  .card_object_new {
    &__card {
      align-items: flex-start !important;
      font-size: 0.9rem !important;

      &__plus {
        padding-top: 4px;
      }
    }
  }
}
</style>
