const Observable = require('../Observable')
const { isNumeric, isDate } = require('../util')

class TimerObservable extends Observable {
    constructor(dueTime = 0, period) {
      super()
      this.period = -1
      this.dueTime = 0
      if (isNumeric(period)) {
        this.period = Number(period) < 1 && 1 || Number(period)
      }
      this.dueTime = isDate(dueTime) ? (+dueTime - Date.now()) : dueTime
    }
   
    static create(initialDelay = 0, period) {
      return new TimerObservable(initialDelay, period)
    }

    static dispatch(state) {
      const { index, period, subscriber } = state
      const action = this
      subscriber.next(index)
      if (subscriber.closed) {
        return
      }
      else if (period === -1) {
        return subscriber.complete()
      }
      state.index = index + 1
    }

    _subscribe(subscriber) {
      let index = 0
      const { period, dueTime } = this
      let intervalId

      setTimeout(() => {
        subscriber.next(index++)

        if (subscriber.closed) {
          return
        }
        else if (period === -1) {
          return subscriber.complete()
        }

        intervalId = setInterval(() => {
          subscriber.next(index++)
        }, period)

        subscriber.add(() => {
          clearInterval(intervalId)
        })

      }, dueTime)
    }
}

module.exports = TimerObservable
