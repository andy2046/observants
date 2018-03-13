const Subscriber = require('../Subscriber')
const Observable = require('../Observable')

function higherOrderBufferCount(bufferSize, startBufferEvery = null) {
  return function bufferCountOperatorFunction(source) {
    return source.lift(new BufferCountOperator(bufferSize, startBufferEvery))
  }
}

class BufferCountOperator {
  constructor(bufferSize, startBufferEvery) {
    this.bufferSize = bufferSize
    this.startBufferEvery = startBufferEvery
    if (!startBufferEvery || bufferSize === startBufferEvery) {
      this.subscriberClass = BufferCountSubscriber
    }
    else {
      this.subscriberClass = BufferSkipCountSubscriber
    }
  }

  call(subscriber, source) {
    return source.subscribe(
      new this.subscriberClass(subscriber, this.bufferSize, this.startBufferEvery)
    )
  }
}

class BufferCountSubscriber extends Subscriber {
  constructor(observer, bufferSize) {
    super(observer)
    this.bufferSize = bufferSize
    this.buffer = []
  }

  next(value) {
    const buffer = this.buffer
    buffer.push(value)
    if (buffer.length == this.bufferSize) {
      this.observer.next(buffer)
      this.buffer = []
    }
  }

  complete() {
    const buffer = this.buffer
    if (buffer.length > 0) {
      this.observer.next(buffer)
    }
    super.complete()
  }
}

class BufferSkipCountSubscriber extends Subscriber {
  constructor(observer, bufferSize, startBufferEvery) {
    super(observer)
    this.bufferSize = bufferSize
    this.startBufferEvery = startBufferEvery
    this.buffers = []
    this.count = 0
  }

  next(value) {
    const { bufferSize, startBufferEvery, buffers, count } = this
    this.count++
    if (count % startBufferEvery === 0) {
      buffers.push([])
    }
    for (let i = buffers.length; i--;) {
      const buffer = buffers[i]
      buffer.push(value)
      if (buffer.length === bufferSize) {
        buffers.splice(i, 1)
        this.observer.next(buffer)
      }
    }
  }

  complete() {
    const { buffers, observer } = this
    while (buffers.length > 0) {
      let buffer = buffers.shift()
      if (buffer.length > 0) {
        observer.next(buffer)
      }
    }
    super.complete()
  }
}

function bufferCount(bufferSize, startBufferEvery = null) {
  if (this instanceof Observable) {
    return higherOrderBufferCount(bufferSize, startBufferEvery)(this)
  } else {
    return higherOrderBufferCount(bufferSize, startBufferEvery)
  }
}

module.exports = bufferCount
