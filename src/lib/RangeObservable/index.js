const Observable = require('../Observable')

class RangeObservable extends Observable {
    constructor(start, count) {
      super()
      this.start = start
      this._count = count
    }
    
    static create(start = 0, count = 0) {
      return new RangeObservable(start, count)
    }

    static dispatch(state) {
      const { start, index, count, subscriber } = state
      if (index >= count) {
        subscriber.complete()
        return
      }
      subscriber.next(start)
      if (subscriber.closed) {
        return
      }
      state.index = index + 1
      state.start = start + 1
    }

    _subscribe(subscriber) {
      let index = 0
      let start = this.start
      const count = this._count
      do {
        if (index++ >= count) {
          subscriber.complete()
          break
        }
        subscriber.next(start++)
        if (subscriber.closed) {
          break
        }
      } while (true)
    }
}

module.exports = RangeObservable
