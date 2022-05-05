import Vue from 'vue'

import LoginAuth from "../components/frontLayouts/LoginAuth";
import Logging from "../services/logging";

export default async function ({ store, route, redirect }) {
  if (route.query.userEmail)
    await store.dispatch('loginUser', {'userEmail': route.query.userEmail})

  console.log(Vue.$cookies)

  if (process.env.NODE_ENV === 'production') {
    if (Vue.$cookies.get('accessToken') === null) {
      const refreshResponse = await store.dispatch('refreshTokens')
      // console.log(Vue.$cookies.get('refreshToken'))
      if (Logging.checkExistErr(refreshResponse))
        return redirect('/login')
    }
  }
}
