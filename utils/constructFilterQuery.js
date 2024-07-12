export default function constructFilterQuery(arrNameParam = [], innerArr) {
  let result = ''

  if (Array.isArray(arrNameParam)) {
    arrNameParam.forEach((param) => {
      for (const [key, value] of Object.entries(param)) {
        result +=
          'filter[' + key + ']' + (innerArr ? '[]' : '') + '=' + value + '&'
      }
    })

    return '?' + result.slice(0, -1)
  }

  for (const [key, value] of Object.entries(arrNameParam)) {
    result += 'filter[' + key + ']' + (innerArr ? '[]' : '') + '=' + value + '&'
  }
  result = result.slice(0, -1)

  return '?' + result
}
