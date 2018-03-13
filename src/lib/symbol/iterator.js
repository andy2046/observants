function symbolIteratorPonyfill() {
  if (typeof Symbol === 'function') {
    if (!Symbol.iterator) {
      Symbol.iterator = Symbol('iterator polyfill')
    }
    return Symbol.iterator
  } else {
    if (Set && typeof new Set()['@@iterator'] === 'function') {
      return '@@iterator'
    }
    if (Map) {
      let keys = Object.getOwnPropertyNames(Map.prototype)
      for (let i = 0; i < keys.length; ++i) {
        let key = keys[i]
        // according to spec, Map.prototype[@@iterator] and Map.orototype.entries must be equal.
        if (key !== 'entries' && key !== 'size' && Map.prototype[key] === Map.prototype['entries']) {
          return key
        }
      }
    }
    return '@@iterator'
  }
}

const iterator = symbolIteratorPonyfill()

module.exports = iterator
