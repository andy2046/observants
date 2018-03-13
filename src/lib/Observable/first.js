const Subscriber = require('../Subscriber')
const Observable = require('../Observable')

function higherOrderFirst(predicate, resultSelector, defaultValue) {
  return (source) => source.lift(
    new FirstOperator(predicate, resultSelector, defaultValue, source)
  )
}

class FirstOperator {
  constructor(predicate, resultSelector, defaultValue, source) {
    this.predicate = predicate
    this.resultSelector = resultSelector
    this.defaultValue = defaultValue
    this.source = source
  }

  call(observer, source) {
    return source.subscribe(
      new FirstSubscriber(observer, this.predicate, this.resultSelector, this.defaultValue, this.source)
    )
  }
}

class FirstSubscriber extends Subscriber {
  constructor(observer, predicate, resultSelector, defaultValue, source) {
    super(observer)
    this.predicate = predicate
    this.resultSelector = resultSelector
    this.defaultValue = defaultValue
    this.source = source
    this.index = 0
    this.hasCompleted = false
    this._emitted = false
  }

  next(value) {
    const index = this.index++
    if (this.predicate) {
      this._tryPredicate(value, index)
    }
    else {
      this._emit(value, index)
    }
  }

  _tryPredicate(value, index) {
    let result
    try {
      result = this.predicate(value, index, this.source)
    }
    catch (err) {
      this.observer.error(err)
      return
    }
    if (result) {
      this._emit(value, index)
    }
  }

  _emit(value, index) {
    if (this.resultSelector) {
      this._tryResultSelector(value, index)
      return
    }
    this._emitFinal(value)
  }

  _tryResultSelector(value, index) {
    let result
    try {
      result = this.resultSelector(value, index)
    } catch (err) {
      this.observer.error(err)
      return
    }
    this._emitFinal(result)
  }

  _emitFinal(value) {
    const observer = this.observer
    if (!this._emitted) {
      this._emitted = true
      observer.next(value)
      observer.complete()
      this.hasCompleted = true
    }
  }

  complete() {
    const observer = this.observer
    if (!this.hasCompleted && typeof this.defaultValue !== 'undefined') {
      observer.next(this.defaultValue)
      observer.complete()
    }
    else if (!this.hasCompleted) {
      observer.error(new Error('no element in sequence.'))
    }
  }
}

function first(predicate, resultSelector, defaultValue) {
  if (this instanceof Observable) {
    return higherOrderFirst(predicate, resultSelector, defaultValue)(this)
  } else {
    return higherOrderFirst(predicate, resultSelector, defaultValue)
  }
}

module.exports = first
