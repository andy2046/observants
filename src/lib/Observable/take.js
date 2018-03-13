const Subscriber = require('../Subscriber')
const EmptyObservable = require('../EmptyObservable')
const Observable = require('../Observable')

function higherOrderTake(count) {
  return (source) => {
    if (count === 0) {
      return new EmptyObservable()
    } else {
      return source.lift(new TakeOperator(count))
    }
  }
}

class TakeOperator {
  constructor(total) {
    this.total = total
    if (this.total < 0) {
      throw new Error('Argument Out Of Range Error.')
    }
  }

  call(subscriber, source) {
    return source.subscribe(new TakeSubscriber(subscriber, this.total))
  }
}

class TakeSubscriber extends Subscriber {
  constructor(observer, total) {
    super(observer)
    this.total = total
    this.count = 0
  }

  next(value) {
    const total = this.total
    const count = ++this.count
    if (count <= total) {
      this.observer.next(value)
      if (count === total) {
        this.observer.complete()
        this.unsubscribe()
      }
    }
  }
}

function take(count) {
  if (this instanceof Observable) {
    return higherOrderTake(count)(this)
  } else {
    return higherOrderTake(count)
  }
}

module.exports = take
