const Subscriber = require('../Subscriber')
const EmptyObservable = require('../EmptyObservable')
const Observable = require('../Observable')

function higherOrderTakeLast (count) {
  return function takeLastOperatorFunction (source) {
    if (count === 0) {
      return new EmptyObservable()
    }
    else {
      return source.lift(new TakeLastOperator(count))
    }
  }
}

class TakeLastOperator {
  constructor (total) {
    this.total = total
    if (this.total < 0) {
      throw new Error('Argument Out Of Range Error.')
    }
  }

  call (subscriber, source) {
    return source.subscribe(new TakeLastSubscriber(subscriber, this.total))
  }
}

class TakeLastSubscriber extends Subscriber {
  constructor (observer, total) {
    super(observer)
    this.total = total
    this.ring = new Array()
    this.count = 0
  }

  next (value) {
    const ring = this.ring
    const total = this.total
    const count = this.count++
    if (ring.length < total) {
      ring.push(value)
    }
    else {
      const index = count % total
      ring[index] = value
    }
  }

  complete () {
    const observer = this.observer
    let count = this.count
    if (count > 0) {
      const total = this.count >= this.total ? this.total : this.count
      const ring = this.ring
      for (let i = 0; i < total; i++) {
        const idx = (count++) % total
        observer.next(ring[idx])
      }
    }
    observer.complete()
  }
}

function takeLast (count) {
  if (this instanceof Observable) {
    return higherOrderTakeLast(count)(this)
  } else {
    return higherOrderTakeLast(count)
  }
}

module.exports = takeLast
