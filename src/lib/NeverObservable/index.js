const Observable = require('../Observable')
const { noop } = require('../util')

class NeverObservable extends Observable {
  constructor () {
    super()
  }

  static create () {
    return new NeverObservable()
  }

  _subscribe (subscriber) {
    noop()
  }
}

module.exports = NeverObservable
