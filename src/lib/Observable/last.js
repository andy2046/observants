const Subscriber = require('../Subscriber')
const Observable = require('../Observable')

function higherOrderLast(predicate, resultSelector, defaultValue) {
  return (source) => source.lift(
    new LastOperator(predicate, resultSelector, defaultValue, source)
  )
}

class LastOperator {
  constructor(predicate, resultSelector, defaultValue, source) {
    this.predicate = predicate
    this.resultSelector = resultSelector
    this.defaultValue = defaultValue
    this.source = source
  }

  call(observer, source) {
    return source.subscribe(
      new LastSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source)
    )
  }
}

class LastSubscriber extends Subscriber {
  constructor(observer, predicate, resultSelector, defaultValue, source) {
    super(observer)
    this.predicate = predicate
    this.resultSelector = resultSelector
    this.defaultValue = defaultValue
    this.source = source
    this.hasValue = false
    this.index = 0
    if (typeof defaultValue !== 'undefined') {
        this.lastValue = defaultValue
        this.hasValue = true
    }
  }

  next(value) {
    const index = this.index++
    if (this.predicate) {
      this._tryPredicate(value, index)
    }
    else {
      if (this.resultSelector) {
        this._tryResultSelector(value, index)
        return
      }
      this.lastValue = value
      this.hasValue = true
    }
  }

  _tryPredicate(value, index) {
    let result
    try {
      result = this.predicate(value, index, this.source)
    } catch (err) {
      this.observer.error(err)
      return
    }
    if (result) {
      if (this.resultSelector) {
        this._tryResultSelector(value, index)
        return
      }
      this.lastValue = value
      this.hasValue = true
    }
  }

  _tryResultSelector(value, index) {
    let result
    try {
      result = this.resultSelector(value, index)
    }
    catch (err) {
      this.observer.error(err)
      return
    }
    this.lastValue = result
    this.hasValue = true
  }

  complete() {
    const observer = this.observer
    if (this.hasValue) {
      observer.next(this.lastValue)
      observer.complete()
    }
    else {
      observer.error(new EmptyError)
    }
  }
}

function last(predicate, resultSelector, defaultValue) {
  if (this instanceof Observable) {
    return higherOrderLast(predicate, resultSelector, defaultValue)(this)
  } else {
    return higherOrderLast(predicate, resultSelector, defaultValue)
  }
}

module.exports = last
