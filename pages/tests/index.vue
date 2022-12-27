<template>
  <div>
    <pdf-content></pdf-content>
  </div>
</template>

<script>
import PdfContent from '@/components/PdfReports/PdfContent'

export default {
  name: "index",
  components:{
    PdfContent
  },
  head: {
    title: 'tests',
  },
};
</script>

<style scoped>

</style>
