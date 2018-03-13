const Observable = require('../Observable')
const Subscription = require('../Subscription')
const { isFunction } = require('../util')

const toString = Object.prototype.toString

function isNodeStyleEventEmitter(sourceObj) {
  return !!sourceObj && typeof sourceObj.addListener === 'function'
    && typeof sourceObj.removeListener === 'function'
}

function isJQueryStyleEventEmitter(sourceObj) {
  return !!sourceObj && typeof sourceObj.on === 'function'
    && typeof sourceObj.off === 'function'
}

function isNodeList(sourceObj) {
  return !!sourceObj && toString.call(sourceObj) === '[object NodeList]'
}

function isHTMLCollection(sourceObj) {
  return !!sourceObj && toString.call(sourceObj) === '[object HTMLCollection]'
}

function isEventTarget(sourceObj) {
  return !!sourceObj && typeof sourceObj.addEventListener === 'function'
    && typeof sourceObj.removeEventListener === 'function'
}

class FromEventObservable extends Observable {
  constructor(sourceObj, eventName, selector, options) {
    super()
    this.sourceObj = sourceObj
    this.eventName = eventName
    this.selector = selector
    this.options = options
  }
  
  static create(target, eventName, options, selector) {
    if (isFunction(options)) {
      selector = options
      options = undefined
    }
    return new FromEventObservable(target, eventName, selector, options)
  }

  static setupSubscription(sourceObj, eventName, handler, subscriber, options) {
    let unsubscribe
    if (isNodeList(sourceObj) || isHTMLCollection(sourceObj)) {
      for (let i = 0, len = sourceObj.length; i < len; i++) {
        FromEventObservable.setupSubscription(sourceObj[i], eventName, handler, subscriber, options)
      }
    }
    else if (isEventTarget(sourceObj)) {
      const source = sourceObj
      sourceObj.addEventListener(eventName, handler, options)
      unsubscribe = () => source.removeEventListener(eventName, handler)
    }
    else if (isJQueryStyleEventEmitter(sourceObj)) {
      const source = sourceObj
      sourceObj.on(eventName, handler)
      unsubscribe = () => source.off(eventName, handler)
    }
    else if (isNodeStyleEventEmitter(sourceObj)) {
      const source = sourceObj
      sourceObj.addListener(eventName, handler)
      unsubscribe = () => source.removeListener(eventName, handler)
    }
    else {
      throw new TypeError('Invalid event target')
    }
    subscriber.add(new Subscription(unsubscribe))
  }

  _subscribe(subscriber) {
    const sourceObj = this.sourceObj
    const eventName = this.eventName
    const options = this.options
    const selector = this.selector
    let handler = selector ? (...args) => {
      try {
        let result = selector(...args)
        subscriber.next(result)
      } catch (err) {
        subscriber.error(err)
      }
    } : (e) => subscriber.next(e)
    FromEventObservable.setupSubscription(sourceObj, eventName, handler, subscriber, options)
  }
}

module.exports = FromEventObservable
