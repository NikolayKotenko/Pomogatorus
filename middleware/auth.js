import Logging from '../services/logging'
import Request from '../services/request'

export default async function ({ app, res, query, store, route, redirect }) {
   // console.log('server?')
   // console.log(process.client)
   // if (process.client) {
   //   console.log('test')
   // console.log(app.$cookies.get('accessToken'))
   // if (route.query.userEmail) {
   //   await store.dispatch('loginUser', {'userEmail': route.query.userEmail});
   //   console.log('1')
   // } else {
   //   if (Request.getAccessTokenInCookies() && (route.query.agent)){
   //     const wtf = Request.get(store.state.BASE_URL+'/entity/articles', route.query)
   //   }
   //   if (!Request.getAccessTokenInCookies()) {
   //     const refreshResponse = await store.dispatch('refreshTokens')
   //
   //     if (Logging.checkExistErr(refreshResponse))
   //       console.log(refreshResponse.message)
   //     // return redirect('/login')
   //
   //   } else {
   //     const loginResponse = await Request.post(store.state.BASE_URL+'/auth/validate-auth')
   //     console.log(loginResponse)
   //   }
   // }
   //
   // store.commit('change_refactoring_content', false)
   // }
}
