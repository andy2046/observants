const { isFunction } = require('../util')
const Subscription = require('../Subscription')
const Observer = require('../Observer')
const rxSubscriberSymbol = require('../symbol/subscriber')

// Subscriber = Subscription + Observer

class Subscriber extends Subscription {
  constructor (observerOrNext, error, complete) {
    super()
    this.isUnsubscribed = false
    const argLength = arguments.length

    if (argLength === 0) {
      this.observer = Observer.EMPTY
    } else if (argLength === 1) {
      if (!observerOrNext) {
        this.observer = Observer.EMPTY
        return
      }

      if (typeof observerOrNext === 'object') {
        if (observerOrNext instanceof Subscriber) {
          this.observer = observerOrNext
          this.observer.add(this)
        }
        else {
          if (observerOrNext === Observer.EMPTY) {
            this.observer = Observer.EMPTY
          } else {
            this.observer = new Observer(observerOrNext)
            if (isFunction(this.observer.unsubscribe)) {
              this.add(this.observer.unsubscribe)
            }
          }
        }
      }
    } else {
      this.observer = new Observer({next: observerOrNext, error, complete})
      if (isFunction(this.observer.unsubscribe)) {
        this.add(this.observer.unsubscribe)
      }
    }
  }

  [rxSubscriberSymbol]() { return this }

  next (value) {
    if (!this.isUnsubscribed) {
      try {
        this.observer.next(value)
      } catch (err) {
        this.unsubscribe()
        throw err
      }
    }
  }

  error (err) {
    if (!this.isUnsubscribed) {
      try {
        this.observer.error(err)
      } catch (err2) {
        throw err2
      } finally {
        this.unsubscribe()
      }
    }
  }

  complete () {
    if (!this.isUnsubscribed) {
      try {
        this.observer.complete()
      } catch (err) {
        throw err
      } finally {
        this.unsubscribe()
      }
    }
  }

  unsubscribe () {
    if (this.closed) {
      return
    }
    this.isUnsubscribed = true
    super.unsubscribe()
  }

  _unsubscribeAndRecycle() {
    this.unsubscribe()
    this.closed = false
    this.isUnsubscribed = false
    return this
  }

  static create (next, error, complete) {
    return new Subscriber(next, error, complete)
  }

}

module.exports = Subscriber
