<template>
  <div class="subheader">
    <v-breadcrumbs :items="$store.state.breadcrumbs" divider="•">
      <template #item="{ item }">
        <v-breadcrumbs-item
          :href="item.to"
          :disabled="item.disabled"
          class="item_style"
        >
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
export default  {
  name: 'SubHeader',
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {
    this.setSubHeaders();
  },
  methods: {
    setSubHeaders(){
      const menuItem = this.$store.getters.menuItems.find((elem) =>  {
        if (elem.path !== '/') {
          return this.$route.path.match(elem.path)
        }
      });

      const mainPath = new ConstructBreadcrumbs(menuItem?.title, menuItem?.path);
      const secondPath = () => {
        if (Object.keys(this.$route.params).length)
          return new ConstructBreadcrumbs(this.$route.meta.title)
        else
          return null;
      };
      this.$store.commit(
        'change_breadcrumbs',
        [mainPath, secondPath()].filter((el) => { return el != null }),
      );
    }
  },
}

class ConstructBreadcrumbs
{
  constructor(
    text,
    to = '',
    disabled = false,
    exact = true,
    link = true,
    nuxt = true,
    replace = true,
  )
  {
    this.disabled = disabled
    this.exact = exact
    this.link= link
    this.text = text
    this.to = to
    this.nuxt = nuxt
    this.replace = replace
  }
}

</script>

<style scoped lang="scss">
.subheader {
  max-width: 850px;
  margin: 0 auto;
  width: 100%;
  .v-breadcrumbs{
    padding: 40px 0;
    .item_style {
      font-size: 0.88em;
      color: #7D7D7D !important;
      text-transform: lowercase;

    }
  }
}
</style>


