const { isFunction } = require('../util')
const toSubscriber = require('../util/toSubscriber')
const { pipeFromArray } = require('../util/pipe')
const Symbol_observable = require('../symbol/observable')

class Observable {
  constructor (subscribe) {
    if (!(this instanceof Observable)) {
      throw new TypeError('Observable can NOT be called as function')
    }
    
    this._isScalar = false

    if (isFunction(subscribe)) {
      this._subscribe = subscribe
    }
  }

  lift (operator) {
    const observable = new Observable()
    observable.source = this
    observable.operator = operator
    return observable
  }

  subscribe (observerOrNext, error, complete) {
    const { operator } = this
    const sink = toSubscriber(observerOrNext, error, complete)
    if (operator) {
      operator.call(sink, this.source)
    } else {
      sink.add(this.source || this._trySubscribe(sink))
    }
    return sink
  }

  _trySubscribe (sink) {
    try {
      return this._subscribe(sink)
    }
    catch (err) {
      sink.error(err)
    }
  }

  _subscribe (subscriber) {
    return this.source.subscribe(subscriber)
  }

  [Symbol_observable]() {
    return this
  }

  forEach(next, PromiseCtor) {
    if (!PromiseCtor) {
      if (Promise) {
        PromiseCtor = Promise
      }
    }
    if (!PromiseCtor) {
      throw new Error('no Promise impl found')
    }
    return new PromiseCtor((resolve, reject) => {
      let subscription
      subscription = this.subscribe((value) => {
        if (subscription) {
          try {
            next(value)
          }
          catch (err) {
            reject(err)
            subscription.unsubscribe()
          }
        } else {
          next(value)
        }
      }, reject, resolve)
    })
  }

  pipe (...operations) {
    if (operations.length === 0) {
      return this
    }
    return pipeFromArray(operations)(this)
  }

  toPromise(PromiseCtor) {
    if (!PromiseCtor) {
      if (Promise) {
        PromiseCtor = Promise
      }
    }
    if (!PromiseCtor) {
      throw new Error('no Promise impl found')
    }
    return new PromiseCtor((resolve, reject) => {
      let value
      this.subscribe((x) => value = x, (err) => reject(err), () => resolve(value))
    })
  }

}

Object.defineProperty(Observable, 'create', {
  value: function (subscribe) {
    return new Observable(subscribe)
  },
  writable: false,
  enumerable: true,
  configurable: false
})

module.exports = Observable
