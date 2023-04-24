<template>
  <VForm v-model="isFormValid">
    <!--  MOBILE  -->
    <template v-if="isMobile">
      <VTextField
        v-model="form.first_name"
        class="mb-4"
        dense
        hide-details
        label="Введите имя"
        solo
        @change="setData"
      />

      <VTextField
        v-model="form.middle_name"
        class="mb-4"
        dense
        hide-details
        label="Введите фамилию"
        solo
        @change="setData"
      />

      <VTextField
        v-model="form.last_name"
        class="mb-4"
        dense
        hide-details
        label="Введите отчество"
        solo
        @change="setData"
      />

      <VTextField
        v-model="form.email"
        :rules="emailRules"
        class="mb-4"
        dense
        hide-details
        label="Введите email"
        solo
        @change="setData"
      />

      <VTextField
        v-model="form.telephone"
        v-mask="'+7 (###) ###-##-##'"
        class="mb-4"
        dense
        hide-details
        label="Введите телефон"
        solo
        @change="setData"
      />
    </template>

    <!--  DESKTOP  -->
    <template v-else>
      <VRow>
        <VCol>
          <VTextField
            v-model="form.first_name"
            label="Введите имя"
            solo
            @change="setData"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="form.middle_name"
            label="Введите фамилию"
            solo
            @change="setData"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="form.last_name"
            label="Введите отчество"
            solo
            @change="setData"
          />
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <VTextField
            v-model="form.email"
            :rules="emailRules"
            label="Введите email"
            solo
            @change="setData"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="form.telephone"
            v-mask="'+7 (###) ###-##-##'"
            label="Введите телефон"
            solo
            @change="setData"
          />
        </VCol>
      </VRow>
    </template>

    <VRow>
      <VCol>
        <VCheckbox
          v-for="(type, index) in types"
          :key="index"
          v-model.number="form[type.key]"
          :false-value="0"
          :label="type.text"
          :true-value="1"
          dense
          hide-details
          @change="setData"
        />
      </VCol>
    </VRow>
  </VForm>
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
  watch: {
    'isChanged': {
      handler(v) {
        this.$emit('is-changed', v)
      }
    }
  },
  mounted() {
    this.getUserInfo()
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
      const result = []

      for (const key in this.form) {
        result.push(this.form[key] == this.defaultUserData[key])
      }

      return result.includes(false)
    }
  },
  methods: {
    getUserInfo() {
      if (this.userData && Object.keys(this.userData).length) {
        for (const key in this.form) {
          this.form[key] = this.userData[key]
        }
      }
    },
    setData() {
      this.$emit('new-data', { data: this.form, isValid: this.isFormValid })
    }
  }
}
</script>
