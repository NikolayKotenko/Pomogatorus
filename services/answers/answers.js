import axios from "axios";
import createStore from "../../store";
const _store = createStore()

import Request from "../request";

export default class Answers {
  static async send(params) {

    const result = await Request.post(`${_store.state.BASE_URL}/entity/answers`, params)

    console.log(result)

    // const {id_type_answer, id_question, id_user, id_agent_utm, id_article, value_answer, detailed_response, attachment_files} = params
    //
    // let bodyFormData = new FormData()
    // bodyFormData.append('id_type_answer', id_type_answer)
    // bodyFormData.append('id_question', id_question)
    // bodyFormData.append('id_user', id_user)
    // bodyFormData.append('id_agent_utm', id_agent_utm)
    // bodyFormData.append('id_article', id_article)
    // bodyFormData.append('value_answer', value_answer)
    // bodyFormData.append('detailed_response', detailed_response)
    // bodyFormData.append('attachment_files', attachment_files)
    //
    // await axios.post(`${_store.state.BASE_URL}/entity/answers`, bodyFormData, {
    //   headers: {
    //     Authorization: '666777'
    //   },
    // })
    //   .then((response) => {
    //     console.log(response)
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
  }

  create_status(type, auth_block) {
    let status
    if (type === 'sending') {
      status = new Status_sending(type)
    } else if (type === 'warning') {
      status = new Status_warning(type, auth_block)
    } else if (type === 'error') {
      status = new Status_error(type)
    } else if (type === 'success') {
      status = new Status_success(type)
    }
    return status
  }
}

class Status_sending {
  constructor(type) {
    this.color = 'primary'
    this.type = type
    this.icon = 'v-progress-circular'
    this.text = `Отправляем ответ`
  }
}

class Status_warning {
  constructor(type, auth_block) {
    this.color = 'yellow darken-1'
    this.type = type
    this.icon = 'mdi-alert-circle-outline'
    this.anchor = `component_wrapper-${auth_block}`
    this.text = `Необходимо <a href="#component_wrapper-${auth_block}" id="authAnchor"><strong>авторизоваться</strong></a> для сохранения вашего ответа`
  }
}

class Status_error {
  constructor(type) {
    this.color = 'red darken-1'
    this.type = type
    this.icon = 'mdi-close-octagon-outline'
    this.text = `Произошла ошибка`
  }
}

class Status_success {
  constructor(type) {
    this.color = 'green darken-1'
    this.type = type
    this.icon = 'mdi-check-circle-outline'
    this.text = `Ответ записан, спасибо!`
  }
}
