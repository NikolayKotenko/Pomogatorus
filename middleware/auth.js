import LoginAuth from "../components/frontLayouts/LoginAuth";
import Logging from "../services/logging";

export default async function ({ app, res, query, store, route, redirect }) {
  if (route.query.userEmail)
    await store.dispatch('loginUser', {'userEmail': route.query.userEmail})

  if (process.env.NODE_ENV === 'production') {
    console.log(app.$cookiz.get('accessToken'))
    if (app.$cookiz.get('accessToken') === null) {
      const refreshResponse = await store.dispatch('refreshTokens')

      if (Logging.checkExistErr(refreshResponse))
        return redirect('/login')
    }
  }
}
