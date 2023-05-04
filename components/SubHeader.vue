<template>
  <div class="subheader custom_grid_system">
    <v-breadcrumbs :items="$store.state.breadcrumbs">
      <template #item="{ item }">
        <v-breadcrumbs-item
          :href="item.to"
          :disabled="item.disabled"
        >
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
      <template #divider>
        <v-icon>mdi-chevron-right</v-icon>
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
  max-width: 1160px;
  margin: 0 auto;
  width: 100%;
  .v-breadcrumbs{
    padding-left: 12px;
  }
}
</style>


