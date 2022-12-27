<template>
  <section v-if="obj_by_tag" class="table">

    <section class="table__thead">
      <section class="table__thead__tr__td">№</section>
      <section class="table__thead__tr__td">Вопрос</section>
      <section class="table__thead__tr__td">Ответ</section>
    </section>

    <section class="table__tbody" v-for="(objQuestion, nameQuestion) in obj_by_tag">
      <section class="table__tbody__tr__td first_child">{{ inc(nameQuestion) }}</section>
      <section class="table__tbody__tr__td">{{ objQuestion.e_questions__name }}</section>
      <section class="table__tbody__tr__td">
        <p>{{ objQuestion.answers__value_answer }}</p>
        <p v-if="objQuestion.answers__detailed_response"
        class="detailed_response">
          {{ objQuestion.answers__detailed_response }}
        </p>
      </section>
    </section>

  </section>
</template>

<script>
export default {
  name: "TableByTag",
  data() {
    return {
      number: 1
    };
  },
  props: ['obj_by_tag'],
  methods:{
    inc(name){
      let resN = 0;
      Object.keys(this.obj_by_tag).forEach((elem, key) => {
        if (elem === name)
          resN = key + 1
      })
      return resN
    }
  }
}
</script>

<style>
.table {
  border-collapse: collapse;
  border-style: hidden;
  width: 100%;
}
.table__thead, .table__tbody{
  display: grid;
  grid-template-columns: 10% 1fr 1fr;
}
.table__thead__tr__td {
text-align: center;
  border-top: unset!important;
}
.table__thead__tr__td:first-child, .table__tbody__tr__td:first-child{
  border-left: unset;
}
.table__thead__tr__td:last-child, .table__tbody__tr__td:last-child{
  border-right: unset;
}

.first_child{
  text-align: center;
}
.table__thead__tr__td, .table__tbody__tr__td {
  border: 1px solid black;
  padding: 8px;
}
.detailed_response{
  font-size: 10px;
}
</style>
