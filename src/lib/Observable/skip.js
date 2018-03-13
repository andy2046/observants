const Subscriber = require('../Subscriber')
const Observable = require('../Observable')

function higherOrderSkip(count) {
  return (source) => source.lift(new SkipOperator(count))
}

class SkipOperator {
  constructor(total) {
    this.total = total
  }

  call(subscriber, source) {
    return source.subscribe(new SkipSubscriber(subscriber, this.total))
  }
}

class SkipSubscriber extends Subscriber {
  constructor(observer, total) {
    super(observer)
    this.total = total
    this.count = 0
  }

  next(x) {
    if (++this.count > this.total) {
      this.observer.next(x)
    }
  }
}

function skip(count) {
  if (this instanceof Observable) {
    return higherOrderSkip(count)(this)
  } else {
    return higherOrderSkip(count)
  }
}

module.exports = skip
