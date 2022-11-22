export default function getCookie(cookieName, stringCookie) {
  let strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie)[0]
  return unescape(strCookie ? strCookie.toString().replace(/^[^=]+./, '') : '')
}
