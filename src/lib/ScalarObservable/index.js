const Observable = require('../Observable')

class ScalarObservable extends Observable {
  constructor (value) {
    super()
    this.value = value
    this._isScalar = true
  }

  static create (value) {
    return new ScalarObservable(value)
  }

  static dispatch (state) {
    const { done, value, subscriber } = state
    if (done) {
      subscriber.complete()
      return
    }
    subscriber.next(value)
    if (subscriber.closed) {
      return
    }
    state.done = true
  }

  _subscribe (subscriber) {
    const value = this.value
    subscriber.next(value)
    if (!subscriber.closed) {
      subscriber.complete()
    }
  }

}

module.exports = ScalarObservable
