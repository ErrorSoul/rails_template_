export const camelCase = str => (
  str.replace(/[_](\w|$)/g, (_,x) => x.toUpperCase())
)

export const snakeCase = str => (
  str.replace(/([A-Z]+)/g, (_,x) => '_' + x.toLowerCase()).replace(/^_/, '')
)

export const deepCamelCase = o => {
  if (!o || typeof o !== 'object') {
    return o
  }

  if (Array.isArray(o)) {
    return o.map(v => deepCamelCase(v))
  }

  const obj = {}
  Object.keys(o).forEach(k => obj[camelCase(k)] = deepCamelCase(o[k]))
  return obj
}

export const deepSnakeCase = o => {
  if (!o || typeof o !== 'object') {
    return o
  }

  if (Array.isArray(o)) {
    return o.map(v => deepSnakeCase(v))
  }

  const obj = {}
  Object.keys(o).forEach(k => obj[snakeCase(k)] = deepSnakeCase(o[k]))
  return obj
}
