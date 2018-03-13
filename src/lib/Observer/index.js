const { isFunctionOrError, noop } = require('../util')

class Observer {
  constructor (observer) {
    this._observer = observer
    this._onUnsubscribe = noop
    this.closed = false
    if (observer === Observer.EMPTY) {
      this.closed = true
    }
    this.unsubscribe = this.unsubscribe.bind(this)
  }

  next (value) {
    if (!this.closed) {
      try {
        isFunctionOrError(this._observer.next) && this._observer.next(value)
      } catch (err) {
        this.unsubscribe()
        throw err
      }
    }
  }

  complete () {
    if (!this.closed) {
      try {
        isFunctionOrError(this._observer.complete) && this._observer.complete()
      } catch (err) {
        throw err
      } finally {
        this.unsubscribe()
      }
    }
  }

  error (err) {
    if (!this.closed) {
      try {
        if (isFunctionOrError(this._observer.error)) {
          this._observer.error(err)
        } else {
          throw err
        }
      } catch (err2) {
        throw err2
      } finally {
        this.unsubscribe()
      }
    }
  }

  onUnsubscribe (x) {
    if (isFunctionOrError(x)) {
      this._onUnsubscribe = x
    }
  }

  unsubscribe () {
    if (this.closed) {
      return
    }

    this.closed = true

    if (this._observer.unsubscribe) {
      this._observer.unsubscribe()
    }

    this._onUnsubscribe()
  }

}

Object.defineProperty(Observer, 'EMPTY', {
  value: {
    closed: true,
    next(value) { },
    error(err) { throw err },
    complete() { },
    onUnsubscribe() { },
    unsubscribe() { }
  },
  writable: false,
  enumerable: true,
  configurable: false
})

module.exports = Observer
