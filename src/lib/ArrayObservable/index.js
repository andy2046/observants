const Observable = require('../Observable')
const EmptyObservable = require('../EmptyObservable')
const ScalarObservable = require('../ScalarObservable')

class ArrayObservable extends Observable {
  constructor(array) {
    super()
    this.array = array

    if (array.length === 1) {
      this._isScalar = true
      this.value = array[0]
    }
  }

  static create(array) {
    return new ArrayObservable(array)
  }

  static of(...array) {
    const len = array.length
    if (len > 1) {
      return new ArrayObservable(array)
    }
    else if (len === 1) {
      return new ScalarObservable(array[0])
    }
    else {
      return new EmptyObservable()
    }
  }

  static dispatch (state) {
    const { array, index, count, subscriber } = state
    if (index >= count) {
      subscriber.complete()
      return
    }
    subscriber.next(array[index])
    if (subscriber.closed) {
      return
    }
    state.index = index + 1
  }

  _subscribe (subscriber) {
    let index = 0
    const array = this.array
    const count = array.length
    for (let i = 0; i < count && !subscriber.closed; i++) {
      subscriber.next(array[i])
    }
    subscriber.complete()  
  }

}

module.exports = ArrayObservable
