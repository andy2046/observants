const Subscriber = require('../Subscriber')

class OuterSubscriber extends Subscriber {
  notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
    this.observer.next(innerValue)
  }
  notifyError(error, innerSub) {
    this.observer.error(error)
  }
  notifyComplete(innerSub) {
    this.observer.complete()
  }
}

module.exports = OuterSubscriber
