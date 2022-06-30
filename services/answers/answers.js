import createStore from "../../store";
import Request from "../request";
import axios from "axios";

const _store = createStore()

export default class Answers {
  static async send(params) {
    return await Request.post(`${_store.state.BASE_URL}/entity/answers`, params)
  }

  static async sendFile(params) {

    const {id_answer, uuid, file} = params

    let formData = new FormData()
    formData.append('id_answer', id_answer)
    formData.append('uuid', Answers.create_UUID())
    formData.append('file', file)
    return axios({
      method: 'post',
      url: `${_store.state.BASE_URL}/entity/files`,
      data: formData,
      headers: {
        Authorization: '666777'
      }
    });
    // return await Request.post(`${_store.state.BASE_URL}/entity/files`, params)
  }

  static create_UUID(){
    let dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
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
