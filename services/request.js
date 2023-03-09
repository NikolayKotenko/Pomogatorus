import Logging from '@/services/logging'
// import Vue from "vue";
// import auth from "@/middleware/redirectArticles.js"
// import cookies from 'cookie-universal-nuxt'

/**
 * TODO я честно пытался подключить сюда store но не получилось
 * https://stackoverflow.com/questions/47571543/access-store-outside-of-component-vuejs
 */
export default class Request {
  static async request(url, params, method, formData) {
    let options = {}

    if (formData) {
      options = {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Authorization: 'Bearer ' + this.getAccessTokenInCookies(),
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    } else {
      options = {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
          Authorization: 'Bearer ' + this.getAccessTokenInCookies(),
          'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      }
    }

    if ('GET' === method) {
      if (params !== null) {
        url += '?' + new URLSearchParams(params).toString()
      }
    } else if ('PUT' === method) {
      if (params !== null) {
        url += '?' + new URLSearchParams(params).toString()
      }
    } else {
      if (formData) {
        // console.log(Request.bodyFormData(params))
        options.body = Request.bodyFormData(params) // for formData e.g Files to server
      } else {
        options.body = JSON.stringify(params) // body data type must match "Content-Type" header
      }
    }

    // console.log('options.body');
    // console.log(options.body);

    return await fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        return new Logging(response)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  static async get(url, params = null) {
    return this.request(url, params, 'GET', '')
  }

  static async post(url, params, formData) {
    return this.request(url, params, 'POST', formData)
  }

  static async put(url, params = null) {
    return this.request(url, params, 'PUT', '')
  }

  static async delete(url, params) {
    return this.request(url, params, 'DELETE')
  }

  static bodyFormData(paramBody) {
    let bodyFormData = new FormData()

    for (const [key, value] of Object.entries(paramBody)) {
      // console.log(`${key}: ${value}`)
      bodyFormData.append(key, value)
    }
    return bodyFormData
  }

  static parseCookies = () => {
    const list = {}

    if (process.client) {
      if (!document.cookie) return list

      document.cookie.split(`;`).forEach(function (cookie) {
        let [name, ...rest] = cookie.split(`=`)
        name = name?.trim()
        if (!name) return
        const value = rest.join(`=`).trim()
        if (!value) return
        list[name] = decodeURIComponent(value)
      })
    }

    return list
  }
  static getAccessTokenInCookies = () => {
    // if (process.env.NODE_ENV === 'development') return '666777'

    // console.log('this.parseCookies()', this.parseCookies())
    const checkExist = this.parseCookies()
    return checkExist.hasOwnProperty('accessToken') ? checkExist.accessToken : null
  }

  static ConstructFilterQuery(arrNameParam = []) {
    let result = ''
    for (let [key, value] of Object.entries(arrNameParam)) {
      result += 'filter[' + key + ']=' + value + '&'
    }
    result = result.slice(0, -1)

    // console.log("res", result);
    return '?' + result
  }
}
