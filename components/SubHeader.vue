<template>
  <div class="subheader">
    <v-breadcrumbs :items="$store.state.breadcrumbs" divider="•">
      <template #item="{ item }">
        <v-breadcrumbs-item
          :disabled="item.disabled"
          :href="item.to"
          class="item_style"
        >
          {{ item.text }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script>
export default {
  name: 'SubHeader',
  props: {
    additionalBreadcrumb: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {
    this.setSubHeaders()
  },
  methods: {
    setSubHeaders() {
      const menuItem = this.$store.getters.menuItems.find((elem) => {
        if (elem.path !== '/') {
          return this.$route.path.match(elem.path)
        }
      })

      const extraBreadCrumb = []

      if (this.additionalBreadcrumb.length) {
        this.additionalBreadcrumb.forEach((elem) => {
          extraBreadCrumb.push(new ConstructBreadcrumbs(elem))
        })
      }

      const mainPath = new ConstructBreadcrumbs(menuItem?.title, menuItem?.path)
      const secondPath = () => {
        if (Object.keys(this.$route.params).length)
          return new ConstructBreadcrumbs(this.$route.meta.title)
        else
          return null
      }

      let result = [...[mainPath]]

      if (secondPath()) {
        result = [...result, [secondPath()], ...extraBreadCrumb]
      } else {
        result = [...result, ...extraBreadCrumb]
      }

      this.$store.commit(
        'change_breadcrumbs',
        result.filter((el) => {
          return el != null
        })
      )
    }
  }
}

class ConstructBreadcrumbs {
  constructor(
    text,
    to = '',
    disabled = false,
    exact = true,
    link = true,
    nuxt = true,
    replace = true
  ) {
    this.disabled = disabled
    this.exact = exact
    this.link = link
    this.text = text
    this.to = to
    this.nuxt = nuxt
    this.replace = replace
  }
}

</script>

<style lang='scss'>
.subheader {
  max-width: 850px;
  margin: 0 auto;
  width: 100%;

  .v-breadcrumbs {
    padding: 40px 0;

    .item_style {
      font-size: 0.88em;
      color: #7D7D7D !important;
      text-transform: lowercase;

      a {
        color: #7D7D7D !important;
      }
    }
  }
}
</style>


