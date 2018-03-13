const Observable = require('../Observable')
const EmptyObservable = require('../EmptyObservable')
const ScalarObservable = require('../ScalarObservable')

class ArrayLikeObservable extends Observable {
  constructor(arrayLike) {
    super()
    this.arrayLike = arrayLike
    if (arrayLike.length === 1) {
      this._isScalar = true
      this.value = arrayLike[0]
    }
  }

  static create(arrayLike) {
    const length = arrayLike.length
    if (length === 0) {
      return new EmptyObservable()
    }
    else if (length === 1) {
      return new ScalarObservable(arrayLike[0])
    }
    else {
      return new ArrayLikeObservable(arrayLike)
    }
  }

  static dispatch(state) {
    const { arrayLike, index, length, subscriber } = state
    if (subscriber.closed) {
      return
    }
    if (index >= length) {
      subscriber.complete()
      return
    }
    subscriber.next(arrayLike[index])
    state.index = index + 1
  }

  _subscribe(subscriber) {
    let index = 0
    const { arrayLike } = this
    const length = arrayLike.length
    for (let i = 0; i < length && !subscriber.closed; i++) {
      subscriber.next(arrayLike[i])
    }
    subscriber.complete()
  }
}

module.exports = ArrayLikeObservable
