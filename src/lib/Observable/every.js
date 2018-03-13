const Subscriber = require('../Subscriber')
const Observable = require('../Observable')

function higherOrderEvery(predicate, thisArg) {
  return (source) => source.lift(new EveryOperator(predicate, thisArg, source))
}

class EveryOperator {
  constructor(predicate, thisArg, source) {
    this.predicate = predicate
    this.thisArg = thisArg
    this.source = source
  }

  call(observer, source) {
    return source.subscribe(
      new EverySubscriber(observer, this.predicate, this.thisArg, this.source)
    )
  }
}

class EverySubscriber extends Subscriber {
  constructor(observer, predicate, thisArg, source) {
    super(observer)
    this.predicate = predicate
    this.source = source
    this.index = 0
    this.thisArg = thisArg || this
  }

  notifyComplete(everyValueMatch) {
    this.observer.next(everyValueMatch)
    this.observer.complete()
  }

  next(value) {
    let result = false
    try {
      result = this.predicate.call(this.thisArg, value, this.index++, this.source)
    }
    catch (err) {
      this.observer.error(err)
      return
    }
    if (!result) {
      this.notifyComplete(false)
    }
  }

  complete() {
    this.notifyComplete(true)
  }
}

function every(predicate, thisArg) {
  if (this instanceof Observable) {
    return higherOrderEvery(predicate, thisArg)(this)
  } else {
    return higherOrderEvery(predicate, thisArg)
  }
}

module.exports = every
