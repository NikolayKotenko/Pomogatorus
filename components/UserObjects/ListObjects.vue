<template>
   <v-dialog v-model="$store.state.showCabinet" max-width="800">
      <v-card>
         <v-card-title class="card_title">
            Выберите объект для сохранения
         </v-card-title>
         <v-card-text class="card_object">
            <div class="card_object_container" v-if="showObjects">
               <ObjectCard
                  v-for="(object, index) in $store.state.AuthModule.userData
                     .user_data.objects"
                  :key="index"
                  :object_data="object"
               />
            </div>
            <LoginAuth v-else />
         </v-card-text>
         <v-card-actions class="modal_footer">
            <div class="modal_footer__new" v-if="showObjects">
               <v-divider />
               <div class="card_object_new">
                  <div class="card_object_new__card">
                     <div class="card_object_new__card__plus">
                        <v-icon :size="!isMobile ? '88' : '36'">
                           mdi-plus-circle-outline
                        </v-icon>
                     </div>
                     <div class="card_object_new__card__inputs">
                        <v-text-field
                           class="card_object_new__card__inputs__input"
                           label="Адрес объекта"
                           placeholder="Введите адрес объекта"
                           dense
                           hide-details
                           solo
                           auto-grow
                           no-resize
                           row-height="1"
                           v-model="newObjAddress"
                        >
                        </v-text-field>
                        <v-btn
                           class="card_object_new__card__inputs__btn"
                           color="green lighten-1"
                           @click="createNewObject"
                           :disabled="!newObjAddress"
                        >
                           Добавить
                        </v-btn>
                     </div>
                  </div>
               </div>
            </div>
            <v-btn
               text
               color="primary"
               @click="$store.state.showCabinet = false"
               large
            >
               Закрыть
            </v-btn>
         </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script>
import ObjectCard from './ObjectCard'
import LoginAuth from '../frontLayouts/LoginAuth'

import Request from '../../services/request'

export default {
   name: 'ListObjects',
   components: { LoginAuth, ObjectCard },
   data: () => ({
      newObjAddress: '',
   }),
   mounted() {},
   computed: {
      isMobile() {
         return this.$device.isMobile
      },
      showObjects() {
         return (
            this.$store.state.AuthModule.userData &&
            Object.keys(this.$store.state.AuthModule.userData).length
         )
      },
   },
   watch: {
      '$store.state.showCabinet': {
         handler(v) {
            // if (v && this.showObjects) this.$store.dispatch('getListObjects')
         },
      },
   },
   methods: {
      async createNewObject() {
         this.$store.commit('change_loaderObjects', true)

         let { data } = await Request.post(
            this.$store.state.BASE_URL + '/entity/objects',
            {
               address: this.newObjAddress,
            }
         )
         await this.$store.dispatch('loginByToken')
         this.$store.commit('change_listObjects', [data])

         this.$store.commit('change_loaderObjects', false)
      },
   },
}
</script>

<style lang="scss" scoped>
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
}

.card_title {
   word-break: normal;
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
</style>
