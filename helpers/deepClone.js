export default function _clone(obj, directive) {
  let clone = {}
  for (let i in obj) {
    if (typeof obj[i] == 'object' && obj[i] != null) clone[i] = _clone(obj[i])
    else {
      if (directive === 'replace') {
        clone[i] = obj[i] === null ? '' : obj[i]
      } else {
        clone[i] = obj[i]
      }
    }
  }
  return clone
}
