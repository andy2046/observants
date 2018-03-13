const { isFunction, isArray, isObject, stringifyError } = require('../util')

class Subscription {
  constructor (unsubscribe) {
    this._subscriptions = null
    this.closed = false
    if (isFunction(unsubscribe)) {
      this._unsubscribe = unsubscribe
    }
    this.unsubscribe = this.unsubscribe.bind(this)
  }

  add (teardown) {
    if (!teardown || (teardown === Subscription.EMPTY)) {
      return Subscription.EMPTY
    }

    if (teardown === this) {
      return this
    }

    let subscription = teardown
    const teardownType = typeof teardown

    if ((teardownType === 'object') || (teardownType === 'function')) {
      if (teardownType === 'function') {
        subscription = new Subscription(teardown)
      }

      if (subscription.closed || (typeof subscription.unsubscribe !== 'function')) {
        return subscription
      }
      else if (this.closed) {
        subscription.unsubscribe()
        return subscription
      }
    } else {
      throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.')
    }

    const subscriptions = this._subscriptions || (this._subscriptions = [])
    subscriptions.push(subscription)
    return subscription
  }

  remove (subscription) {
    const subscriptions = this._subscriptions
    if (subscriptions) {
      const subscriptionIndex = subscriptions.indexOf(subscription)
      if (~subscriptionIndex) {
        subscriptions.splice(subscriptionIndex, 1)
      }
    }
  }

  unsubscribe () {
    if (this.closed) {
      return
    }
    let hasErrors = false
    let errors
    let { _unsubscribe, _subscriptions } = this
    this.closed = true
    
    this._subscriptions = null
    let index
    let len
    
    if (isFunction(_unsubscribe)) {
      try {
        this._unsubscribe()
      } catch (err) {
        hasErrors = true
        errors = errors || []
        errors.push(stringifyError(err))
      }
    }

    if (isArray(_subscriptions)) {
      index = -1
      len = _subscriptions.length
      while (++index < len) {
        const sub = _subscriptions[index]
        if (isObject(sub)) {
          try {
            sub.unsubscribe()
          } catch (err) {
            hasErrors = true
            errors = errors || []
            errors.push(stringifyError(err))
          }
        }
      }
    }

    if (hasErrors) {
      throw new Error(errors)
    }
  }

}

Object.defineProperty(Subscription, 'EMPTY', {
  value: function (empty) {
      empty.closed = true
      return empty
    }(new Subscription()),
  writable: false,
  enumerable: true,
  configurable: false
})

module.exports = Subscription
