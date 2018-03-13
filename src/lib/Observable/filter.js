const Subscriber = require('../Subscriber')
const { isFunctionOrError } = require('../util')
const Observable = require('../Observable')

function higherOrderFilter (predicate, thisArg) {
  return function filterOperatorFunction (source) {
    return source.lift(new FilterOperator(predicate, thisArg))
  }
}

class FilterOperator {
  constructor (predicate, thisArg) {
    this.predicate = predicate
    this.thisArg = thisArg
  }

  call (subscriber, source) {
    return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg))
  }
}

class FilterSubscriber extends Subscriber {
  constructor (observer, predicate, thisArg) {
    super(observer)
    this.predicate = predicate
    this.thisArg = thisArg
    this.count = 0
  }

  next (value) {
    let result
    try {
      result = this.predicate.call(this.thisArg, value, this.count++)
    }
    catch (err) {
      this.observer.error(err)
      return
    }
    if (result) {
      this.observer.next(value)
    }
  }
}

function filter (predicate, thisArg) {
  if (this instanceof Observable) {
    return higherOrderFilter(predicate, thisArg)(this)
  } else {
    return higherOrderFilter(predicate, thisArg)
  }
}

module.exports = filter
