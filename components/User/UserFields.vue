<template>
  <v-form v-model='isFormValid'>

    <!--  MOBILE  -->
    <template v-if='isMobile'>
      <v-text-field
        v-model='form.first_name'
        class='mb-4'
        dense
        hide-details
        placeholder='Введите имя'
        @change='setData'
      ></v-text-field>

      <v-text-field
        v-model='form.middle_name'
        class='mb-4'
        dense
        hide-details
        placeholder='Введите фамилию'
        @change='setData'
      ></v-text-field>

      <v-text-field
        v-model='form.last_name'
        class='mb-4'
        dense
        hide-details
        placeholder='Введите отчество'
        @change='setData'
      ></v-text-field>

      <v-text-field
        v-model='form.email'
        :rules='emailRules'
        class='mb-4'
        dense
        hide-details
        placeholder='Введите email'
        @change='setData'
      ></v-text-field>

      <v-text-field
        v-model='form.telephone'
        v-mask="'+7 (###) ###-##-##'"
        class='mb-4'
        dense
        hide-details
        placeholder='Введите телефон'
        @change='setData'
      ></v-text-field>
    </template>

    <!--  DESKTOP  -->
    <template v-else>
      <v-row>
        <v-col>
          <v-text-field
            v-model='form.first_name'
            label='Имя'
            placeholder='Введите имя'
            @change='setData'
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model='form.middle_name'
            label='Фамилия'
            placeholder='Введите фамилию'
            @change='setData'
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model='form.last_name'
            label='Отчество'
            placeholder='Введите отчество'
            @change='setData'
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-text-field
            v-model='form.email'
            :rules='emailRules'
            label='email'
            placeholder='Введите email'
            @change='setData'
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model='form.telephone'
            v-mask="'+7 (###) ###-##-##'"
            label='Телефон'
            placeholder='Введите телефон'
            @change='setData'
          ></v-text-field>
        </v-col>
      </v-row>
    </template>

    <v-row>
      <v-col>
        <v-checkbox
          v-for='(type, index) in types'
          :key='index'
          v-model.number='form[type.key]'
          :false-value='0'
          :label='type.text'
          :true-value='1'
          dense
          hide-details
          @change='setData'
        ></v-checkbox>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserFields',
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
      selling_engineering_equipment: ''
    },
    types: [
      {
        text: 'Собственник дома',
        key: 'home_owner'
      },
      {
        text: 'Профессионально занимаюсь монтажом инженерных систем',
        key: 'installation_engineering_systems'
      },
      {
        text: 'Занимаюсь продажей инженерного оборудования',
        key: 'selling_engineering_equipment'
      }
    ],
    emailRules: [
      v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Введите корректный email'
    ]
  }),
  mounted() {
    this.getUserInfo()
  },
  watch: {
    'isChanged': {
      handler(v) {
        this.$emit('isChanged', v)
      }
    }
  },
  computed: {
    ...mapState({
      userData: state => state.AuthModule.userData,
      defaultUserData: state => state.AuthModule.defaultUserData
    }),

    isMobile() {
      return !!this.$device.isMobile
    },
    isChanged() {
      let result = []

      for (let key in this.form) {
        result.push(this.form[key] == this.defaultUserData[key])
      }

      return result.includes(false)
    }
  },
  methods: {
    getUserInfo() {
      if (this.userData && Object.keys(this.userData).length) {
        for (let key in this.form) {
          this.form[key] = this.userData[key]
        }
      }
    },
    setData() {
      this.$emit('newData', { data: this.form, isValid: this.isFormValid })
    }
  }
}
</script>
