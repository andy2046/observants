const Observable = require('../Observable')
const Symbol_iterator = require('../symbol/iterator')

class IteratorObservable extends Observable {
  constructor(iterator) {
    super()
    if (iterator == null) {
      throw new Error('iterator cannot be null.')
    }
    this.iterator = getIterator(iterator)
  }

  static create(iterator) {
    return new IteratorObservable(iterator)
  }

  static dispatch(state) {
    const { index, hasError, iterator, subscriber } = state
    if (hasError) {
      subscriber.error(state.error)
      return
    }
    let result = iterator.next()
    if (result.done) {
      subscriber.complete()
      return
    }
    subscriber.next(result.value)
    state.index = index + 1
    if (subscriber.closed) {
      if (typeof iterator.return === 'function') {
        iterator.return()
      }
      return
    }
  }

  _subscribe(subscriber) {
    let index = 0
    const { iterator } = this
    do {
      let result = iterator.next()
      if (result.done) {
        subscriber.complete()
        break
      }
      else {
        subscriber.next(result.value)
      }
      if (subscriber.closed) {
        if (typeof iterator.return === 'function') {
          iterator.return()
        }
        break
      }
    } while (true)
  }
}

class StringIterator {
  constructor(str, idx = 0, len = str.length) {
    this.str = str
    this.idx = idx
    this.len = len
  }

  [Symbol_iterator]() { return (this) }

  next() {
    return this.idx < this.len ? {
      done: false,
      value: this.str.charAt(this.idx++)
    } : {
      done: true,
      value: undefined
    }
  }
}

class ArrayIterator {
  constructor(arr, idx = 0, len = toLength(arr)) {
    this.arr = arr
    this.idx = idx
    this.len = len
  }

  [Symbol_iterator]() { return this }

  next() {
    return this.idx < this.len ? {
      done: false,
      value: this.arr[this.idx++]
    } : {
      done: true,
      value: undefined
    }
  }
}

function getIterator(obj) {
  const i = obj[Symbol_iterator]
  if (!i && typeof obj === 'string') {
    return new StringIterator(obj)
  }
  if (!i && obj.length !== undefined) {
    return new ArrayIterator(obj)
  }
  if (!i) {
    throw new TypeError('object is not iterable')
  }
  return obj[Symbol_iterator]()
}

const maxSafeInteger = Math.pow(2, 53) - 1

function toLength(o) {
  let len = +o.length
  if (isNaN(len)) {
    return 0
  }
  if (len === 0 || !numberIsFinite(len)) {
    return len
  }
  len = sign(len) * Math.floor(Math.abs(len))
  if (len <= 0) {
    return 0
  }
  if (len > maxSafeInteger) {
    return maxSafeInteger
  }
  return len
}

function numberIsFinite(value) {
  return typeof value === 'number' && isFinite(value)
}

function sign(value) {
  let valueAsNumber = +value
  if (valueAsNumber === 0) {
    return valueAsNumber
  }
  if (isNaN(valueAsNumber)) {
    return valueAsNumber
  }
  return valueAsNumber < 0 ? -1 : 1
}

module.exports = IteratorObservable
