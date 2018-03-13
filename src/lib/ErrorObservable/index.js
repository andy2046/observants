const Observable = require('../Observable')

class ErrorObservable extends Observable {
  constructor(error) {
    super()
    this.error = error
  }
  
  static create(error) {
    return new ErrorObservable(error)
  }

  static dispatch(arg) {
    const { error, subscriber } = arg
    subscriber.error(error)
  }

  _subscribe(subscriber) {
    const error = this.error
    subscriber.error(error)
  }
}

module.exports = ErrorObservable
