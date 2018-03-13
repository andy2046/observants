const Subscriber = require('../Subscriber')
const Observable = require('../Observable')

function higherOrderRetry(count = -1) {
  return (source) => source.lift(new RetryOperator(count, source))
}

class RetryOperator {
  constructor(count, source) {
    this.count = count
    this.source = source
  }

  call(subscriber, source) {
    return source.subscribe(new RetrySubscriber(subscriber, this.count, this.source))
  }
}

class RetrySubscriber extends Subscriber {
  constructor(destination, count, source) {
    super(destination)
    this.count = count
    this.source = source
  }

  error(err) {
    if (!this.isUnsubscribed) {
      const { source, count } = this
      if (count === 0) {
        return super.error(err)
      }
      else if (count > -1) {
        this.count = count - 1
      }
      source.subscribe(this._unsubscribeAndRecycle())
    }
  }
}

function retry(count = -1) {
  if (this instanceof Observable) {
    return higherOrderRetry(count)(this)
  } else {
    return higherOrderRetry(count)
  }
}

module.exports = retry
