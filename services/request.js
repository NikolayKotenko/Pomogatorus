import Logging from "@/services/logging";
// import Vue from "vue";
// import auth from "@/middleware/redirectArticles.js"
// import cookies from 'cookie-universal-nuxt'

/**
 * TODO я честно пытался подключить сюда store но не получилось
 * https://stackoverflow.com/questions/47571543/access-store-outside-of-component-vuejs
 */
export default class Request {

    static async request(url, params, method ) {
        let options = {
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

        if ( 'GET' === method ) {
            if (params !== null) {
                url += '?' + (new URLSearchParams(params)).toString();
            }
        }
        else {
            options.body = JSON.stringify(params) // body data type must match "Content-Type" header
        }

        // console.log('options.body');
        // console.log(options.body);

        return await fetch(url, options)
            .then(response => response.json())
            .then(response => {
                return new Logging(response)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
    static async get ( url, params = null ) {
        return this.request( url, params, 'GET' )
    }
    static async post ( url, params ) {
        return this.request( url, params, 'POST' );
    }

    static bodyFromData(paramBody) {
        let bodyFormData = new FormData()

        for (const [key, value] of Object.entries(paramBody)) {
            console.log(`${key}: ${value}`);
            bodyFormData.append(key, value)
        }
        return bodyFormData;
    }

    static parseCookies = () => {
      const list = {};
      if (!document.cookie) return list;

      document.cookie.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
      });

    return list;
  }
  static getAccessTokenInCookies = (() => {
      // console.log('this.parseCookies()', this.parseCookies())
      const checkExist = this.parseCookies();
      return (checkExist.hasOwnProperty('accessToken')) ? checkExist?.accessToken : null
  })
}
