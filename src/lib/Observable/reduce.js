const scan = require('./scan')
const takeLast = require('./takeLast')
const defaultIfEmpty = require('./defaultIfEmpty')
const { pipe } = require('../util/pipe')
const Observable = require('../Observable')

function higherOrderReduce (accumulator, seed) {
  if (arguments.length >= 2) {
    return function reduceOperatorFunctionWithSeed(source) {
      return pipe(
        scan(accumulator, seed),
        takeLast(1),
        defaultIfEmpty(seed)
      )(source)
    }
  }
  return function reduceOperatorFunction(source) {
    return pipe(
      scan((acc, value, index) => {
        return accumulator(acc, value, index + 1)
      }),
      takeLast(1)
    )(source)
  }
}

function reduce (accumulator, seed) {
  if (this instanceof Observable) {
    if (arguments.length >= 2) {
      return higherOrderReduce(accumulator, seed)(this)
    }
    return higherOrderReduce(accumulator)(this)
  } else {
    if (arguments.length >= 2) {
      return higherOrderReduce(accumulator, seed)
    }
    return higherOrderReduce(accumulator)
  }
}

module.exports = reduce
