<template>
   <div class="object-wrapper">
     <div class="object-wrapper-top">
       <div class="object-wrapper-top__selector">
         <SelectObject

         />
       </div>

       <div class="object-wrapper-top__map">

       </div>
     </div>

     <div class="object-wrapper-documents">
       <div class="object-wrapper-documents__img">

       </div>

       <div class="object-wrapper-documents__docs">

       </div>
     </div>

     <div class="object-wrapper-tabs">
        <TabsCustom
          :tab-content="[]"
          :tabs="[]"
          :data-object="objectData"
        />
     </div>

     <div class="object-wrapper-footer">
       <div class="object-wrapper-footer__left">
         <v-btn>
           Сохранить изменения
         </v-btn>

         <v-btn>
           <span>
             Скачать PDF
           </span>
           <v-icon>mdi-download</v-icon>
         </v-btn>
       </div>

       <v-btn>
         Отмена
       </v-btn>
     </div>
   </div>
</template>

<script>
import TabsCustom from "../Common/TabsCustom";
import ObjectSelector from "../Common/SelectObject";
import SelectObject from "../Common/SelectObject";
export default {
  name: "ObjectGlobal",
  components: {SelectObject, ObjectSelector, TabsCustom},
  props: {
    objectData: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
