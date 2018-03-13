const Subscriber = require('../Subscriber')
const { isFunctionOrError } = require('../util')
const Observable = require('../Observable')

function higherOrderMap (project, thisArg) {
  return function mapOperation (source) {
    isFunctionOrError(project)
    return source.lift(new MapOperator(project, thisArg))
  }
}

class MapOperator {
  constructor (project, thisArg) {
    this.project = project
    this.thisArg = thisArg
  }

  call (subscriber, source) {
    return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg))
  }
}

class MapSubscriber extends Subscriber {
  constructor (observer, project, thisArg) {
    super(observer)
    this.project = project
    this.count = 0
    this.thisArg = thisArg || this
  }

  next (value) {
    let result
    try {
      result = this.project.call(this.thisArg, value, this.count++)
    }
    catch (err) {
      this.observer.error(err)
      return
    }
    this.observer.next(result)
  }
}

function map (project, thisArg) {
  if (this instanceof Observable) {
    return higherOrderMap(project, thisArg)(this)
  } else {
    return higherOrderMap(project, thisArg)
  }
}

module.exports = map
