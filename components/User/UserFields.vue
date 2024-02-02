<template>
  <v-form v-model="isFormValid">
    <!--  MOBILE  -->
    <template v-if="isMobile">
      <InputStyled
        :class="'styleTextField'"
        :data="form.first_name"
        :is-label="'Имя'"
        :is-outlined="true"
        @update-input="setFirstNameData"
      />

      <InputStyled
        :class="'styleTextField'"
        :data="form.middle_name"
        :is-label="'Фамилия'"
        :is-outlined="true"
        @update-input="setMiddleNameData"
      />

      <InputStyled
        :class="'styleTextField'"
        :data="form.last_name"
        :is-label="'Отчество'"
        :is-outlined="true"
        @update-input="setLastNameData"
      />

      <InputStyled
        :class="'styleTextField'"
        :data="form.email"
        :is-label="'Email'"
        :is-outlined="true"
        :rules="emailRules"
        color="#95D7AE"
        @update-input="setEmailData"
      />

      <VTextField
        v-model="form.telephone"
        v-mask="mask"
        color="#95D7AE"
        dense
        label="Телефон"
        outlined
        @change="setData"
      />
    </template>

    <!--  DESKTOP  -->
    <template v-else>
      <v-row>
        <v-col>
          <InputStyled
            :class="'styleTextField'"
            :data="form.first_name"
            :is-label="'Имя'"
            :is-outlined="true"
            @update-input="setFirstNameData"
          />
        </v-col>
        <v-col>
          <InputStyled
            :class="'styleTextField'"
            :data="form.middle_name"
            :is-label="'Фамилия'"
            :is-outlined="true"
            @update-input="setMiddleNameData"
          />
        </v-col>
        <v-col>
          <InputStyled
            :class="'styleTextField'"
            :data="form.last_name"
            :is-label="'Отчество'"
            :is-outlined="true"
            @update-input="setLastNameData"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <InputStyled
            :class="'styleTextField'"
            :data="form.email"
            :is-label="'Email'"
            :is-outlined="true"
            :rules="emailRules"
            color="#95D7AE"
            @update-input="setEmailData"
          />
        </v-col>
        <v-col>
          <!--          TODO: Разобраться с маской телефона. После использовать компонент "InputStyled" -->
          <VTextField
            v-model="form.telephone"
            v-mask="mask"
            color="#95D7AE"
            dense
            label="Телефон"
            outlined
            @change="setData"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col/>
      </v-row>
    </template>

    <div class="roles_wrapper">
      <span class="roles_wrapper_title">Кто вы?</span>
      <v-checkbox
        v-for="(type, index) in types"
        :key="index"
        v-model.number="form[type.key]"
        :append-icon="type.icon"
        :false-value="0"
        :label="type.text"
        :true-value="1"
        class="roles_style"
        color="#95D7AE"
        dense
        hide-details
        @change="setData"
      />
    </div>
    <MapServiceArea/>
  </v-form>
</template>

<script>
import { mapState } from 'vuex';
import InputStyled from '../Common/InputStyled.vue';
import MapServiceArea from '~/components/Widgets/MapServiceArea';

export default {
  name: 'UserFields',
  components: { MapServiceArea, InputStyled },
  data: () => ({
    isFormValid: false,
    form: {
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      telephone: '',
      home_owner: '',
      installation_engineering_systems: '',
      selling_engineering_equipment: '',
      marketing_and_sales: ''
    },
    mask: '+7 (###) ###-##-##',
    types: [
      {
        text: 'Собственник дома',
        key: 'home_owner',
        icon: 'mdi-home-account'
      },
      {
        text: 'Профессионально занимаюсь монтажом инженерных систем',
        key: 'installation_engineering_systems',
        icon: 'mdi-account-hard-hat'
      },
      {
        text: 'Занимаюсь продажей инженерного оборудования',
        key: 'selling_engineering_equipment',
        icon: 'mdi-cog-transfer'
      },
      {
        text: 'Маркетинг и продажи',
        key: 'marketing_and_sales',
        icon: 'mdi-shopping'
      }
    ],
    emailRules: [
      v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Введите корректный email'
    ],
    telephoneRules: [
      v => !v || this.form || 'Введите корректный email'
    ]
  }),
  watch: {
    'isChanged': {
      handler(v) {
        this.$emit('is-changed', v);
      }
    }
  },
  mounted() {
    this.getUserInfo();
  },
  computed: {
    ...mapState({
      userData: state => state.AuthModule.userData,
      defaultUserData: state => state.AuthModule.defaultUserData
    }),

    isMobile() {
      return !!this.$device.isMobile;
    },
    isChanged() {
      const result = [];

      for (const key in this.form) {
        result.push(this.form[key] === this.defaultUserData[key]);
      }

      return result.includes(false);
    }
  },
  methods: {
    getUserInfo() {
      if (this.userData && Object.keys(this.userData).length) {
        for (const key in this.form) {
          this.form[key] = this.userData[key];
        }
      }
    },
    setFirstNameData(name) {
      this.form.first_name = name;
      this.$emit('new-data', { data: this.form, isValid: this.isFormValid });
    },
    setMiddleNameData(name) {
      this.form.middle_name = name;
      this.$emit('new-data', { data: this.form, isValid: this.isFormValid });
    },
    setLastNameData(name) {
      this.form.last_name = name;
      this.$emit('new-data', { data: this.form, isValid: this.isFormValid });
    },
    setEmailData(name) {
      this.form.email = name;
      this.$emit('new-data', { data: this.form, isValid: this.isFormValid });
    },
    setTelephoneData(name) {
      this.form.telephone = name;
      this.$emit('new-data', { data: this.form, isValid: this.isFormValid });
    },
    setData(data) {
      this.$emit('new-data', { data: this.form, isValid: this.isFormValid });
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'assets/styles/style';

.roles_wrapper {

  .roles_wrapper_title {
    font-size: 2em;
    margin-bottom: 1em;
  }
}
</style>
<style lang="scss">
@import 'assets/styles/style';

.roles_style {
  border-radius: 5px;
  padding: 10px;
  transition: $transition;
  font-size: 1.2em;

  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  }
}
</style>

