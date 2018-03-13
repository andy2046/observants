const Observer = require('../Observer')
const Subscriber = require('../Subscriber')

function toSubscriber (nextOrObserver, error, complete) {
  if (nextOrObserver) {
    if (nextOrObserver instanceof Subscriber) {
      return nextOrObserver
    }
  }

  if (!nextOrObserver && !error && !complete) {
    return new Subscriber(Observer.EMPTY)
  }

  return new Subscriber(nextOrObserver, error, complete)
}

module.exports = toSubscriber
