const Subscriber = require('../Subscriber')
const Observable = require('../Observable')

function tap(nextOrObserver, error, complete) {
  return function tapOperatorFunction(source) {
    return source.lift(new DoOperator(nextOrObserver, error, complete))
  }
}

class DoOperator {
  constructor(nextOrObserver, error, complete) {
    this.nextOrObserver = nextOrObserver
    this.error = error
    this.complete = complete
  }

  call(subscriber, source) {
    return source.subscribe(
      new DoSubscriber(subscriber, this.nextOrObserver, this.error, this.complete)
    )
  }
}

class DoSubscriber extends Subscriber {
    constructor(observer, nextOrObserver, error, complete) {
      super(observer)
      const safeSubscriber = new Subscriber(nextOrObserver, error, complete)
      this.add(safeSubscriber)
      this.safeSubscriber = safeSubscriber
    }

    next(value) {
      const { safeSubscriber } = this
      safeSubscriber.next(value)
      this.observer.next(value)
    }

    error(err) {
      const { safeSubscriber } = this
      safeSubscriber.error(err)
      this.observer.error(err)
    }

    complete() {
      const { safeSubscriber } = this
      safeSubscriber.complete()
      this.observer.complete()
    }
}

function doOperator(nextOrObserver, error, complete) {
  if (this instanceof Observable) {
    return tap(nextOrObserver, error, complete)(this)
  } else {
    return tap(nextOrObserver, error, complete)
  }
}

module.exports = doOperator
