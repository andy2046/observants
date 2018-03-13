const Subscriber = require('../Subscriber')
const Observable = require('../Observable')

function higherOrderScan (accumulator, seed) {
  let hasSeed = false
  if (arguments.length >= 2) {
    hasSeed = true
  }
  return function scanOperatorFunction (source) {
    return source.lift(new ScanOperator(accumulator, seed, hasSeed))
  }
}

class ScanOperator {
  constructor (accumulator, seed, hasSeed = false) {
    this.accumulator = accumulator
    this.seed = seed
    this.hasSeed = hasSeed
  }

  call (subscriber, source) {
    return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed))
  }
}

class ScanSubscriber extends Subscriber {
    constructor (observer, accumulator, _seed, hasSeed) {
      super(observer)
      this.accumulator = accumulator
      this._seed = _seed
      this.hasSeed = hasSeed
      this.index = 0
    }

    get seed () {
      return this._seed
    }

    set seed (value) {
      this.hasSeed = true
      this._seed = value
    }

    next (value) {
      if (!this.hasSeed) {
        this.seed = value
        this.observer.next(value)
      } else {
        return this._tryNext(value)
      }
    }

    _tryNext (value) {
      const index = this.index++
      let result
      try {
        result = this.accumulator(this.seed, value, index)
      }
      catch (err) {
        this.observer.error(err)
      }
      this.seed = result
      this.observer.next(result)
    }
}

function scan(accumulator, seed) {
  if (this instanceof Observable) {
    if (arguments.length >= 2) {
      return higherOrderScan(accumulator, seed)(this)
    }
    return higherOrderScan(accumulator)(this)
  } else {
    if (arguments.length >= 2) {
      return higherOrderScan(accumulator, seed)
    }
    return higherOrderScan(accumulator)
  }
}

module.exports = scan
