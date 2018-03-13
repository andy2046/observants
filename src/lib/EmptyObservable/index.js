const Observable = require('../Observable')

class EmptyObservable extends Observable {
  constructor () {
    super()
  }
  
  static create () {
    return new EmptyObservable()
  }

  static dispatch (arg) {
    const { subscriber } = arg
    subscriber.complete()
  }

  _subscribe (subscriber) {
    subscriber.complete()
  }

}

module.exports = EmptyObservable
