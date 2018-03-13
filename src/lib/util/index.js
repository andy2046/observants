function isFunction (x) {
  return typeof x === 'function'
}

function isFunctionOrError (x) {
  if (x === undefined || x === null) {
    return false
  }

  if (!isFunction(x)) {
    throw new TypeError(`Expected ${x.name} to be a function.`)
  }

  return true
}

function noop () {
  // do nothing
}

const toString = Object.prototype.toString

function isArray (x) {
  return (Array.isArray && Array.isArray(x)) || (toString.call(x) === '[object Array]')
}

function isArrayLike (x) {
  return x && typeof x.length === 'number'
}

function isObject (x) {
  return x != null && typeof x === 'object'
}

function isPromise (value) {
  return value && typeof value.subscribe !== 'function' && typeof value.then === 'function'
}

function isNumeric (val) {
  return !isArray(val) && (val - parseFloat(val) + 1) >= 0
}

function isDate (value) {
  return value instanceof Date && !isNaN(+value)
}

function stringifyError (err) {
  return JSON.stringify(err, Object.getOwnPropertyNames(err))
}

module.exports = {
  isFunction,
  isFunctionOrError,
  noop,
  isArray,
  isArrayLike,
  isObject,
  isPromise,
  isNumeric,
  isDate,
  stringifyError
}
