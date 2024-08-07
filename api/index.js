const express = require('express')
const app = express()
const axios = require('axios')
// const urlencodedParser = express.urlencoded({extended: false});  // создаем парсер для данных application/x-www-form-urlencoded
app.use(express.json())
const PORT = 3000

global.atob = require('atob')

cookieParser = require('cookie-parser')
app.use(cookieParser())

// app.get(
//   '/',
//   (req, res) => {
//     res.status(200).json([{name: "Robert"}, {name: "John"}])
//   }
// )

// LOGIN
app.post('/auth/login', function (request, response) {
  // console.log('request.body', request.body)

  if (!request.body)
    return response
      .status(400)
      .send({ message: 'Пустой request.body', codeResponse: 400 })

  axios
    .post(process.env.VUE_APP_API_ENDPOINT + '/auth/login', request.body)
    .then((res) => {
      // console.log(res.config);

      // Set refresh token
      const refreshCookieObj = parseCookies(res.headers['set-cookie'][0])
      const jwtRefreshTokenObj = parseJwt(refreshCookieObj.refreshToken)
      // console.log('refreshCookieObj', refreshCookieObj)
      // console.log('jwtObj - ', jwtRefreshTokenObj)
      response.cookie('refreshToken', refreshCookieObj?.refreshToken, {
        expires: new Date(timeConverter(jwtRefreshTokenObj?.exp)),
        httpOnly: true,
        // sameSite: 'None',
        // secure: true,
        // domain: 'pomogatorus.ru'
      })

      // Set access token
      const accessToken = res.data?.data?.access_token?.token
      const jwtAccessTokenObj = parseJwt(accessToken)
      response.cookie('accessToken', accessToken, {
        expires: new Date(timeConverter(jwtAccessTokenObj?.exp)),
      })
      // axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken // for all requests
      response.send(res?.data)
    })
    .catch((err) => {
      // response.sendStatus(400);
      response.send(err.response.data)
    })
})
// REFRESH
app.post('/auth/refresh', function (request, response) {
  // console.log('request.cookies', request.cookies?.refreshToken)
  // console.log('request.headers.cookie', request.headers.cookie)
  // console.log('REQUEST', request)

  // return response.send(request.cookies);
  if (!request.cookies?.refreshToken)
    return response
      .status(400)
      .send({ message: 'Пустая кука refreshToken', codeResponse: 400 })

  const config = {
    headers: { Cookie: request.headers.cookie },
    withCredentials: true,
  }
  axios
    .post(process.env.VUE_APP_API_ENDPOINT + '/auth/refresh', false, config)
    .then((res) => {
      // console.log('res.headers', res.headers)

      // Set refresh token
      const refreshCookieObj = parseCookies(res.headers['set-cookie'][0])
      const jwtRefreshTokenObj = parseJwt(refreshCookieObj.refreshToken)
      // console.log('refreshCookieObj', refreshCookieObj)
      // console.log('jwtObj - ', jwtRefreshTokenObj)
      response.cookie('refreshToken', refreshCookieObj?.refreshToken, {
        expires: new Date(timeConverter(jwtRefreshTokenObj?.exp)),
        httpOnly: true,
      })

      // Set access token
      const accessToken = res.data?.data?.access_token?.token
      const jwtAccessTokenObj = parseJwt(accessToken)
      response.cookie('accessToken', accessToken, {
        expires: new Date(timeConverter(jwtAccessTokenObj?.exp)),
      })
      response.send(res.data)
    })
    .catch((err) => {
      console.warn('err.response', err.response)
      // response.sendStatus(400);
      response.send(err.response.data)
    })
})
// GET DATA
app.post('/auth/validate-auth', function (request, response) {
  // console.log('auth/validate-auth request.cookies', request.cookies)

  if (!request.cookies?.refreshToken || !request.cookies?.accessToken)
    return response.status(400).send({
      message: 'Пустая кука refreshToken или accessToken',
      codeResponse: 400,
    })

  const config = {
    headers: {
      Cookie: request.headers.cookie,
      Authorization: `Bearer ${request.cookies?.accessToken}`,
    },
    withCredentials: true,
  }

  axios
    .post(
      process.env.VUE_APP_API_ENDPOINT + '/auth/validate-auth',
      false,
      config
    )
    .then((res) => {
      // console.log('res', res)
      response.send(res.data)
    })
    .catch((err) => {
      console.warn('err', err)
      console.warn('err.message', err.message)
      // response.sendStatus(400);
      response.send(err)
    })
})
// LOGOUT
app.post('/auth/logout', function (request, response) {
  // console.log('auth/logout request.cookies', request.cookies?.accessToken)

  const config = {
    headers: {
      Cookie: request.headers.cookie,
      Authorization: `Bearer ${request.cookies?.accessToken}`,
    },
    withCredentials: true,
  }

  axios
    .post(process.env.VUE_APP_API_ENDPOINT + '/auth/logout', false, config)
    .then((res) => {
      response.clearCookie('refreshToken')
      response.clearCookie('accessToken')
      response.send(res.data)
    })
    .catch((err) => {
      console.warn('auth/logout')
      console.warn('err', err)
      console.warn('err.message', err.message)
      // response.sendStatus(400);
      response.send(err)
    })
})

// Export express app
module.exports = {
  path: '/api',
  handler: app,
}

app.listen(PORT, () => console.log('Сервер запущен...'))

function parseCookies(cookieHeader) {
  const list = {}
  if (!cookieHeader) return list

  cookieHeader.split(';').forEach(function (cookie) {
    // eslint-disable-next-line prefer-const
    let [name, ...rest] = cookie.split('=')
    name = name?.trim()
    if (!name) return
    const value = rest.join('=').trim()
    if (!value) return
    list[name] = decodeURIComponent(value)
  })

  return list
}

function parseJwt(token) {
  if (!token) return null

  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  let jsonPayload
  try {
    jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
  } catch (err) {
    jsonPayload = Buffer.from(base64, 'base64')
      .toString()
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  }

  return JSON.parse(jsonPayload)
}

// eslint-disable-next-line camelcase
function timeConverter(UNIX_timestamp) {
  // eslint-disable-next-line camelcase
  const a = new Date(UNIX_timestamp * 1000)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const year = a.getFullYear()
  const month = months[a.getMonth()]
  const date = a.getDate()
  const hour = a.getHours()
  const min = a.getMinutes()
  const sec = a.getSeconds()
  const time =
    date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
  return time
}
