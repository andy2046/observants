const Subscriber = require('../Subscriber')
const { isDate } = require('../util')
const Observable = require('../Observable')

function higherOrderTimeout(due) {
  const absoluteTimeout = isDate(due)
  const waitFor = absoluteTimeout ? (+due - Date.now()) : Math.abs(due)
  return (source) => source.lift(
    new TimeoutOperator(waitFor, absoluteTimeout, new Error('Timeout Error'))
  )
}

class TimeoutOperator {
  constructor(waitFor, absoluteTimeout, errorInstance) {
    this.waitFor = waitFor
    this.absoluteTimeout = absoluteTimeout
    this.errorInstance = errorInstance
  }

  call(subscriber, source) {
    return source.subscribe(
      new TimeoutSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.errorInstance)
    )
  }
}

class TimeoutSubscriber extends Subscriber {
  constructor(observer, absoluteTimeout, waitFor, errorInstance) {
    super(observer)
    this.absoluteTimeout = absoluteTimeout
    this.waitFor = waitFor
    this.errorInstance = errorInstance
    this.action = null
    this.scheduleTimeout()
  }

  static dispatchTimeout(subscriber) {
    subscriber.error(subscriber.errorInstance)
  }

  scheduleTimeout() {
    const { action, waitFor } = this
    const context = this
    if (action) {
      clearTimeout(action)
    }
    const timeoutId = setTimeout(() => TimeoutSubscriber.dispatchTimeout(context), waitFor)
    this.action = timeoutId
    this.add(() => clearTimeout(timeoutId))
  }
  
  next(value) {
    if (!this.absoluteTimeout) {
      this.scheduleTimeout()
    }
    super.next(value)
  }
  
  unsubscribe() {
    this.action = null
    this.errorInstance = null
  }
}

function timeout(due) {
  if (this instanceof Observable) {
    return higherOrderTimeout(due)(this)
  } else {
    return higherOrderTimeout(due)
  }
}

module.exports = timeout
