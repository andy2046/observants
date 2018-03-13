const Observable = require('../Observable')
const { isNumeric } = require('../util')

class IntervalObservable extends Observable {
  constructor(period = 0) {
    super()
    this.period = period
    if (!isNumeric(period) || period < 0) {
      this.period = 0
    }
  }

  static create(period = 0) {
    return new IntervalObservable(period)
  }

  static dispatch(state) {
    const { index, subscriber, period } = state
    subscriber.next(index)
    if (subscriber.closed) {
      return
    }
    state.index += 1
  }

  _subscribe(subscriber) {
    let index = 0
    const period = this.period
    const intervalId = setInterval(() => {
      subscriber.next(index++)
    }, period)
    subscriber.add(() => {
      clearInterval(intervalId)
    })
  }
}

module.exports = IntervalObservable
