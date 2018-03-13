const Symbol_iterator = require('../symbol/iterator')
const Symbol_observable = require('../symbol/observable')

const { isArray, isArrayLike, isPromise } = require('../util')

const Observable = require('../Observable')
const PromiseObservable = require('../PromiseObservable')
const IteratorObservable = require('../IteratorObservable')
const ArrayObservable = require('../ArrayObservable')
const ArrayLikeObservable = require('../ArrayLikeObservable')

class FromObservable extends Observable {
  constructor(ish) {
    super(null)
    this.ish = ish
  }

  static create(ish) {
    if (ish != null) {
      if (typeof ish[Symbol_observable] === 'function') {
        if (ish instanceof Observable) {
          return ish
        }
        return new FromObservable(ish)
      }
      else if (isArray(ish)) {
        return new ArrayObservable(ish)
      }
      else if (isPromise(ish)) {
        return new PromiseObservable(ish)
      }
      else if (typeof ish[Symbol_iterator] === 'function' || typeof ish === 'string') {
        return new IteratorObservable(ish)
      }
      else if (isArrayLike(ish)) {
        return new ArrayLikeObservable(ish)
      }
    }
    throw new TypeError((ish !== null && typeof ish || ish) + ' is not observable')
  }

  _subscribe(subscriber) {
    const ish = this.ish
    return ish[Symbol_observable]().subscribe(subscriber)
  }
}

module.exports = FromObservable
