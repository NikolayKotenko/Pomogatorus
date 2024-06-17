<template>
  <div class="modal_wrapper">
    <template>
      <SubHeader/>
      <div class="list_objects_header">
        Список доступных объектов
      </div>
      <v-card
        v-show="$store.getters.stateAuth"
        class="static_search_breadcrumbs"
        elevation="5"
        outlined
        shaped
      >
        <div class="wrapper_chips">
          <!-- Быстрые чипсы -->
          <ChipsStyled
            :data="selectedQueryChips"
            :is-filter="true"
            :is-multiple="true"
            :list-chips="computedListChips"
            class="chips_list_object"
            @update-chips="setQueryChips"
          />

          <TooltipStyled
            :is-top="true"
            :title="'Контекст работы'"
          >
            <v-icon
              color="#5D80B5"
            >
              mdi-help-circle-outline
            </v-icon>
          </TooltipStyled>
        </div>
        <!-- Поиск -->
        <SearchStyled
          :class="'styleSearch'"
          :internal-data="querySearchData.value"
          :is-clearable="true"
          :is-custom-template-selections="true"
          :is-disabled="isLoadingObjects"
          :is-hide-selected="false"
          :is-item-text="'text'"
          :is-item-value="'text'"
          :is-loading="isLoadingObjects"
          :is-placeholder="'Поиск по имени, адресу, заметкам'"
          :is-return-object="true"
          style="max-height: 61px"
          @update-search-input="setQuerySearchData"
        />
      </v-card>
      <div
        v-if="$store.getters['Objects/stateFilledListObjects'] && !$store.state.Objects.isLoadingObjects"
        class="card_object flex-grow-1 flex-shrink-1"
      >
        <div class="card_object_container">
          <CardObject
            v-for="(object, index) in listObjects"
            :key="index"
            :object_data="object"
            @open-detail="openDetail"
          />
        </div>
      </div>
      <v-sheet
        v-for="n in 3"
        v-if="!$store.getters.stateAuth || $store.state.Objects.isLoadingObjects"
        :key="n"
        class="pa-3"
        @click="$store.dispatch('callModalAuth')"
      >
        <TooltipStyled :title="'Авторизуйтесь чтобы увидеть свои объекты'">
          <v-skeleton-loader
            class="mx-auto"
            type="card"
          />
        </TooltipStyled>
      </v-sheet>
      <div v-if="$store.getters.stateAuth" class="new_object_wrapper custom_grid_system">
        <!--        <v-divider class="new_obj_divider"></v-divider> -->
        <CreateNewObject/>
      </div>
      <VDialog
        v-if="showDetail"
        v-model="showDetail"
        :fullscreen="isMobile"
        :hide-overlay="isMobile"
        :width="isMobile ? 1080 : null"
        content-class="dialogStyled"
        persistent
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
import { mapActions, mapGetters, mapState } from 'vuex';
import SubHeader from '../SubHeader.vue'
import ObjectGlobal from './ObjectGlobal';
import CardObject from './CardObject.vue';
import TooltipStyled from '@/components/Common/TooltipStyled';
import ChipsStyled from '~/components/Common/ChipsStyled';
import SearchStyled from '~/components/Common/SearchStyled';
import CreateNewObject from '~/components/UserObjects/CreateNewObject';

export default {
  name: 'ListObjects',
  components: { SubHeader, CreateNewObject, ChipsStyled, TooltipStyled, CardObject, ObjectGlobal, SearchStyled },
  data: () => ({
    object: {},
    showDetail: false,
    detailData: {},
    debounceTimeout: null,
    selectedQueryChips: [],
    listQueryFilters: [
      {
        text: 'Мои объекты',
        value: 'home_owner=true'
      },
      {
        text: 'Где я работаю',
        value: 'home_worker=true'
      }
    ],
    querySearchData: {
      baseQuery: 'search=',
      value: ''
    },
    allQueryFilters: []
  }),
  watch: {
    'getUserId': {
      handler(val) {
        this.setAllQuery();
      }
    }
    // '$store.state.AuthModule.userData.objects_context': {
    //   handler(newVal, oldVal) {
    //     console.log('asd', newVal)
    //     if (!newVal) {
    //       console.log('asd', newVal)
    //       this.selectedQueryChips = [];
    //       newVal.forEach((elem) => {
    //         if (elem.search) {
    //           this.querySearchData.value = elem.search;
    //         } else {
    //           this.selectedQueryChips.push(Object.keys(elem) + '=' + Object.values(elem));
    //         }
    //         console.log('asd', newVal)
    //       });
    //       console.log('asd', newVal)
    //     }
    //     console.log('asd', newVal)
    //   }
    // }
  },
  computed: {
    ...mapState('Objects', ['listObjects', 'isLoadingObjects']),
    ...mapState(['userData']),
    ...mapGetters(['getUserId']),

    notEmptyObject() {
      return !!Object.keys(this.object).length;
    },

    getCoords() {
      return this.object?.long && this.object?.lat ? [this.object.lat, this.object.long] : [55.753215, 37.622504];
    },

    isMobile() {
      return this.$device.isMobile;
    },
    computedListChips() {
      return this.listQueryFilters;
    }
  },
  methods: {
    ...mapActions('Objects', ['createNewObject', 'getListObjectsByUserId']),

    closeDetailObj() {
      this.showDetail = false;
    },
    closeDetail() {
      this.$emit('close-detail');
    },
    openDetail(data) {
      this.detailData = data;
      this.showDetail = true;
    },
    setAddressMap(data) {
      this.object.address = data.address;
      this.object.lat = data.coords[0];
      this.object.long = data.coords[1];

      this.updateProperties.address = data.address;
      this.updateProperties.lat = data.coords[0];
      this.updateProperties.long = data.coords[1];
    },
    setQueryChips(nameChip) {
      console.log('setQueryChips', nameChip);
      this.selectedQueryChips = [];
      nameChip.forEach((value) => {
        this.selectedQueryChips.push(value);
      });
      this.setAllQuery();
    },
    setQuerySearchData(string) {
      console.log(string);
      this.querySearchData.value = (string) || '';
      this.setAllQuery();
    },
    setAllQuery() {
      const value1 = this.selectedQueryChips;
      const value2 = (this.querySearchData.value) ? this.querySearchData.baseQuery + this.querySearchData.value : null;

      const calcQueryFilters = [];
      calcQueryFilters.push(...value1);
      if (value2) {
        calcQueryFilters.push(value2);
      }

      this.allQueryFilters = [];
      calcQueryFilters.forEach((string) => {
        const params = string.split('=');
        this.allQueryFilters.push({
          [params[0]]: params[1]
        });
      });

      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(async () => {

        if (this.allQueryFilters.length) {
          const responseUserData = await this.$store.dispatch('UserSettings/updateUser', {
            userId: this.$store.getters.getUserId,
            data: {
              objects_context: JSON.stringify(this.allQueryFilters)
            }
          });
          console.log('responseUserData', responseUserData);
        }

        const responseListObjects = await this.$store.dispatch('Objects/getListObjectsByUserId', this.allQueryFilters);
        if (responseListObjects.codeResponse > 400) {
          await this.$store.dispatch('callModalAuth');
          this.$store.commit('Objects/setLoadingObjects', false);
        }
      }, 500);
    }
  }
};
</script>

<style lang="scss">
@import 'assets/styles/style';

.modal_wrapper {
  max-width: 890px;
  margin-left: auto;
  margin-right: auto;
  .list_objects_header {
    font-size: 1.5em;
    font-weight: 700;
  }
}


.static_search_breadcrumbs {
  position: sticky;
  display: block;
  top: 1px;
  background: white;
  z-index: 9;
  padding: 15px;

  .wrapper_chips {
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
  }

  .styleSearch {
    font-size: 1.3em !important;
  }
}

.chips_list_object {
  margin-top: 0 !important;

  .styleChip {
    font-size: 1.1em;
  }
}

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
  row-gap: 0 !important;

  &_container {
    padding: 20px 0 25% 0;
  }
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
    transition: $transition;
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
  position: fixed;
  width: 100%;
  max-width: inherit;
  bottom: 0;
  padding-bottom: 20px;
  margin-top: auto;
  background: white;
  box-shadow: none;
  @media only screen and (max-width: 415px) {
    padding-right: 20px;
  }
}

.new_obj_divider {
  background-color: #353e47;
  margin: 50px 0 50px 0;
}

@media (max-width: 768px) {
  .dialogStyled {
    max-height: unset !important;
    margin: 56px 0 0 0;
  }

  .modal_wrapper {
    justify-self: center;

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
