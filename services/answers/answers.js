import axios from "axios";
import createStore from "../../store";

export default class answers {
  static async send(params) {
    const {id_type_answer, id_question, detailed_response, attachment_files} = params

    let bodyFormData = new FormData()
    bodyFormData.append('id_type_answer', id_type_answer)
    bodyFormData.append('id_question', id_question)
    bodyFormData.append('detailed_response', detailed_response)
    bodyFormData.append('attachment_files', attachment_files)

    await axios.post(`${createStore().state.BASE_URL}/entity/answers`, bodyFormData, {
      headers: {
        Authorization: '666777'
      },
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
