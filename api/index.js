  const express = require("express");
  const app = express();
  const axios = require('axios');
  const urlencodedParser = express.urlencoded({extended: false});  // создаем парсер для данных application/x-www-form-urlencoded
  // cookieParser = require('cookie-parser')
  // app.use(cookieParser())

  // app.get(
  //   '/',
  //   (req, res) => {
  //     res.status(200).json([{name: "Robert"}, {name: "John"}])
  //   }
  // )

  app.post('/auth/login', urlencodedParser, function(request, response) {

    if(!request.body) return response.sendStatus(400);

    axios.post('https://api.agregatorus.com/auth/login', request.body)
      .then((res) => {
        // console.log(res.config);

        // Set refresh token
        const refreshCookieObj = parseCookies(res.headers["set-cookie"][0]);
        const jwtRefreshTokenObj = parseJwt(refreshCookieObj['refreshToken']);
        // console.log('refreshCookieObj', refreshCookieObj)
        // console.log('jwtObj - ', jwtRefreshTokenObj)
        response.cookie(
          'refreshToken', refreshCookieObj?.refreshToken,
          {expires: new Date(timeConverter(jwtRefreshTokenObj?.exp)), httpOnly: true}
        );

        // Set access token
        const accessToken = res.data?.data?.access_token?.token;
        const jwtAccessTokenObj = parseJwt(accessToken)
        response.cookie(
          'accessToken',
          accessToken,
          { expires: new Date(timeConverter(jwtAccessTokenObj?.exp)) }
        )
        response.send(res.data);
      })
      .catch((err) => {
        console.error(err.message);
        response.sendStatus(400);
        response.send(err.message); // TODO было бы заебись подключить класс services/logging.js сюда
    });
  });

  // Export express app
  module.exports = {
    path: '/api',
    handler: app
  }

  app.listen(3000, ()=>console.log("Сервер запущен..."));


  function parseCookies (cookieHeader) {
    const list = {};
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
      let [ name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
    });

    return list;
  }

  function parseJwt (token) {
    if (!token) return null;

    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }
