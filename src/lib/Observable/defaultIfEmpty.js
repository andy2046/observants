const Subscriber = require('../Subscriber')
const Observable = require('../Observable')

function higherOrderDefaultIfEmpty (defaultValue = null) {
  return (source) => source.lift(new DefaultIfEmptyOperator(defaultValue))
}

class DefaultIfEmptyOperator {
  constructor (defaultValue) {
    this.defaultValue = defaultValue
  }

  call (subscriber, source) {
    return source.subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue))
  }
}

class DefaultIfEmptySubscriber extends Subscriber {
    constructor (observer, defaultValue) {
      super(observer)
      this.defaultValue = defaultValue
      this.isEmpty = true
    }

    next (value) {
      this.isEmpty = false
      this.observer.next(value)
    }

    complete () {
      if (this.isEmpty) {
        this.observer.next(this.defaultValue)
      }
      this.observer.complete()
    }
}

function defaultIfEmpty (defaultValue = null) {
  if (this instanceof Observable) {
    return higherOrderDefaultIfEmpty(defaultValue)(this)
  } else {
    return higherOrderDefaultIfEmpty(defaultValue)
  }
}

module.exports = defaultIfEmpty
