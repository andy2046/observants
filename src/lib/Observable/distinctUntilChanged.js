const Subscriber = require('../Subscriber')
const Observable = require('../Observable')

function higherOrderDistinctUntilChanged(compare, keySelector) {
  return (source) => source.lift(new DistinctUntilChangedOperator(compare, keySelector))
}

class DistinctUntilChangedOperator {
  constructor(compare, keySelector) {
    this.compare = compare
    this.keySelector = keySelector
  }

  call(subscriber, source) {
    return source.subscribe(
      new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector)
    )
  }
}

class DistinctUntilChangedSubscriber extends Subscriber {
  constructor(observer, compare, keySelector) {
    super(observer)
    this.keySelector = keySelector
    this.hasKey = false
    if (typeof compare === 'function') {
      this.compare = compare
    }
  }

  compare(x, y) {
    return x === y
  }

  next(value) {
    const keySelector = this.keySelector
    let key = value

    if (keySelector) {
      try {
        key = this.keySelector(value)
      } catch (err) {
        return this.observer.error(err)
      }
    }

    let result = false

    if (this.hasKey) {
      try {
        result = this.compare(this.key, key)
      } catch (err) {
        return this.observer.error(err)
      }
    } else {
      this.hasKey = true
    }

    if (Boolean(result) === false) {
      this.key = key
      this.observer.next(value)
    }
  }
}

function distinctUntilChanged(compare, keySelector) {
  if (this instanceof Observable) {
    return higherOrderDistinctUntilChanged(compare, keySelector)(this)
  } else {
    return higherOrderDistinctUntilChanged(compare, keySelector)
  }
}

module.exports = distinctUntilChanged
