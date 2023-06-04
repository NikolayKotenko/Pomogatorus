<template>
  <VForm v-model="isFormValid">
    <!--  MOBILE  -->
    <template v-if="isMobile">
      <InputStyled
        :class="'styleTextField'"
        :data="form.first_name"
        :is-outlined="true"
        :placeholder="'Имя'"
        @update-input="setData"
      />

      <VTextField
        v-model="form.middle_name"
        class="mb-4"
        color="#95D7AE"
        dense
        hide-details
        label="Фамилия"
        outlined

        @change="setData"
      />

      <VTextField
        v-model="form.last_name"
        class="mb-4"
        color="#95D7AE"
        dense
        hide-details
        label="Отчество"
        outlined

        @change="setData"
      />

      <VTextField
        v-model="form.email"
        :rules="emailRules"
        class="mb-4"
        color="#95D7AE"
        dense
        hide-details
        label="Email"
        outlined
        @change="setData"
      />

      <VTextField
        v-model="form.telephone"
        v-mask="'+7 (###) ###-##-##'"
        class="mb-4"
        color="#95D7AE"
        dense
        hide-details
        label="Телефон"
        outlined
        @change="setData"
      />
    </template>

    <!--  DESKTOP  -->
    <template v-else>
      <VRow>
        <VCol>
          <InputStyled
            :class="'styleTextField'"
            :data="form.first_name"
            :is-outlined="true"
            :placeholder="'Имя'"
            @update-input="setData"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="form.middle_name"
            color="#95D7AE"
            dense
            label="Фамилия"
            outlined
            @change="setData"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="form.last_name"
            color="#95D7AE"
            dense
            label="Отчество"
            outlined
            @change="setData"
          />
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <VTextField
            v-model="form.email"
            :rules="emailRules"
            color="#95D7AE"
            dense
            label="Email"
            outlined
            @change="setData"
          />
        </VCol>
        <VCol>
          <VTextField
            v-model="form.telephone"
            v-mask="mask"
            color="#95D7AE"
            dense
            label="Телефон"
            outlined
            @change="setData"
          />
        </VCol>
      </VRow>
    </template>

    <div class="roles_wrapper">
      <span class="roles_wrapper_title">Кто вы?</span>
      <VCheckbox
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
  </VForm>
</template>

<script>
import { mapState } from "vuex";
import InputStyled from "../Common/InputStyled.vue";

export default {
  name: "UserFields",
  components: { InputStyled },
  data: () => ({
    isFormValid: false,
    form: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      telephone: "",
      home_owner: "",
      installation_engineering_systems: "",
      selling_engineering_equipment: "",
      marketing_and_sales: ""
    },
    mask: "+7 (###) ###-##-##",
    types: [
      {
        text: "Собственник дома",
        key: "home_owner",
        icon: "mdi-home-account"
      },
      {
        text: "Профессионально занимаюсь монтажом инженерных систем",
        key: "installation_engineering_systems",
        icon: "mdi-account-hard-hat"
      },
      {
        text: "Занимаюсь продажей инженерного оборудования",
        key: "selling_engineering_equipment",
        icon: "mdi-cog-transfer"
      },
      {
        text: "Маркетинг и продажи",
        key: "marketing_and_sales",
        icon: "mdi-cog-transfer"
      }
    ],
    emailRules: [
      v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Введите корректный email"
    ],
    telephoneRules: [
      v => !v || this.form || "Введите корректный email"
    ]
  }),
  watch: {
    "isChanged": {
      handler(v) {
        this.$emit("is-changed", v);
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
        result.push(this.form[key] == this.defaultUserData[key]);
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
    setData() {
      this.$emit("new-data", { data: this.form, isValid: this.isFormValid });
    }
  }
};
</script>

<style lang="scss" scoped>
.roles_wrapper {

  .roles_wrapper_title {
    font-size: 2em;
    margin-bottom: 1em;
  }
}
</style>
<style lang="scss">
.roles_style {
  border-radius: 5px;
  padding: 10px;
  transition: all 0.4s ease-in-out;
  font-size: 1.2em;

  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  }
}
</style>

