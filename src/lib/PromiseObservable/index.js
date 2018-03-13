const Observable = require('../Observable')

class PromiseObservable extends Observable {
    constructor(promise) {
      super()
      this.promise = promise
    }
    
    static create(promise) {
      return new PromiseObservable(promise)
    }

    _subscribe(subscriber) {
      const promise = this.promise
      if (this._isScalar) {
        if (!subscriber.closed) {
          subscriber.next(this.value)
          subscriber.complete()
        }
      }
      else {
        promise.then(value => {
          this.value = value
          this._isScalar = true
          if (!subscriber.closed) {
            subscriber.next(value)
            subscriber.complete()
          }
        }).catch(err => {
          try {
            if (!subscriber.closed) {
              subscriber.error(err)
            }
          } catch (err2) {
            setTimeout(() => { throw err2 })
          }
        })
    }
  }
}

module.exports = PromiseObservable
